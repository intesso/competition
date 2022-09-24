/* eslint-disable camelcase */
import { Criteria, db, JudgingRule, RawPoint } from '../lib/db/database'
import { Criteria_InsertParameters, JudgingRule_InsertParameters, RawPoint_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes } from '../lib/common'

// JudgingRule
export async function insertJudgingRule (judgingRule: Omit<JudgingRule_InsertParameters, 'id'>) {
  const [insertedJudgingRule] = await JudgingRule(db).insert({ ...judgingRule, ...newRecordAttributes() })
  return insertedJudgingRule
}

export async function findJudgingRuleByName (judgingRuleName: string) {
  return await JudgingRule(db).findOne({ judgingRuleName })
}

// Criteria
export async function insertCriteria (criteria: Omit<Criteria_InsertParameters, 'id'>) {
  const [insertedCriteria] = await Criteria(db).insert({ ...criteria, ...newRecordAttributes() })
  return insertedCriteria
}

export async function findCriteriaByCriteriaJudgingRuleAndCriteriaName (judgingRuleName: string, criteriaName: string) {
  const judgingRule = await JudgingRule(db).findOne({ judgingRuleName })
  if (!judgingRule) return null

  return await Criteria(db).findOne({ criteriaName, judgingRuleId: judgingRule.id })
}

// RawPoint
export async function insertRawPoint (rawPoint: Omit<RawPoint_InsertParameters, 'id'>) {
  const [insertedRawPoint] = await RawPoint(db).insert({ ...rawPoint, ...newRecordAttributes() })
  return insertedRawPoint
}

export async function findRawPoint (performanceId: string, tournamentJudgeId: string, criteriaId: string) {
  return await RawPoint(db).findOne({ performanceId, tournamentJudgeId, criteriaId })
}
