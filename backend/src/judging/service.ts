import { IGetApplicationContext } from '../../applicationContext'
import { Id, isNotNull, newRecordAttributes } from '../lib/common'
import { Category as CategoryDAO } from '../lib/db/__generated__'
import { IJudgingRuleContext, Criteria, RawPoint, JudgingRule, Category, Combination, WeightedCategory } from './interfaces'
import { findCategories, findCategoryByCategoryName, findCategoryById, findCriteriaByCategoryId, findJudgingRuleByCategoryId, findJudgingRuleById, getCriteriaById, insertCategory, insertCategoryCombination, insertCombination, insertCriteria, insertJudgingRule, insertOrUpdateRawPoint } from './repository'

export class JudgingRuleService implements IJudgingRuleContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async addCategory (c: Omit<Category, 'id'>) : Promise<Category | null> {
    return await insertCategory(c)
  }

  async listCategories () : Promise<(Category & Id)[] | null> {
    return await findCategories()
  }

  async getCategory (id: string): Promise<(Category & Id) | null> {
    return await findCategoryById(id)
  }

  async addCombination (combinationName: string, weightedCategories: WeightedCategory[]) : Promise<Combination & Id | null> {
    // first insert the combination
    const combination = await insertCombination({ combinationName, ...newRecordAttributes() })
    interface C {category: CategoryDAO, weight: number}
    // then retrieve the categories with the given categoryNames
    const categories = await Promise.all(weightedCategories.map(weightedCategory => findCategoryByCategoryName(weightedCategory.categoryName)))
    const categoryWeightPairs = categories.map((category, i) => ({ category, weight: weightedCategories[i].categoryWeight }))
    const filteredCategories = categoryWeightPairs.filter((categoryWeightPair): categoryWeightPair is C => isNotNull(categoryWeightPair.category))
    // then insert the CategoryCombination Objects
    await Promise.all(filteredCategories.map(category => insertCategoryCombination(combination.combinationName, category.category?.categoryName, category.weight)))
    return combination
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

  async listCriteria (categoryId: string) : Promise<(Criteria & Id)[] | null> {
    return await findCriteriaByCategoryId(categoryId)
  }

  async getCriteria (id: string) : Promise<(Criteria & Id) | null> {
    return await getCriteriaById(id)
  }

  async addRawPoint (rp: RawPoint) : Promise<RawPoint & Id> {
    const rawPoint = await insertOrUpdateRawPoint(rp)
    return { ...rp, id: rawPoint.id }
  }
}
