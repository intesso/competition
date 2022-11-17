import { groupBy, keyBy } from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import { CalculationPointsInput, CalculationJudgeCriteriaGroup } from '../calculation/interfaces'
import { Id, isNotNull, newRecordAttributes } from '../lib/common'
import { Category as CategoryDAO } from '../lib/db/__generated__'
import { IJudgingRuleContext, Criteria, RawPoint, JudgingRule, Category, Combination, WeightedCategory } from './interfaces'
import { listCategories, getCategoryByCategoryName, getCategoryById, findCriteriaByCategoryId, findJudgingRuleByCategoryId, findJudgingRuleById, findRawPoints, getCriteriaById, insertCategory, insertCategoryCombination, insertCombination, insertCriteria, insertJudgingRule, insertOrUpdateRawPoint, listCriteria, listCombinations, listCategoryCombinations, getCriteriaByCategoryIdAndName, deleteRawPointsForPerformance, deleteRawPoint, getRawPointById, getRawPoint } from './repository'

let _categoriesLookup: {[key: string]: (Category & Id)} | null = null
let _criteriaLookup: {[key: string]: (Criteria & Id)} | null = null

export class JudgingRuleService implements IJudgingRuleContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async addCategory (c: Omit<Category, 'id'>): Promise<Category | null> {
    return await insertCategory(c)
  }

  async listCategories (): Promise<(Category & Id)[] | null> {
    if (_categoriesLookup) {
      return Object.values(_categoriesLookup)
    }
    const c = await listCategories()
    if (c) {
      _categoriesLookup = c.reduce((memo, it) => {
        memo[it.id] = it
        return memo
      }, {} as {[key: string]: Category})
    }
    return Object.values(_categoriesLookup || {})
  }

  lookupCategory (id: string): Category & Id | null {
    return (_categoriesLookup || {})[id]
  }

  async getCategory (id: string): Promise<(Category & Id) | null> {
    return await getCategoryById(id)
  }

  async getCategoryByName (categoryName: string): Promise<(Category & Id) | null> {
    return await getCategoryByCategoryName(categoryName)
  }

  async addCombination (combinationName: string, weightedCategories: WeightedCategory[]) : Promise<Combination & Id | null> {
    // first insert the combination
    const combination = await insertCombination({ combinationName, ...newRecordAttributes() })
    interface C {category: CategoryDAO, weight: number}
    // then retrieve the categories with the given categoryNames
    const categories = await Promise.all(weightedCategories.map(weightedCategory => getCategoryByCategoryName(weightedCategory.categoryName)))
    const categoryWeightPairs = categories.map((category, i) => ({ category, weight: weightedCategories[i].categoryWeight }))
    const filteredCategories = categoryWeightPairs.filter((categoryWeightPair): categoryWeightPair is C => isNotNull(categoryWeightPair.category))
    // then insert the CategoryCombination Objects
    await Promise.all(filteredCategories.map(category => insertCategoryCombination(combination.combinationName, category.category?.categoryName, category.weight)))
    return combination
  }

  async listWeightedCombination (combinationId: string) {
    const categories = keyBy(await listCategories(), 'id')
    const combinations = keyBy(await listCombinations(), 'id')
    const combinationGroups = groupBy(await listCategoryCombinations(), 'combinationId')

    const c = combinationGroups[combinationId]
    const groupedCombination = {
      combinationId,
      combinationName: combinations[combinationId].combinationName,
      categories: c.map(category => {
        return {
          categoryId: category.categoryId,
          categoryName: categories[category.categoryId].categoryName,
          categoryWeight: category.categoryWeight
        }
      })
    }
    return groupedCombination
  }

  async listWeightedCombinations () {
    const categories = keyBy(await listCategories(), 'id')
    const combinations = keyBy(await listCombinations(), 'id')
    const combinationGroups = groupBy(await listCategoryCombinations(), 'combinationId')
    const groupedCombinations = Object.entries(combinationGroups).map(([combinationId, c]) => {
      return {
        combinationId,
        combinationName: combinations[combinationId].combinationName,
        categories: c.map(category => {
          return {
            categoryId: category.categoryId,
            categoryName: categories[category.categoryId].categoryName,
            categoryWeight: category.categoryWeight
          }
        })
      }
    })
    return groupedCombinations
  }

  async addJudgingRule (j: JudgingRule) : Promise<JudgingRule & Id> {
    const judgingRule = await insertJudgingRule(j)
    return { ...j, id: judgingRule.id }
  }

  async getJudgingRule (id: string): Promise<(JudgingRule & Id) | null> {
    return await findJudgingRuleById(id)
  }

  async getJudgingRuleByCategoryId (categoryId: string): Promise<(JudgingRule & Id) | null> {
    return await findJudgingRuleByCategoryId(categoryId)
  }

  async addCriteria (c: Criteria) : Promise<Criteria & Id | null> {
    return await insertCriteria(c)
  }

  async listCriteriaByCategoryId (categoryId: string) : Promise<(Criteria & Id)[] | null> {
    return await findCriteriaByCategoryId(categoryId)
  }

  async getCriteria (id: string) : Promise<(Criteria & Id) | null> {
    return await getCriteriaById(id)
  }

  async getCriteriaByCategoryIdAndName (categoryId: string, criteriaName: string) : Promise<(Criteria & Id) | null> {
    return await getCriteriaByCategoryIdAndName(categoryId, criteriaName)
  }

  async listCriteria (): Promise<(Criteria & Id)[] | null> {
    if (_criteriaLookup) {
      return Object.values(_criteriaLookup)
    }
    const c = await listCriteria()
    if (c) {
      _criteriaLookup = c.reduce((memo, it) => {
        memo[it.id] = it
        return memo
      }, {} as {[key: string]: (Criteria & Id)})
    }
    return Object.values((_criteriaLookup || {}))
  }

  lookupCriteria (id: string): Criteria & Id | null {
    return (_criteriaLookup || {})[id]
  }

  async addRawPoint (rp: RawPoint) : Promise<RawPoint & Id> {
    // 1. insert the RawPoint request data
    const rawPoint = await insertOrUpdateRawPoint(rp)
    // 2. get all rawPoints for this performance
    const rawPoints = await this.listRawPoints(rawPoint.performanceId)
    // 3. transform rawPoints for calculation request message
    const calculationMessage = await this.prepareCalculationMessage(rawPoint.performanceId, rawPoints, rawPoint.timestamp)
    // 4. do calculation
    if (calculationMessage) {
      await this.getApplicationContext().calculation.calculatePoints(calculationMessage)
    } else {
      // TODO notify about error
      console.error(`could not prepareCalculationMessage for ${JSON.stringify(rawPoint)}`)
    }
    // 5. return rawPoints with id. Note: the calculation result is stored within the calculate method, but not returned there
    return { ...rp, id: rawPoint.id }
  }

  async getRawPoint (id: string) : Promise<(RawPoint & Id) | null> {
    return await getRawPointById(id)
  }

  async listRawPoints (performanceId: string): Promise<(RawPoint & Id)[]> {
    return await findRawPoints({ performanceId })
  }

  async removeRawPoints (performanceId: string): Promise<boolean> {
    try {
      await deleteRawPointsForPerformance(performanceId)
      return true
    } catch (error) {
      return false
    }
  }

  async removeRawPoint (id: string): Promise<boolean> {
    try {
      await deleteRawPoint(id)
      return true
    } catch (error) {
      return false
    }
  }

  async prepareCalculationMessage (performanceId: string, rawPoints: RawPoint[], inputTimestamp: Date | null) {
    const performance = await this.getApplicationContext().tournament.getPerformance(performanceId)
    if (!performance) return null

    const category = await this.getCategory(performance.categoryId)
    if (!category) return null

    const judgingRule = await this.getJudgingRuleByCategoryId(category.id)
    if (!judgingRule) return null

    await this.listCriteria()

    const groupedCriteria = rawPoints.reduce((memo, rawPoint) => {
      const criteria = this.lookupCriteria(rawPoint.criteriaId)
      if (criteria) {
        memo[criteria.criteriaName] = memo[criteria.criteriaName] ?? {}
        memo[criteria.criteriaName].criteriaId = rawPoint.criteriaId
        memo[criteria.criteriaName].criteriaName = criteria.criteriaName
        memo[criteria.criteriaName].criteriaWeight = criteria.criteriaWeight
        memo[criteria.criteriaName].judges = memo[criteria.criteriaName].judges ?? []
        memo[criteria.criteriaName].judges.push({
          judgeId: rawPoint.judgeId || rawPoint.tournamentJudgeId,
          judgeName: rawPoint.judgeName || rawPoint.judge.judgeName,
          subCriteriaPoints: rawPoint.subCriteriaPoints
        })
        memo[criteria.criteriaName].calculatedAggregatedCriteriaPoints = undefined
      }

      return memo
    }, {} as CalculationJudgeCriteriaGroup)

    const calculationMessage: CalculationPointsInput = {
      tournamentId: performance.tournamentId,
      performanceId,
      disqualified: performance.disqualified === true,
      performerId: performance.performerId,
      categoryId: category.id,
      categoryName: category.categoryName,
      judgingRulId: judgingRule.id,
      judgingRuleName: judgingRule.judgingRuleName,
      timestamp: inputTimestamp ? inputTimestamp.toISOString() : undefined,
      // TODO group raw points by criteria
      judgeCriteria: groupedCriteria,
      complete: undefined,
      calculatedTimestamp: undefined,
      calculatedCategoryPoints: 0
    }
    return calculationMessage
  }
}
