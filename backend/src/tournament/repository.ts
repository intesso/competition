/* eslint-disable camelcase */
import { db, Location, Performance, Slot, sql, Tournament, TournamentAthlete, TournamentJudge } from '../lib/db/database'
import { Location_InsertParameters, Performance_InsertParameters, Slot_InsertParameters, TournamentAthlete_InsertParameters, TournamentJudge_InsertParameters, Tournament_InsertParameters } from '../lib/db/__generated__'
import { Id, newRecordAttributes, updateRecordAttributes } from '../lib/common'
import { TournamentJudge as TournamentJudgeDomainObject, TournamentAthlete as TournamentAthleteDomainObject } from './interfaces'

// Tournament
export async function insertTournament (tournament: Omit<Tournament_InsertParameters, 'id'>) {
  const [insertedTournament] = await Tournament(db).insert({ ...tournament, ...newRecordAttributes() })
  return insertedTournament
}

export async function findAllTournaments () {
  return await (await Tournament(db).find().all())
}

export async function getTournamentById (id: string) {
  return await Tournament(db).findOne({ id })
}

export async function findTournamentByTournamentName (tournamentName: string) {
  return await Tournament(db).findOne({ tournamentName })
}

// Location
export async function insertLocation (location: Omit<Location_InsertParameters, 'id'>) {
  const [insertedLocation] = await Location(db).insert({ ...location, ...newRecordAttributes() })
  return insertedLocation
}

export async function updateLocation (location: Location_InsertParameters) {
  const [updatedLocation] = await Location(db).update({ id: location.id }, { ...location, ...updateRecordAttributes() })
  return updatedLocation
}

export async function deleteLocation (location: Omit<Location_InsertParameters, 'id'>) {
  return await Location(db).delete({ locationName: location.locationName })
}

export async function findLocationByLocationName (locationName: string) {
  return await Location(db).findOne({ locationName })
}

export async function findLocationsByTournamentName (tournamentName: string) {
  const tournament = await findTournamentByTournamentName(tournamentName)
  if (!tournament) {
    return []
  }
  return await Location(db).find({ tournamentId: tournament.id }).all()
}

export async function findLocationsByTournamentId (tournamentId: string) {
  return await Location(db).find({ tournamentId }).all()
}

// Slot
export async function insertSlot (slot: Omit<Slot_InsertParameters, 'id'>) {
  const [insertedSlot] = await Slot(db).insert({ ...slot, createdAt: new Date() })
  return insertedSlot
}

export async function findSlotByTorunamentNameAndSlotNumber (tournamentName: string, slotNumber: number) {
  const tournament = await findTournamentByTournamentName(tournamentName)
  if (!tournament) return null
  return await Slot(db).findOne({ tournamentId: tournament.id, slotNumber })
}

// Performance
export async function insertPerformance (performance: Omit<Performance_InsertParameters, 'id'>) {
  const [insertedPerformance] = await Performance(db).insert({ ...performance, ...newRecordAttributes() })
  return insertedPerformance
}

export async function findPerformances (performance: Partial<Performance_InsertParameters>) {
  return await Performance(db).find(performance).all()
}

export async function getPerformanceById (id: string) {
  return await Performance(db).findOne({ id })
}

// TournamentAthlete
export async function insertTournamentAthlete (tournamentAthlete: Omit<TournamentAthlete_InsertParameters, 'id'>) {
  const [insertedTournamentAthlete] = await TournamentAthlete(db).insert({ ...tournamentAthlete, ...newRecordAttributes() })
  return insertedTournamentAthlete
}

export async function findTournamentAthletes (tournamentAthlete: Partial<TournamentAthlete_InsertParameters>) {
  const foundTournamentAthletes = await TournamentAthlete(db).find({ ...tournamentAthlete, ...newRecordAttributes() }).all()
  return foundTournamentAthletes
}

export async function getTournamentAthleteAndPerson (id: string) {
  const [tournamentAthlete] = (await db.query(sql`
    select  "TournamentAthlete".id, "TournamentAthlete"."tournamentId", "TournamentAthlete"."createdAt",  "TournamentAthlete"."createdBy", "TournamentAthlete"."updatedAt",  "TournamentAthlete"."updatedBy", "Person"."clubHead", "Person"."firstName", "Person"."lastName" 
    from "TournamentAthlete" 
    join "Athlete"
    on "Athlete".id = "TournamentAthlete"."AthleteId"
    join "Person"
    on "Athlete"."personId" = "Person"."id"
    where "TournamentAthlete"."id" = ${id}
`)) as (TournamentAthleteDomainObject & Id)[]
  return tournamentAthlete
}

export async function findTournamentAthletesAndPerson (tournamentId: string) {
  const tournamentAthletes = (await db.query(sql`
    select  "TournamentAthlete".id, "TournamentAthlete"."tournamentId", "TournamentAthlete"."createdAt",  "TournamentAthlete"."createdBy", "TournamentAthlete"."updatedAt",  "TournamentAthlete"."updatedBy", "Person"."clubHead", "Person"."firstName", "Person"."lastName" 
    from "TournamentAthlete" 
    join "Athlete"
    on "Athlete".id = "TournamentAthlete"."AthleteId"
    join "Person"
    on "Athlete"."personId" = "Person"."id"
    where "TournamentAthlete"."tournamentId" = ${tournamentId}
`)) as (TournamentAthleteDomainObject & Id)[]
  return tournamentAthletes
}

// TournamentJudge
export async function insertTournamentJudge (tournamentJudge: Omit<TournamentJudge_InsertParameters, 'id'>) {
  const [insertedTournamentJudge] = await TournamentJudge(db).insert({ ...tournamentJudge, ...newRecordAttributes() })
  return insertedTournamentJudge
}

export async function findTournamentJudges (tournamentJudge: Partial<TournamentJudge_InsertParameters>) {
  const foundTournamentJudges = await TournamentJudge(db).find({ ...tournamentJudge, ...newRecordAttributes() }).all()
  return foundTournamentJudges
}

export async function getTournamentJudgeAndPerson (id: string) {
  const [tournamentJudge] = (await db.query(sql`
    select  "TournamentJudge".id, "TournamentJudge"."tournamentId", "TournamentJudge"."createdAt",  "TournamentJudge"."createdBy", "TournamentJudge"."updatedAt",  "TournamentJudge"."updatedBy", "Person"."clubHead", "Person"."firstName", "Person"."lastName" 
    from "TournamentJudge" 
    join "Judge"
    on "Judge".id = "TournamentJudge"."judgeId"
    join "Person"
    on "Judge"."personId" = "Person"."id"
    where "TournamentJudge"."id" = ${id}
`)) as (TournamentJudgeDomainObject & Id) []
  return tournamentJudge
}

export async function findTournamentJudgesAndPerson (tournamentId: string) {
  const tournamentJudges = (await db.query(sql`
    select  "TournamentJudge".id, "TournamentJudge"."tournamentId", "TournamentJudge"."createdAt",  "TournamentJudge"."createdBy", "TournamentJudge"."updatedAt",  "TournamentJudge"."updatedBy", "Person"."clubHead", "Person"."firstName", "Person"."lastName" 
    from "TournamentJudge" 
    join "Judge"
    on "Judge".id = "TournamentJudge"."judgeId"
    join "Person"
    on "Judge"."personId" = "Person"."id"
    where "TournamentJudge"."tournamentId" = ${tournamentId}
`)) as TournamentJudgeDomainObject[]
  return tournamentJudges
}
