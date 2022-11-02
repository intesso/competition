import axios, { AxiosError } from 'axios'
import { IGetApplicationContext } from '../../applicationContext'
import { CalculationPointsInput, ICalculationContext, CalculationPointsOutput, CalculationCategoryRanksInput, CalculationCategoryRanksOutput, CalculationCombinationRanksInput, CalculationCombinationRanksOutput, CategoryRank } from './interfaces'
import { findCategoryPointByCategoryId, insertOrUpdateCategoryPoint, insertOrUpdateCategoryRanks } from './repository'

export class CalculationService implements ICalculationContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async calculatePoints (input: CalculationPointsInput): Promise<CalculationPointsOutput | null> {
    console.log('calculation input', JSON.stringify(input, null, 2))
    try {
      const result = (await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/points`, input)).data as CalculationPointsOutput
      console.log('calculation output', JSON.stringify(result, null, 2))
      insertOrUpdateCategoryPoint({
        tournamentId: input.tournamentId,
        performanceId: input.performanceId,
        categoryId: input.categoryId,
        categoryPoint: result.calculatedCategoryPoints,
        criteriaPoints: result.judgeCriteria
      })
      return result
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
        return error.response?.data
      } else {
        console.error(error)
        return null
      }
    }
  }

  async calculateCategoryRanks (input: CalculationCategoryRanksInput): Promise<CalculationCategoryRanksOutput> {
    const sortedCategoryPoints = await findCategoryPointByCategoryId(input.tournamentId, input.categoryId)

    // 1. calculate category rank based on category points for the given category and tournament
    let numberOfEqualPoints = 0
    let currentRank = 1
    const categoryRanks = sortedCategoryPoints.map((categoryPoint, i) => {
      if (i > 0 && categoryPoint === sortedCategoryPoints[i - 1]) {
        numberOfEqualPoints++
      } else {
        currentRank = numberOfEqualPoints > 0 ? currentRank + numberOfEqualPoints + 1 : currentRank + 1
        numberOfEqualPoints = 0
      }

      const categoryRank : CategoryRank = {
        categoryId: categoryPoint.categoryId,
        tournamentId: categoryPoint.tournamentId,
        categoryPointId: categoryPoint.id,
        categoryRank: currentRank
      }
      console.log(categoryRank)
      return categoryRank
    })

    // local calculation, does not need to call calculation engine
    // const { data } = await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/category-ranks`, input)

    // 2. store categoryRanks
    try {
      await insertOrUpdateCategoryRanks(categoryRanks)
    } catch (error) {
      console.error(error)
    }

    return categoryRanks
  }

  async calculateCombinationRanks (input: CalculationCombinationRanksInput): Promise<CalculationCombinationRanksOutput> {
    const { data } = await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/combination-ranks`, input)
    return data
  }
}
