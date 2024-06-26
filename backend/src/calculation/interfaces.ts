import { IGetApplicationContext } from '../../applicationContext'

import { CategoryRank as CategoryRankDAO, CategoryPoint as CategoryPointDAO } from '../lib/db/__generated__'
export type CategoryRank = Omit<CategoryRankDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type CategoryPoint = Omit<CategoryPointDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type CombinationRank = CategoryRank & CategoryPoint & { combinationRank?: number, categoryWeight: number, categoryName: string, combinationName: string, clubName: string, performerName: string, performerNumber: number };

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
  judgeCriteria: CalculationJudgeCriteriaGroup
  timestamp?: string
  calculatedTimestamp: string
  complete: boolean
  calculatedCategoryPoints: number
  calculatedCategoryStats: {
    [key: string]: number
  }
}

export interface CategoryPointDetails {
  [key: string]: CategoryPointDetail[]
}

export type CategoryPointDetail = CategoryPoint & {
  criteriaPoints: CriteriaPoints
  clubName: string | undefined
  performerName: string | undefined
  performanceName: string | undefined
  performerNumber: number | null | undefined
  slotNumber: number | string | null | undefined
  locationName: string | null | undefined
}

export interface SubCriteriaProps {
  rangeEnd: number
  rangeStart: number
  subCriteriaName: string
  subCriteriaDescription: string
  subCriteriaWeight: number
  valueType: 'integer' | 'number' | 'float' | 'boolean'
  step: number
  uiPosition: string
}

export type SubCriteriaValueProps = SubCriteriaProps & { value: number}

export type SubCriteriaPoints = SubCriteriaValueProps & { calculatedPoints: number }

export interface CriteriaPoints {
  [key: string]: {
    judges: JudgeCriteria[]
    criteriaId: string
    criteriaName: string
    criteriaWeight: number
    calculatedAggregationMethod: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculatedAggregatedCriteriaStats: any
    calculatedAggregatedCriteriaPoints: number
    calculatedAggregatedCriteriaPointsRaw: number
  }
}

export interface JudgeCriteria {
  judgeId: string
  judgeName: string
  subCriteriaPoints: {
    [key: string]: SubCriteriaPoints
  }
  calculatedCriteriaPoints: number
}

export interface CategoryRankDetails {
  id: string
  tournamentId: string
  performanceId: string
  performerId: string
  categoryId: string
  criteriaPoints: CalculationJudgeCriteriaGroup
  disqualified: boolean | null
  categoryPoint: number | null
  categoryRank: number | null
}

export interface CategoryRanksSummary {
  categoryName: string
  performerName: string
  performerNumber: number | null
  categoryPoint: number | null
  categoryRank: number | null
  [key: string]: number | string | null
}

export interface CategoryRanksDetailsResult {
  summary: CategoryRanksSummary[]
  details: CategoryRankDetails[]
}

export interface CategoryRanksDetailsAllResult {
  [key: string] : CategoryRanksSummary[]
}

export interface CalculationCategoryRanksInput {
  tournamentId: string
  categoryId: string
}

export interface CalculationCombinationRanksInput {
  tournamentId: string
  combinationId: string
}

export interface CombinationRankByCategory {
  combinationName: string
  clubName: string
  performerName: string
  performerNumber: number
  categories: CategoryRankLookup
  combinationRankPoints: number
}

export interface CategoryRankLookup {
  [key: string]: number
}

export interface CombinationRankAttributes extends Omit<CombinationRankByCategory, 'categories'> {
  preliminaryCombinationRank: number
  combinationRank: number
}

export type CombinationRankSummary = CombinationRankAttributes & CategoryRankLookup

export interface CombinationRankLookup {
  [key: string]: CombinationRankByCategory[]
}

export interface CombinationRankDetails {
  [key: string]: CombinationRank[]
}

export interface StoredCombinationRanks {
  summary: CombinationRankSummary[]
  details: CombinationRankDetails
}

export type CalculationCategoryRanksOutput = CategoryRank[];
export type CalculationCombinationRanksOutput = StoredCombinationRanks;

export interface ICalculationContext extends IGetApplicationContext {
  getPoints: (performanceId: string) => Promise<CategoryPoint | null>
  calculatePoints: (input: CalculationPointsInput) => Promise<CalculationPointsOutput | null>
  calculateAllPoints: (tournamentId: string) => Promise<boolean | null>
  getAllCategoryPointsDetailed: (tournamentId: string) => Promise<CategoryPointDetails | null>
  getCategoryRanks: (tournamentId: string, categoryId: string) => Promise<CalculationCategoryRanksOutput | null>
  getCategoryRanksDetailed: (tournamentId: string, categoryId: string) => Promise<CategoryRanksDetailsResult | null>
  getAllCategoryRanksDetailed: (tournamentId: string) => Promise<CategoryRanksDetailsAllResult | null>
  generateCategoryRanksReport: (tournamentId: string) => Promise<boolean | null>
  calculateCategoryRanks: (input: CalculationCategoryRanksInput) => Promise<CalculationCategoryRanksOutput | null>
  calculateAllCategoryRanks: (tournamentId: string) => Promise<boolean | null>
  calculateCombinationRanks: (
    input: CalculationCombinationRanksInput
  ) => Promise<CalculationCombinationRanksOutput | null>
  getCombinationRanks: (tournamentId: string, combinationId: string) => Promise<CalculationCombinationRanksOutput | null>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllCombinationRanks :(tournamentId: string) => Promise<any | null>
  calculateAllCombinationRanks: (tournamentId: string) => Promise<boolean | null>
  generateCombinationRanksReport: (tournamentId: string) => Promise<boolean | null>
  setDisqualified: (performanceId: string, disqualified: boolean) => Promise<boolean>
  removeCalculation: (performanceId: string) => Promise<boolean>
  removeAllCalculations :(tournamentId: string) => Promise<void>
  removeCombinationRanks :(tournamentId: string) => Promise<void>
}
