import { IGetApplicationContext } from '../../applicationContext'

import { CategoryRank as CategoryRankDAO, CategoryPoint as CategoryPointDAO } from '../lib/db/__generated__'
export type CategoryRank = Omit<CategoryRankDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type CategoryPoint = Omit<CategoryPointDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type CombinationRank = CategoryRank & CategoryPoint & { combinationRank?: number, categoryWeight: number };

export type CombinedRankPoint = CategoryPoint & CategoryRank;

export interface CalculationPointsInput {
  tournamentId: string
  performanceId: string
  performerId: string
  disqualified: boolean
  categoryId: string
  categoryName: string
  judgingRulId: string
  judgingRuleName: string
  judgeCriteria: CalculationJudgeCriteriaGroup
  timestamp?: string
  calculatedTimestamp?: string
  complete?: boolean
  calculatedCategoryPoints?: number
}

export interface CalculationJudgeCriteriaGroup {
  [key: string]: CalculationJudgesCriteria
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
  [key: string]: CalculationSubCriteriaPoint
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
    [key: string]: number
  }
}

export interface CalculationCategoryRanksInput {
  tournamentId: string
  categoryId: string
}

export interface CalculationCombinationRanksInput {
  tournamentId: string
  combinationId: string
}

// TODO create real interfaces
export type CalculationCategoryRanksOutput = CategoryRank[];
export type CalculationCombinationRanksOutput = CalculationCombinationRanksInput;

export interface ICalculationContext extends IGetApplicationContext {
  calculatePoints: (input: CalculationPointsInput) => Promise<CalculationPointsOutput | null>
  getPoints: (performanceId: string) => Promise<CategoryPoint | null>
  calculateAllPoints: (tournamentId: string) => Promise<boolean | null>
  calculateCategoryRanks: (input: CalculationCategoryRanksInput) => Promise<CalculationCategoryRanksOutput | null>
  calculateAllCategoryRanks: (tournamentId: string) => Promise<boolean | null>
  calculateCombinationRanks: (
    input: CalculationCombinationRanksInput
  ) => Promise<CalculationCombinationRanksOutput | null>
  calculateAllCombinationRanks: (tournamentId: string) => Promise<boolean | null>
  setDisqualified: (performanceId: string, disqualified: boolean) => Promise<boolean>
  removeCalculation: (performanceId: string) => Promise<boolean>
}
