import { IGetApplicationContext } from '../../applicationContext'
import { CalculationPointsInput } from '../calculation/interfaces'
import { Id } from '../lib/common'
import {
  JudgingRule as JudgingRuleDAO,
  Criteria as CriteriaDAO,
  RawPoint as RawPointDAO,
  Category as CategoryDAO,
  Combination as CombinationDAO
} from '../lib/db/__generated__'

// Domain Types
export type JudgingRuleId = { judgingRuleId: string };
export type CategoryName = { categoryName: string };
export type PerformanceId = { performanceId: string };
export type CriteriaId = { criteriaId: string };
export type TournamentJudgeId = { tournamentJudgeId?: string | null };
export type CategoryWeight = { categoryWeight: number };
export type WeightedCategory = CategoryName & CategoryWeight;
export type Category = CategoryDAO;
export type Combination = Omit<CombinationDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type JudgingRule = Omit<JudgingRuleDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type Criteria = Omit<
  JudgingRuleId & Omit<CriteriaDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy' | 'judgingRuleId'>,
  'id'
>;
export type RawPoint = Omit<
  PerformanceId &
    TournamentJudgeId &
    CriteriaId &
    Omit<
      RawPointDAO,
      | 'id'
      | 'updatedAt'
      | 'updatedBy'
      | 'createdAt'
      | 'createdBy'
      | 'performanceId'
      | 'criteriaId'
      | 'tournamentJudgeId'
    >,
  'id'
>;

export type WeightedCombination = {
  combinationId: string
  combinationName: string
  categories: {
    categoryId: string
    categoryName: string
    categoryWeight: number
  }[]
};

// Interfaces (Ports)
export interface IJudgingRuleContext extends IGetApplicationContext {
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>
  listCategories: () => Promise<(Category & Id)[] | null>
  listWeightedCombination: (combinationId: string) => Promise<WeightedCombination>
  listWeightedCombinations: () => Promise<WeightedCombination[]>
  getCategory: (id: string) => Promise<(Category & Id) | null>
  getCategoryByName: (categoryName: string) => Promise<(Category & Id) | null>
  addCombination: (
    combinationName: string,
    weightedCategories: WeightedCategory[]
  ) => Promise<(Combination & Id) | null>
  addJudgingRule: (judgingRule: JudgingRule) => Promise<JudgingRule & Id>
  getJudgingRuleByCategoryId: (categoryId: string) => Promise<(JudgingRule & Id) | null>
  getJudgingRule: (id: string) => Promise<(JudgingRule & Id) | null>
  addCriteria: (criteria: Criteria) => Promise<(Criteria & Id) | null>
  listCriteriaByCategoryId: (categoryId: string) => Promise<(Criteria & Id)[] | null>
  getCriteriaByCategoryIdAndName: (categoryId: string, criteriaName: string) => Promise<(Criteria & Id) | null>
  getCriteria: (id: string) => Promise<(Criteria & Id) | null>
  listCriteria: () => Promise<(Criteria & Id)[] | null>
  addRawPoint: (rawPoint: RawPoint) => Promise<(RawPoint & Id) | null>
  removeRawPoint: (id: string) => Promise<boolean>
  removeRawPoints: (performanceId: string) => Promise<boolean>
  getRawPoint: (id: string) => Promise<(RawPoint & Id) | null>
  listRawPoints: (performanceId: string) => Promise<(RawPoint & Id)[]>
  prepareCalculationMessage: (
    performanceId: string,
    rawPoints: RawPoint[],
    inputTimestamp: Date | null
  ) => Promise<CalculationPointsInput | null>
}
