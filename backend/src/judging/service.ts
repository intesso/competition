import { IGetApplicationContext } from '../../applicationContext'
import { Id, isNotNull, newRecordAttributes } from '../lib/common'
import { Category as CategoryDAO } from '../lib/db/__generated__'
import { IJudgingRuleContext, Criteria, RawPoint, JudgingRule, Category, Combination, WeightedCategory } from './interfaces'
import { findCategoryByCategoryName, findJudgingRuleByName, insertCategory, insertCategoryCombination, insertCombination, insertCriteria, insertJudgingRule, insertRawPoint } from './repository'

export class JudgingRuleService implements IJudgingRuleContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async addCategory (c: Category) : Promise<Category & Id | null> {
    const judgingRule = await findJudgingRuleByName(c.judgingRuleName)
    if (!judgingRule) return null
    const category = await insertCategory({ ...c, judgingRuleId: judgingRule.id })
    return { ...c, id: category.id }
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

  async addCriteria (c: Criteria) : Promise<Criteria & Id | null> {
    const judgingRule = await findJudgingRuleByName(c.judgingRuleName)
    if (!judgingRule) return null
    const criteria = await insertCriteria({ ...c, judgingRuleId: judgingRule.id })
    return { ...c, id: criteria.id }
  }

  async addRawPoint (rp: RawPoint) : Promise<RawPoint & Id> {
    const rawPoint = await insertRawPoint(rp)
    return { ...rp, id: rawPoint.id }
  }
}
