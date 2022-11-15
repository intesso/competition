import axios, { AxiosError } from 'axios'
import { keyBy, sortBy } from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import {
  CalculationPointsInput,
  ICalculationContext,
  CalculationPointsOutput,
  CalculationCategoryRanksInput,
  CalculationCategoryRanksOutput,
  CalculationCombinationRanksInput,
  CalculationCombinationRanksOutput,
  CategoryRank,
  CombinationRank,
  CategoryPoint
} from './interfaces'
import {
  deleteCategoryPointById,
  deleteCategoryRankById,
  findCategoryPointByCategoryId,
  findCategoryRankByCategoryId,
  findCombinationRankByCombinationId,
  getCategoryPointByPerformanceId,
  getCategoryRankByCategoryPointId,
  insertCombinationRank,
  insertOrUpdateCategoryPoint,
  insertOrUpdateCategoryRanks,
  updateCategoryPoint,
  updateCategoryRank
} from './repository'

export class CalculationService implements ICalculationContext {
  getApplicationContext
  constructor (getApplicationContext: IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async calculateAllPoints (tournamentId: string): Promise<boolean | null> {
    const ctx = await this.getApplicationContext()
    try {
      const performances = await this.getApplicationContext().tournament.listPerformances(tournamentId)
      for (const performance of performances) {
        const rawPoints = await ctx.judging.listRawPoints(performance.id)
        if (rawPoints.length > 0) {
          const calculationMessage = await ctx.judging.prepareCalculationMessage(performance.id, rawPoints, new Date())
          if (calculationMessage) {
            this.calculatePoints(calculationMessage)
          } else {
            console.error(`could not prepareCalculationMessage for ${JSON.stringify(performance)}`)
          }
        } else {
          console.log(`no rawPoints found for performanceId: ${performance.id}, performanceName: ${performance.performanceName}`)
        }
      }
    } catch (error) {
      return false
    }
    return true
  }

  async calculatePoints (input: CalculationPointsInput): Promise<CalculationPointsOutput | null> {
    console.log('calculation input', JSON.stringify(input, null, 2))
    try {
      const result = (await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations/points`, input))
        .data as CalculationPointsOutput
      console.log('calculation output', JSON.stringify(result, null, 2))
      insertOrUpdateCategoryPoint({
        tournamentId: input.tournamentId,
        performerId: input.performerId,
        performanceId: input.performanceId,
        disqualified: input.disqualified,
        categoryId: input.categoryId,
        categoryPoint: input.disqualified ? -1 : result.calculatedCategoryPoints,
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

  async getPoints (performanceId: string) :Promise<CategoryPoint | null> {
    return await getCategoryPointByPerformanceId(performanceId)
  }

  async calculateAllCategoryRanks (tournamentId: string): Promise<boolean | null> {
    const categories = await this.getApplicationContext().judging.listCategories()
    try {
      for (const category of (categories || [])) {
        await this.calculateCategoryRanks({ tournamentId, categoryId: category.id })
      }
    } catch (error) {
      return false
    }
    return true
  }

  async calculateCategoryRanks (input: CalculationCategoryRanksInput): Promise<CalculationCategoryRanksOutput> {
    const sortedCategoryPoints = await findCategoryPointByCategoryId(input.tournamentId, input.categoryId)

    // 1. calculate category rank based on category points for the given category and tournament
    let numberOfEqualPoints = 0
    let currentRank = 0
    const categoryRanks = sortedCategoryPoints.map((categoryPoint, i) => {
      // if disqualified do nothing
      if (categoryPoint.disqualified) {
        // handle equal points
      } else if (i > 0 && categoryPoint === sortedCategoryPoints[i - 1]) {
        numberOfEqualPoints++
        // normal case: different points
      } else {
        currentRank = numberOfEqualPoints > 0 ? currentRank + numberOfEqualPoints + 1 : currentRank + 1
        numberOfEqualPoints = 0
      }

      const categoryRank: CategoryRank = {
        categoryId: categoryPoint.categoryId,
        tournamentId: categoryPoint.tournamentId,
        disqualified: categoryPoint.disqualified,
        categoryPointId: categoryPoint.id,
        categoryRank: categoryPoint.disqualified ? -1 : currentRank
      }
      return categoryRank
    })

    // 2. store categoryRanks
    try {
      await insertOrUpdateCategoryRanks(categoryRanks)
    } catch (error) {
      console.error(error)
    }

    return categoryRanks
  }

  async calculateAllCombinationRanks (tournamentId: string): Promise<boolean | null> {
    const weightedCombinations = await this.getApplicationContext().judging.listWeightedCombinations()
    try {
      for (const combination of (weightedCombinations || [])) {
        await this.calculateCombinationRanks({ tournamentId, combinationId: combination.combinationId })
      }
    } catch (error) {
      return false
    }
    return true
  }

  async getCategoryRanks (tournamentId: string, categoryId: string): Promise<CalculationCategoryRanksOutput | null> {
    const sortedCategoryRanks = await findCategoryRankByCategoryId(tournamentId, categoryId)
    return sortedCategoryRanks
  }

  async calculateCombinationRanks (input: CalculationCombinationRanksInput): Promise<CalculationCombinationRanksOutput> {
    const combination = await this.getApplicationContext().judging.listWeightedCombination(input.combinationId)
    const combinationByCategory: { [key: string]: (CombinationRank)[] } = {} // key: categoryId

    // 1. prepare and calculate the combination rank
    // only consider performers that competed in all categories for the combination
    const combinationPerformer: { [key: string]: number } = {} // key: performerId
    const performerWeightedRank: { [key: string]: number } = {} // key: performerId
    const numberOfCategoriesInCombination = combination.categories.length
    for (const category of combination.categories) {
      const sortedCategoryRanks = await findCategoryRankByCategoryId(input.tournamentId, category.categoryId)
      const sortedCategoryPoints = keyBy(
        await findCategoryPointByCategoryId(input.tournamentId, category.categoryId),
        'id'
      )
      const combinedRanks: (CombinationRank)[] = sortedCategoryRanks.map((rank) => ({
        ...rank,
        ...sortedCategoryPoints[rank.categoryPointId],
        combinationRank: -1,
        categoryWeight: category.categoryWeight
      }))
      combinationByCategory[category.categoryId] = combinedRanks

      for (const rank of combinedRanks) {
        combinationPerformer[rank.performerId] = combinationPerformer[rank.performerId] || 0
        combinationPerformer[rank.performerId] = combinationPerformer[rank.performerId] + 1
      }
    }

    // recalculate combination rank rank
    for (const ranks of Object.values(combinationByCategory)) {
      // only keep the performances of performers that competed in all categieries in the combination
      const filteredRanks = ranks.filter(it => {
        if (it.performerId && combinationPerformer[it.performerId] && combinationPerformer[it.performerId] === numberOfCategoriesInCombination) {
          return true
        }
        return false
      })

      filteredRanks.map((it, i) => {
        it.combinationRank = i + 1
        performerWeightedRank[it.performerId] = performerWeightedRank[it.performerId] || 0
        performerWeightedRank[it.performerId] = performerWeightedRank[it.performerId] + (it.combinationRank * it.categoryWeight)
        return it
      })
    }

    // sort calculated combination ranks
    const calculatedCombinationRanks = sortBy(Object.entries(performerWeightedRank), it => it[1])
      .map(([performerId, calculatedRank], i) => {
        return {
          performerId, calculatedRank, i
        }
      })

    // 2. store the combination rank
    await insertCombinationRank({
      tournamentId: input.tournamentId,
      combinationId: input.combinationId,
      combinationRanks: {
        combinationRanks: calculatedCombinationRanks,
        combinationByCategory
      }
    })

    return input
  }

  async getCombinationRanks (combinationId: string): Promise<CalculationCombinationRanksOutput | null> {
    const sortedCategoryRanks = await findCombinationRankByCombinationId(combinationId)
    return sortedCategoryRanks
  }

  async setDisqualified (performanceId: string, disqualified: boolean): Promise<boolean> {
    try {
      const categoryPoint = await getCategoryPointByPerformanceId(performanceId)
      if (!categoryPoint) {
        return true
      }
      const updatedCategoryPoint = await updateCategoryPoint({ ...categoryPoint, disqualified })
      if (!updatedCategoryPoint) {
        return true
      }
      const categoryRank = await getCategoryRankByCategoryPointId(categoryPoint.id)
      if (!categoryRank) {
        return true
      }
      await updateCategoryRank({ ...categoryRank, disqualified })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async removeCalculation (performanceId: string) : Promise<boolean> {
    try {
      const categoryPoint = await getCategoryPointByPerformanceId(performanceId)
      if (!categoryPoint) {
        return true
      }
      const categoryRank = await getCategoryRankByCategoryPointId(categoryPoint.id)

      await deleteCategoryPointById(categoryPoint.id)
      if (categoryRank) {
        deleteCategoryRankById(categoryRank.id)
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
