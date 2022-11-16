import axios, { AxiosError } from 'axios'
import { keyBy, sortBy } from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import { generateCategoryReport } from '../lib/reports/category-report'
import { generateCombinationReport } from '../lib/reports/combination-report'
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
  CategoryPoint,
  CalculationJudgeCriteriaGroup,
  CategoryRanksSummary,
  CategoryRankDetails,
  CategoryRanksDetailsResult,
  CategoryRanksDetailsAllResult
} from './interfaces'
import {
  deleteCategoryPointById,
  deleteCategoryRankById,
  findCategoryPointByCategoryId,
  findCategoryRankByCategoryId,
  getCombinationRankByCombinationId,
  getCategoryPointById,
  getCategoryPointByPerformanceId,
  getCategoryRankByCategoryPointId,
  insertOrUpdateCategoryPoint,
  insertOrUpdateCategoryRanks,
  updateCategoryPoint,
  updateCategoryRank,
  insertOrUpdateCombinationRank,
  listCombinationRankByTournament
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
          console.log(
            `no rawPoints found for performanceId: ${performance.id}, performanceName: ${performance.performanceName}`
          )
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
      await insertOrUpdateCategoryPoint({
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

  async getPoints (performanceId: string): Promise<CategoryPoint | null> {
    return await getCategoryPointByPerformanceId(performanceId)
  }

  async calculateAllCategoryRanks (tournamentId: string): Promise<boolean | null> {
    const categories = await this.getApplicationContext().judging.listCategories()
    try {
      for (const category of categories || []) {
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
      for (const combination of weightedCombinations || []) {
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

  async getAllCategoryRanksDetailed (tournamentId: string): Promise<CategoryRanksDetailsAllResult | null> {
    const categoryIds = await this.getApplicationContext().tournament.listTournamentCategories(tournamentId)
    const ranksDetails: CategoryRanksDetailsAllResult = {}
    for (const categoryId of categoryIds) {
      const categoryRanks = await this.getCategoryRanksDetailed(tournamentId, categoryId)
      if (categoryRanks && categoryRanks.summary.length) {
        const categoryName = categoryRanks.summary[0].categoryName
        ranksDetails[categoryName] = categoryRanks.summary
      }
    }
    return ranksDetails
  }

  async getCategoryRanksDetailed (
    tournamentId: string,
    categoryId: string
  ): Promise<CategoryRanksDetailsResult | null> {
    const category = await this.getApplicationContext().judging.getCategory(categoryId)
    if (!category) {
      console.error(`can't getCategory: ${categoryId}`)
      return null
    }

    const sortedCategoryRanks = await findCategoryRankByCategoryId(tournamentId, categoryId)

    const detailLookup: { [key: string]: CategoryRankDetails } = {}
    const summaryLookup: { [key: string]: CategoryRanksSummary } = {}
    for (const rank of sortedCategoryRanks) {
      const points = await getCategoryPointById(rank.categoryPointId)
      if (!points) {
        console.error(`can't getCategoryPointById: ${rank.categoryPointId}`)
        continue
      }
      const performance = await this.getApplicationContext().tournament.getPerformance(points.performanceId)
      if (!performance) {
        console.error(`can't getPerformance: ${points.performanceId}`)
        continue
      }
      const club = await this.getApplicationContext().people.getClubById(performance.clubId)
      const clubName = club?.clubName || ''

      const performer = await this.getApplicationContext().tournament.getPerformer(points.performerId)
      if (!performer) {
        console.error(`can't getPerformer: ${points.performerId}`)
        continue
      }
      const criteriaPoints: CalculationJudgeCriteriaGroup = points.criteriaPoints
      const criteriaPointsSummary = Object.values(criteriaPoints).reduce((memo, p) => {
        memo[p.criteriaName] = p.calculatedAggregatedCriteriaPoints
        return memo
      }, {} as { [key: string]: number | undefined })
      detailLookup[rank.categoryPointId] = { ...points, categoryRank: rank.categoryRank }
      summaryLookup[rank.categoryPointId] = {
        categoryName: category.categoryName,
        performerNumber: performer.performerNumber,
        performerName: performer.performerName,
        clubName,
        ...criteriaPointsSummary,
        categoryPoint: points.categoryPoint,
        categoryRank: rank.categoryRank
      }
    }

    return {
      summary: Object.values(summaryLookup),
      details: Object.values(detailLookup)
    }
  }

  async generateCategoryRanksReport (tournamentId: string): Promise<any> {
    const categoryRanks = await this.getAllCategoryRanksDetailed(tournamentId)
    return await generateCategoryReport(categoryRanks as any)
  }

  async calculateCombinationRanks (input: CalculationCombinationRanksInput): Promise<CalculationCombinationRanksOutput> {
    const combination = await this.getApplicationContext().judging.listWeightedCombination(input.combinationId)
    const combinationByCategory: { [key: string]: CombinationRank[] } = {} // key: categoryId

    // 0. prepare lookups for performance reasons
    const performanceLookup = keyBy(await this.getApplicationContext().tournament.listPerformances(input.tournamentId), 'id')
    const performerLookup = keyBy(await this.getApplicationContext().tournament.listPerformer(input.tournamentId), 'id')
    const clubsLookup = keyBy(await this.getApplicationContext().people.listClubs(), 'id')

    // 1. prepare and calculate the combination rank
    // only consider performers that competed in all categories for the combination
    const combinationPerformer: { [key: string]: number } = {} // key: performerId
    const performerWeightedRank: { [key: string]: any } = {} // key: performerId
    const numberOfCategoriesInCombination = combination.categories.length
    for (const category of combination.categories) {
      // retrieve meta data from database
      const sortedCategoryRanks = await findCategoryRankByCategoryId(input.tournamentId, category.categoryId)
      const sortedCategoryPoints = keyBy(
        await findCategoryPointByCategoryId(input.tournamentId, category.categoryId),
        'id'
      )
      const combinedRanks: CombinationRank[] = sortedCategoryRanks.map((rank) => {
        // get attributes used for output
        const performerId = sortedCategoryPoints[rank.categoryPointId].performerId
        const performanceId = sortedCategoryPoints[rank.categoryPointId].performanceId
        const performance = performanceLookup[performanceId]
        const clubName = clubsLookup[performance.clubId].clubName
        const performerName = performerLookup[performerId].performerName
        const performerNumber = performerLookup[performerId].performerNumber
        return {
          ...rank,
          ...sortedCategoryPoints[rank.categoryPointId],
          combinationRank: -1,
          categoryWeight: category.categoryWeight,
          categoryName: category.categoryName,
          combinationName: combination.combinationName,
          clubName: clubName || '',
          performerName,
          performerNumber: performerNumber || -1
        }
      })
      combinationByCategory[category.categoryId] = combinedRanks

      for (const rank of combinedRanks) {
        combinationPerformer[rank.performerId] = combinationPerformer[rank.performerId] || 0
        combinationPerformer[rank.performerId] = combinationPerformer[rank.performerId] + 1
      }
    }

    // recalculate combination rank rank
    for (const ranks of Object.values(combinationByCategory)) {
      // only keep the performances of performers that competed in all categieries in the combination
      const filteredRanks = ranks.filter((it) => {
        if (
          it.performerId &&
          combinationPerformer[it.performerId] &&
          combinationPerformer[it.performerId] === numberOfCategoriesInCombination
        ) {
          return true
        }
        return false
      })

      let i = 1
      for (const it of filteredRanks) {
        it.combinationRank = i++
        performerWeightedRank[it.performerId] = performerWeightedRank[it.performerId] || { ...ranks, combinationRank: 0 }
        performerWeightedRank[it.performerId].combinationRank = performerWeightedRank[it.performerId].combinationRank + it.combinationRank * it.categoryWeight
        // add attributes used for output
        performerWeightedRank[it.performerId].categories = performerWeightedRank[it.performerId].categories || {}
        performerWeightedRank[it.performerId].categories[it.categoryName] = it.categoryRank
        performerWeightedRank[it.performerId].combinationName = it.combinationName
        performerWeightedRank[it.performerId].clubName = it.clubName
        performerWeightedRank[it.performerId].performerName = it.performerName
        performerWeightedRank[it.performerId].performerNumber = it.performerNumber
      }
    }

    // sort calculated combination ranks
    const calculatedCombinationRanks = sortBy(Object.entries(performerWeightedRank), (it) => it[1].combinationRank).map(
      ([, it], i) => {
        return {
          combinationName: it.combinationName,
          clubName: it.clubName,
          performerName: it.performerName,
          performerNumber: it.performerNumber,
          ...it.categories,
          combinationRankPoints: it.combinationRank,
          combinationRank: i + 1
        }
      }
    )

    // 2. store the combination rank
    await insertOrUpdateCombinationRank({
      tournamentId: input.tournamentId,
      combinationId: input.combinationId,
      combinationRanks: {
        summary: calculatedCombinationRanks,
        details: combinationByCategory
      }
    })

    return input
  }

  async getAllCombinationRanks (tournamentId: string): Promise<any | null> {
    const combinationRanks = await listCombinationRankByTournament(tournamentId)
    return combinationRanks
      .filter(it => it.combinationRanks?.summary?.length)
      .map(it => it.combinationRanks.summary)
      .reduce((memo, it) => {
        memo[it[0].combinationName] = it
        return memo
      }, {})
  }

  async generateCombinationRanksReport (tournamentId: string): Promise<any> {
    const combinationRanks = await this.getAllCombinationRanks(tournamentId)
    return await generateCombinationReport(combinationRanks)
  }

  async getCombinationRanks (tournamentId: string, combinationId: string): Promise<any | null> {
    const sortedCategoryRanks = await getCombinationRankByCombinationId(tournamentId, combinationId)
    return sortedCategoryRanks?.combinationRanks
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

  async removeCalculation (performanceId: string): Promise<boolean> {
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
