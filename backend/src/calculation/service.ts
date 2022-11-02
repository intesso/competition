import axios, { AxiosError } from 'axios'
import { IGetApplicationContext } from '../../applicationContext'
import { CalculationPointsInput, ICalculationContext, CalculationPointsOutput, CalculationCategoryRanksInput, CalculationCategoryRanksOutput, CalculationCombinationRanksInput, CalculationCombinationRanksOutput } from './interfaces'
import { insertOrUpdateCategoryPoint } from './repository'

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
    const { data } = await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/category-ranks`, input)
    return data
  }

  async calculateCombinationRanks (input: CalculationCombinationRanksInput): Promise<CalculationCombinationRanksOutput> {
    const { data } = await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/combination-ranks`, input)
    return data
  }
}
