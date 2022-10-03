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

export interface Address {
  street: string
  houseNumber?: string
  zipCode: string
  city: string
  country: string
}

export interface Club extends Address {
  clubName: string
  associationId?: string
}

export interface Tournament extends Address {
  tournamentName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tournamentCoordinates?: any
  competition?: string
  tournamentStartTime: string
  tournamentEndTime: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo?: any
}
