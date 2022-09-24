import { Id } from '../lib/common'
import { IJudgingRuleContext, Criteria, RawPoint, JudgingRule } from './interfaces'
import { findJudgingRuleByName, insertCriteria, insertJudgingRule, insertRawPoint } from './repository'

export class JudgingRuleContext implements IJudgingRuleContext {
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
