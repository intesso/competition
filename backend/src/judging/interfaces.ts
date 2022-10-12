import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { JudgingRule as JudgingRuleDAO, Criteria as CriteriaDAO, RawPoint as RawPointDAO, Category as CategoryDAO, Combination as CombinationDAO } from '../lib/db/__generated__'

// Domain Types
export type JudgingRuleId = {judgingRuleId: string}
export type CategoryName = {categoryName: string}
export type PerformanceId = {performanceId: string}
export type CriteriaId = {criteriaId: string}
export type TournamentJudgeId = {tournamentJudgeId: string}
export type CategoryWeight = {categoryWeight: number}
export type WeightedCategory = CategoryName & CategoryWeight
export type Category = CategoryDAO
export type Combination = Omit<CombinationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type JudgingRule = Omit<JudgingRuleDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type Criteria = Omit<JudgingRuleId & Omit<CriteriaDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'judgingRuleId'>, 'id'>
export type RawPoint = Omit<PerformanceId & TournamentJudgeId & CriteriaId & Omit<RawPointDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'performanceId' | 'criteriaId' | 'tournamentJudgeId'>, 'id'>

// Interfaces (Ports)
export interface IJudgingRuleContext extends IGetApplicationContext {
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>
  listCategories: () => Promise<(Category & Id)[] | null>
  getCategory: (id: string) => Promise<(Category & Id) | null>
  addCombination: (combinationName: string, weightedCategories: WeightedCategory[]) => Promise<Combination & Id | null>
  addJudgingRule: (judgingRule: JudgingRule) => Promise<JudgingRule & Id>
  getJudgingRuleByCategoryId: (categoryId: string) => Promise<(JudgingRule & Id) | null>
  getJudgingRule: (id: string) => Promise<(JudgingRule & Id) | null>
  addCriteria: (criteria: Criteria) => Promise<Criteria & Id | null>
  listCriteria: (categoryId: string) => Promise<(Criteria & Id)[] | null>
  getCriteria: (id: string) => Promise<(Criteria & Id) | null>
  addRawPoint: (rawPoint: RawPoint) => Promise<RawPoint & Id | null>
}
