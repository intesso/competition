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

export interface Person {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'diverse' | 'unknown' | null
  birthDate: string
}

export type TournamentPerson = Person & {tournamentId: string}
export type TorunamentAthlete = TournamentPerson
export type TorunamentJudge = TournamentPerson

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
  locationCoordinates?:any
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
