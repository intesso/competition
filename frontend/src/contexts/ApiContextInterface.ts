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
  tournamentJudgeId: string
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
  judges: string[]
  performanceName: string
  performanceNumber: number | null
  performanceStartTime: string | null
}

export interface Performer {
  id?: string
  tournamentId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tournamentAthletes: any
  performerName: string
}
