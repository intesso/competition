import { IGetApplicationContext } from '../../applicationContext'

import { CategoryRank as CategoryRankDAO } from '../lib/db/__generated__'
export type CategoryRank = Omit<CategoryRankDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>

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
  judgeId?: string | null
  judgeName?: string | null
  judgeDevice?: string | null
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
  tournamentId: string
  categoryId: string
}

// TODO create real interfaces
export type CalculationCategoryRanksOutput = CategoryRank[]
export type CalculationCombinationRanksInput = CalculationCategoryRanksInput
export type CalculationCombinationRanksOutput = CalculationCategoryRanksInput

export interface ICalculationContext extends IGetApplicationContext {
  calculatePoints: (input: CalculationPointsInput) => Promise<CalculationPointsOutput | null>
  calculateCategoryRanks: (input: CalculationCategoryRanksInput) => Promise<CalculationCategoryRanksOutput | null>
  calculateCombinationRanks: (input: CalculationCombinationRanksInput) => Promise<CalculationCombinationRanksOutput | null>
}
