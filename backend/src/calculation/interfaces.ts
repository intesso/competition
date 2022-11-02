import { IGetApplicationContext } from '../../applicationContext'

export interface CalculationPointsInput {
  tournamentId: string
  performanceId: string
  categoryId: string
  categoryName: string
  judgingRulId: string
  judgingRuleName: string
  athletes: string[]
  judgeCriteria: CalculationJudgeCriteriaGroup
  timestamp?: string
  calculatedTimestamp?: string
  complete?: boolean
  calculatedCategoryPoints?: number
}

export interface CalculationJudgeCriteriaGroup {
  [key: string] : CalculationJudgesCriteria
}

export interface CalculationJudgesCriteria {
  criteriaId: string
  criteriaName: string
  criteriaWeight: number
  judges: CalculationJudgeCriteria[]
  calculatedAggregatedCriteriaPoints?: number
}

export interface CalculationJudgeCriteria {
  judgeId: string
  subCriteriaPoints: CalculationSubCriteriaPoints
}

export interface CalculationSubCriteriaPoints {
  [key: string] : CalculationSubCriteriaPoint
}

export interface CalculationSubCriteriaPoint {
  value: number
  rangeEnd: number
  rangeStart: number
  subCriteriaName: string
  subCriteriaDescription: string
  subCriteriaWeight: number
  valueType: 'integer' | 'number' | 'float' | 'boolean'
  step: number
  uiPosition: string
  calculatedPoints?: number
}

export interface CalculationPointsOutput {
  performanceId: string
  categoryId: string
  categoryName: string
  judgingRulId: string
  judgingRuleName: string
  athletes: string[]
  judgeCriteria: CalculationJudgeCriteriaGroup
  timestamp?: string
  calculatedTimestamp: string
  complete: boolean
  calculatedCategoryPoints: number
  calculatedCategoryStats: {
    [key: string] : number
  }
}

export interface CalculationCategoryRanksInput {
  categoryId: string
  categoryName: string
  judgingRulId: string
  competition: string
  group: string
  level: string
  type: string
  discipline: string
  timestamp?: string
}

// TODO create real interfaces
export interface CalculationCategoryRanksOutput extends CalculationCategoryRanksInput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}
export type CalculationCombinationRanksInput = CalculationCategoryRanksInput
export type CalculationCombinationRanksOutput = CalculationCategoryRanksInput

export interface ICalculationContext extends IGetApplicationContext {
  calculatePoints: (input: CalculationPointsInput) => Promise<CalculationPointsOutput | null>
  calculateCategoryRanks: (input: CalculationCategoryRanksInput) => Promise<CalculationCategoryRanksOutput | null>
  calculateCombinationRanks: (input: CalculationCombinationRanksInput) => Promise<CalculationCombinationRanksOutput | null>
}
