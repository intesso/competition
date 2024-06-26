import axios, { AxiosError } from 'axios'
import { keyBy, orderBy, sortBy } from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import { equalFloat } from '../lib/common'
import { combinationMixed, combinationPriority } from '../../build/reportDefinitions'
import {
  CalculationPointsInput,
  ICalculationContext,
  CalculationPointsOutput,
  CalculationCategoryRanksInput,
  CalculationCategoryRanksOutput,
  CalculationCombinationRanksInput,
  CombinationRank,
  CategoryPoint,
  CalculationJudgeCriteriaGroup,
  CategoryRanksSummary,
  CategoryRankDetails,
  CategoryRanksDetailsResult,
  CategoryRanksDetailsAllResult,
  CombinationRankLookup,
  CombinationRankByCategory,
  CombinationRankSummary,
  StoredCombinationRanks,
  CalculationCombinationRanksOutput,
  CategoryPointDetails,
  CategoryPointDetail
} from './interfaces'
import {
  deleteCategoryPointById,
  deleteCategoryRankById,
  findCategoryPointByCategoryId,
  findCategoryRankByCategoryId,
  getCombinationRankByCombinationId,
  getCategoryPointById,
  getCategoryPointByPerformanceIdAndCategoryId,
  getCategoryRankByCategoryPointId,
  insertOrUpdateCategoryPoint,
  insertOrUpdateCategoryRanks,
  updateCategoryPoint,
  updateCategoryRank,
  insertOrUpdateCombinationRank,
  listCombinationRankByTournament,
  deleteCombinationRankForTournament,
  deleteCategoryPointForTournamentId,
  deleteCategoryRankForTournamentId
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
            await this.calculatePoints(calculationMessage)
          } else {
            console.error(`could not prepareCalculationMessage for ${JSON.stringify(performance)}`)
          }
        } else {
          console.log(
            `no rawPoints found for performanceId: ${performance.id}, performanceName: ${performance.performanceName}`
          )
        }
      }
      // calculate MixedCategoryPoints (Hack: used for the overall winner)
      await this.copyMixedCategoryPoints(tournamentId)
    } catch (error) {
      return false
    }
    return true
  }

  async calculatePoints (input: CalculationPointsInput): Promise<CalculationPointsOutput | null> {
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
    const performance = await this.getApplicationContext().tournament.getPerformance(performanceId)
    if (!performance) {
      return null
    }
    return await getCategoryPointByPerformanceIdAndCategoryId(performanceId, performance.categoryId)
  }

  async getAllCategoryPointsDetailed (tournamentId: string): Promise<CategoryPointDetails | null> {
    const categoryIds = await this.getApplicationContext().tournament.listTournamentCategories(tournamentId)
    const pointsDetails: CategoryPointDetails = {}
    for (const categoryId of categoryIds) {
      const category = await this.getApplicationContext().judging.getCategory(categoryId)
      const categoryPoints = await findCategoryPointByCategoryId(tournamentId, categoryId)
      const enhancedCategoryPoints: CategoryPointDetail[] = []
      for (const categoryPoint of categoryPoints) {
        const performance = await this.getApplicationContext().tournament.getPerformance(categoryPoint.performanceId)
        const location = await this.getApplicationContext().tournament.getLocation(performance?.locationId || '')
        const club = await this.getApplicationContext().people.getClubById(performance?.clubId || '')
        const performer = await this.getApplicationContext().tournament.getPerformer(categoryPoint.performerId)
        enhancedCategoryPoints.push({
          ...categoryPoint,
          clubName: club?.clubName,
          performanceName: performance?.performanceName,
          slotNumber: performance?.slotNumber,
          locationName: location?.locationName,
          performerName: performer?.performerName,
          performerNumber: performer?.performerNumber
        })
      }
      if (category && categoryPoints && categoryPoints.length) {
        pointsDetails[category.categoryName] = enhancedCategoryPoints
      }
    }
    return pointsDetails
  }

  async copyMixedCategoryPoints (tournamentId: string) {
    const mixedCategories = Object.values(combinationMixed)
    for (const mixedCategoryDefinition of mixedCategories) {
      for (const [mixedCategoryName, originalCategories] of Object.entries(mixedCategoryDefinition)) {
        const mixedCategory = await this.getApplicationContext().judging.getCategoryByName(mixedCategoryName)
        if (mixedCategory) {
          for (const categoryName of originalCategories) {
            const category = await this.getApplicationContext().judging.getCategoryByName(categoryName)
            if (category) {
              const sortedCategoryPoints = await findCategoryPointByCategoryId(tournamentId, category.id)
              for (const existingCategoryPoint of sortedCategoryPoints) {
                await insertOrUpdateCategoryPoint({
                  tournamentId: existingCategoryPoint.tournamentId,
                  performerId: existingCategoryPoint.performerId,
                  performanceId: existingCategoryPoint.performanceId,
                  disqualified: existingCategoryPoint.disqualified,
                  categoryId: mixedCategory.id, // store under the mixedCategoryName (copy original categoryPoint)
                  categoryPoint: existingCategoryPoint.categoryPoint,
                  criteriaPoints: existingCategoryPoint.criteriaPoints
                })
              }
            }
          }
        }
      }
    }
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
    // calculate category rank based on category points for the given category and tournament
    const categoryPoints = await findCategoryPointByCategoryId(input.tournamentId, input.categoryId)
    const calculatedRanks = this.calculateCategoryRanksFromCategoryPoints(categoryPoints)
    const categoryRanks = calculatedRanks.map(it => ({
      categoryId: it.categoryId,
      tournamentId: it.tournamentId,
      disqualified: it.disqualified,
      categoryPointId: it.id,
      categoryRank: it.categoryRank
    }))
    // store the calculated categoryRanks
    try {
      await insertOrUpdateCategoryRanks(categoryRanks)
    } catch (error) {
      console.error(error)
    }

    return categoryRanks
  }

  calculateCategoryRanksFromCategoryPoints <T extends CategoryPoint> (categoryPoints: T[]): (T & {categoryRank: number})[] {
    let numberOfEqualPoints = 0
    let currentRank = 0
    // make sure the categoryPoints are sorted
    const sortedCategoryPoints = orderBy(categoryPoints, 'categoryPoint', 'desc')
    // calculate the categoryRanks
    const categoryRanks = sortedCategoryPoints.map((categoryPoint: T, i: number) => {
      // if disqualified do nothing
      if (categoryPoint.disqualified) {
        // handle equal points
      } else if (i > 0 && equalFloat(categoryPoint.categoryPoint, sortedCategoryPoints[i - 1].categoryPoint)) {
        numberOfEqualPoints++
        // normal case: different points
      } else {
        currentRank = numberOfEqualPoints > 0 ? currentRank + numberOfEqualPoints + 1 : currentRank + 1
        numberOfEqualPoints = 0
      }

      const categoryRank = {
        ...categoryPoint,
        categoryRank: categoryPoint.disqualified ? -1 : currentRank
      }
      return categoryRank
    })
    return categoryRanks
  }

  async calculateAllCombinationRanks (tournamentId: string): Promise<boolean | null> {
    const weightedCombinations = await this.getApplicationContext().judging.listWeightedCombinations()
    try {
      for (const combination of weightedCombinations || []) {
        await this.calculateCombinationRanks({ tournamentId, combinationId: combination.combinationId })
      }
    } catch (error) {
      console.error(error)
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

  async getCategoryRanksDetailed (tournamentId: string, categoryId: string): Promise<CategoryRanksDetailsResult | null> {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async generateCategoryRanksReport (_tournamentId: string): Promise<any> {
    throw new Error('not yet implemented')
  }

  async calculateCombinationRanks (input: CalculationCombinationRanksInput): Promise<CalculationCombinationRanksOutput> {
    const combination = await this.getApplicationContext().judging.listWeightedCombination(input.combinationId)
    const combinationByCategory: { [key: string]: CombinationRank[] } = {} // key: categoryId

    // prepare lookups for performance reasons
    const performanceLookup = keyBy(
      await this.getApplicationContext().tournament.listPerformances(input.tournamentId),
      'id'
    )
    const performerLookup = keyBy(
      await this.getApplicationContext().tournament.listPerformer(input.tournamentId),
      'id'
    )
    const clubsLookup = keyBy(await this.getApplicationContext().people.listClubs(), 'id')

    // prepare and calculate the combination rank
    // only consider performers that competed in all categories for the combination
    const combinationPerformer: { [key: string]: number } = {} // key: performerId
    const performerWeightedRank: { [key: string]: CombinationRankByCategory } = {} // key: performerId
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

    // calculate weighted combinationRankPoints for every performer.
    // it is done in a special way: the weight is based on the rank, not the points, in order to be able to compare pears and apples ;-)
    for (const ranks of Object.values(combinationByCategory)) {
      // before calculating the combinationRankPoints, remove the performances of performers that did NOT compete in all categories in the combination
      const filteredRanks = ranks.filter((it) => {
        if (
          !it.disqualified &&
          it.performerId &&
          combinationPerformer[it.performerId] &&
          combinationPerformer[it.performerId] === numberOfCategoriesInCombination
        ) {
          return true
        }
        return false
      })

      // recalculate categoryRank (after filtering out performers that did not compete in all categories)
      const sortedFilteredRanks = this.calculateCategoryRanksFromCategoryPoints(filteredRanks)

      for (const it of sortedFilteredRanks) {
        performerWeightedRank[it.performerId] = performerWeightedRank[it.performerId] || {
          combinationRankPoints: 0
        }

        performerWeightedRank[it.performerId].combinationRankPoints =
          performerWeightedRank[it.performerId].combinationRankPoints + ((it.categoryRank || 0) * it.categoryWeight)
        // add attributes used for output
        performerWeightedRank[it.performerId].categories = performerWeightedRank[it.performerId].categories || {}
        performerWeightedRank[it.performerId].categories[it.categoryName] = it.categoryRank
        performerWeightedRank[it.performerId].combinationName = it.combinationName
        performerWeightedRank[it.performerId].clubName = it.clubName
        performerWeightedRank[it.performerId].performerName = it.performerName
        performerWeightedRank[it.performerId].performerNumber = it.performerNumber
      }
    }

    // calculate the preliminaryCombinationRank after sorting the ranks by the calculated weighted combinationRankPoints (ascending)
    // the preliminaryCombinationRank has the same rank for different performers, if the combinationRankPoints are equal
    // after equal ranks, there is a "gap" that is as high as the number of equal combinationRankPoints
    let i = 0
    let numberOfEqualRanks = 0
    let currentRank = 0
    // sort the ranks by the calculated weighted combinationRankPoints (ascending)
    const performerWeightedRankValues = sortBy(Object.values(performerWeightedRank), 'combinationRankPoints')
      // map attributes
      .map((it, i) => {
        return {
          combinationName: it.combinationName,
          clubName: it.clubName,
          performerName: it.performerName,
          performerNumber: it.performerNumber,
          ...it.categories,
          combinationRankPoints: parseFloat((it.combinationRankPoints / 100).toFixed(2)),
          preliminaryCombinationRank: 0,
          combinationRank: i + 1
        } as CombinationRankSummary
      })

    for (const it of performerWeightedRankValues) {
      // handle equal points
      if (i > 0 && equalFloat(it.combinationRankPoints, performerWeightedRankValues[i - 1].combinationRankPoints)) {
        numberOfEqualRanks++
        // normal case: different points
      } else {
        currentRank = numberOfEqualRanks > 0 ? currentRank + numberOfEqualRanks + 1 : currentRank + 1
        numberOfEqualRanks = 0
      }
      it.preliminaryCombinationRank = currentRank
      i++
    }

    // sort calculated combination ranks (ascending):
    // first by preliminaryCombinationRank, then by the categoryRanks in the order specified for the combination (combinationPriority)

    // prepare the orderBy attributes
    let orderByAttributes: string[] = []
    if (performerWeightedRankValues && performerWeightedRankValues.length > 0) {
      const attrs = performerWeightedRankValues[0]
      // console.log('combinationName', attrs.combinationName)
      const priorityLookup = combinationPriority[attrs.combinationName]
      if (!priorityLookup) {
        console.error(`ERROR: can't find "combinationPriority" in "reportDefinitions.ts" for combinationName ${attrs.combinationName}`)
      } else {
        Object.keys(attrs).forEach((category) => {
          const priority = priorityLookup[category]
          if (priority >= 0) {
            orderByAttributes[priority] = category
          }
        })
      }

      orderByAttributes.unshift('preliminaryCombinationRank')
      orderByAttributes = orderByAttributes.filter((it) => it)
      // console.log('filteredSortAttributes', orderByAttributes)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderByOrder: any[] = orderByAttributes.map(() => 'asc')

    const calculatedCombinationRanks = orderBy(
      performerWeightedRankValues,
      // sort function
      orderByAttributes,
      orderByOrder
      // build the final rank with the index
      // this works because the elements are well sorted
    ).map((it, i) => {
      return {
        ...it,
        combinationRank: i + 1
      } as CombinationRankSummary
    })

    const combinationRanks: StoredCombinationRanks = {
      summary: calculatedCombinationRanks,
      details: combinationByCategory
    }

    // store the combination rank
    await insertOrUpdateCombinationRank({
      tournamentId: input.tournamentId,
      combinationId: input.combinationId,
      combinationRanks
    })

    return combinationRanks
  }

  async getAllCombinationRanks (tournamentId: string): Promise<CombinationRankLookup | null> {
    const combinationRanks = await listCombinationRankByTournament(tournamentId)
    const combinationRankLookup = combinationRanks
      .filter((it) => it.combinationRanks?.summary?.length)
      .map((it) => it.combinationRanks.summary)
      .reduce((memo: CombinationRankLookup, it: CombinationRankByCategory[]) => {
        memo[it[0].combinationName] = it
        return memo
      }, {})
    return combinationRankLookup
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async generateCombinationRanksReport (_tournamentId: string): Promise<any> {
    throw new Error('not yet implemented')
  }

  async getCombinationRanks (tournamentId: string, combinationId: string): Promise<StoredCombinationRanks | null> {
    const sortedCategoryRanks = await getCombinationRankByCombinationId(tournamentId, combinationId)
    return sortedCategoryRanks?.combinationRanks
  }

  async setDisqualified (performanceId: string, disqualified: boolean): Promise<boolean> {
    try {
      const performance = await this.getApplicationContext().tournament.getPerformance(performanceId)
      if (!performance) {
        return false
      }
      const categoryPoint = await getCategoryPointByPerformanceIdAndCategoryId(performanceId, performance.categoryId)
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
      const performance = await this.getApplicationContext().tournament.getPerformance(performanceId)
      if (!performance) {
        return false
      }
      const categoryPoint = await getCategoryPointByPerformanceIdAndCategoryId(performanceId, performance.categoryId)
      if (!categoryPoint) {
        return true
      }
      const categoryRank = await getCategoryRankByCategoryPointId(categoryPoint.id)
      if (categoryRank) {
        await deleteCategoryRankById(categoryRank.id)
      }
      await deleteCategoryPointById(categoryPoint.id)

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async removeCombinationRanks (tournamentId: string): Promise<void> {
    return await deleteCombinationRankForTournament(tournamentId)
  }

  async removeAllCalculations (tournamentId: string): Promise<void> {
    await deleteCategoryRankForTournamentId(tournamentId)
    await deleteCategoryPointForTournamentId(tournamentId)
    await deleteCombinationRankForTournament(tournamentId)
  }
}
