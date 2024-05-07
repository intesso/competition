export interface Person {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'diverse' | 'unknown' | null
  birthDate: string
}

export type TournamentPerson = Person & { id?: string, tournamentId: string };
export type TorunamentAthlete = TournamentPerson;
export type TorunamentJudge = TournamentPerson;

export interface Address {
  street: string
  houseNumber?: string
  zipCode: string
  city: string
  country: string
}

export interface Club extends Address {
  id?: string
  clubName: string
  associationId?: string
}

export interface Tournament extends Address {
  id?: string
  tournamentName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tournamentCoordinates?: any
  competition?: string
  tournamentStartTime: string
  tournamentEndTime: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo?: any
}

export interface Location {
  id?: string
  tournamentId: string
  locationName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locationCoordinates?: any
}

export interface Category {
  id?: string
  judgingRuleId: string
  categoryName: string
  competition: string
  discipline: string
  group: string
  level: string
  type: string
}

export interface Criteria {
  id?: string
  judgingRuleId: string
  criteriaName: string
  criteriaDescription: string
  criteriaWeight: number
  criteriaUiLayout: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subCriteriaDefinition: SubCriteriaDefinition
}

export interface RawPoint {
  performanceId: string
  tournamentJudgeId?: string
  judgeId: string
  judgeName: string
  criteriaId: string
  subCriteriaPoints: SubCriteriaValue
  timestamp: string
}

export interface SubCriteriaDefinition {
  [subCriteriaName: string]: SubCriteriaProps
}

export interface SubCriteriaValue {
  [subCriteriaName: string]: SubCriteriaValueProps
}

export interface UiPositionSubCriteriaValue {
  [uiPosition: string]: SubCriteriaValueProps
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

interface CategoryPoint {
  id: string
  categoryId: Category['id']
  categoryPoint: (number) | null
  createdAt: (Date) | null
  createdBy: (string) | null
  criteriaPoints: CriteriaPoints | null
  disqualified: (boolean) | null
  performanceId: Performance['id']
  performerId: Performer['id']
  tournamentId: Tournament['id']
  updatedAt: (Date) | null
  updatedBy: (string) | null
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

export interface JudgingRule {
  id?: string
  judgingRuleDescription: string | null
  judgingRuleName: string
}

export interface Performance {
  id?: string
  tournamentId: string
  locationId: string
  categoryId: string
  clubId: string
  performerId: string
  slotNumber: number | null
  judges: PerformanceJudge[]
  performanceName: string
  performanceNumber: number | null
  performanceStartTime: string | null
  disqualified: boolean | null
}

export interface Performer {
  id?: string
  tournamentId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tournamentAthletes: any
  performerName: string
  performerNumber?: string
}

export interface TournamentPlanDetails {
  tournamentId: string
  tournamentName: string
  slotNumber: number | string
  locationId: string
  locationName: string
  categoryId: string
  categoryName: string
  performerId: string
  performerName: string
  performerNumber?: string
  tournamentAthletes: string[]
  clubId: string
  clubName: string
  clubAddressId: string
  performanceId: string
  performanceName: string
  judges: PerformanceJudge[]
}

export interface PerformanceJudge {
  judgeId: string
  judgeName: string
  criteriaName: string
}

export interface CurrentQueueUIResponse {
  path: string
  query: {
    slotNumber: number | null
    tournamentId: string
    performanceId: string
    performerId: string
    categoryId: string
    criteriaId: string
    judgeId: string
    judgeName: string
    criteriaName: string
  }
}

export interface CurrentTournament {
  tournamentName: string
}

export interface TournamentQueue {
  id: string
  tournamentId: string
  slotNumber: number
  status?: TournamentQueueStatus[]
  runs: TournamentQueueRun[]
  mode: TournamentQueueMode
}

export type TournamentQueueMode = 'normal' | 'reset' | 'pause' | 'message'

export interface TournamentQueueStatus {
  judgeId: string
  judgeName: string
  criteriaName: string
  sent: string| null
}

export interface TournamentQueueRun {
  status: {
    [key: string]: string
  }
  slotStart: string
  slotNumber: number
}

export interface ReportFormat {
  [key: string]: ReportItemFormat[]
}

export interface ReportItemFormat {
  [key: string]: string | number
}
