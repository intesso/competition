import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { JudgingRule as JudgingRuleDAO, Criteria as CriteriaDAO, RawPoint as RawPointDAO, Category as CategoryDAO, Combination as CombinationDAO } from '../lib/db/__generated__'

// Domain Types
export type JudgingRuleName = {judgingRuleName: string}
export type CategoryName = {categoryName: string}
export type PerformanceId = {performanceId: string}
export type CriteriaId = {criteriaId: string}
export type TournamentJudgeId = {tournamentJudgeId: string}
export type CategoryWeight = {categoryWeight: number}
export type WeightedCategory = CategoryName & CategoryWeight
export type Category = Omit<CategoryDAO & JudgingRuleName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'judgingRuleId'>
export type Combination = Omit<CombinationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type JudgingRule = Omit<JudgingRuleDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type Criteria = Omit<CriteriaDAO & JudgingRuleName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'judgingRuleId'>
export type RawPoint = Omit<PerformanceId & TournamentJudgeId & CriteriaId & Omit<RawPointDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'performanceId' | 'criteriaId' | 'tournamentJudgeId'>, 'id'>

// Interfaces (Ports)
export interface IJudgingRuleContext extends IGetApplicationContext {
  addCategory: (category: Category) => Promise<Category & Id | null>
  addCombination: (combinationName: string, weightedCategories: WeightedCategory[]) => Promise<Combination & Id | null>
  addJudgingRule: (judgingRule: JudgingRule) => Promise<JudgingRule & Id>
  addCriteria: (criteria: Criteria) => Promise<Criteria & Id | null>
  addRawPoint: (rawPoint: RawPoint) => Promise<RawPoint & Id | null>
}
