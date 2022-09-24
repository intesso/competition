import { Id } from '../lib/common'
import { JudgingRule as JudgingRuleDAO, Criteria as CriteriaDAO, RawPoint as RawPointDAO } from '../lib/db/__generated__'

// Domain Types
export type JudgingRuleName = {judgingRuleName: string}
export type CategoryName = {categoryName: string}
export type PerformanceId = {performanceId: string}
export type CriteriaId = {criteriaId: string}
export type TournamentJudgeId = {tournamentJudgeId: string}
export type JudgingRule = Omit<JudgingRuleDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type Criteria = Omit<CriteriaDAO & JudgingRuleName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'judgingRuleId'>
export type RawPoint = Omit<PerformanceId & TournamentJudgeId & CriteriaId & Omit<RawPointDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'performanceId' | 'criteriaId' | 'tournamentJudgeId'>, 'id'>

// Interfaces (Ports)
export interface IJudgingRuleContext {
  addJudgingRule: (judgingRule: JudgingRule) => Promise<JudgingRule & Id>
  addCriteria: (criteria: Criteria) => Promise<Criteria & Id | null>
  addRawPoint: (rawPoint: RawPoint) => Promise<RawPoint & Id | null>
}
