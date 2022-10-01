export interface RawPoints {
  performanceId: string
  tournamentJudgeId: string
  criteriaId: string
  subCriteriaPoints: SubCriteria
  timestamp: number
}

export interface SubCriteria {
  [key: string]: boolean | number | string
}
