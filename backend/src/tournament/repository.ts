/* eslint-disable camelcase */
import { db, Location, Performance, Performer, Slot, sql, Tournament, TournamentAthlete, TournamentJudge } from '../lib/db/database'
import { Location_InsertParameters, Performance_InsertParameters, Performer_InsertParameters, Slot_InsertParameters, TournamentAthlete_InsertParameters, TournamentJudge_InsertParameters, Tournament_InsertParameters } from '../lib/db/__generated__'
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

export async function findTournament (tournament: Partial<Tournament_InsertParameters>) {
  return await Tournament(db).find(tournament).all()
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

export async function findAllTournamentSlots (tournamentId: string) {
  return await Slot(db).find({ tournamentId }).all()
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
  const foundTournamentAthletes = await TournamentAthlete(db).find({ ...tournamentAthlete }).all()
  return foundTournamentAthletes
}

export async function getTournamentAthleteAndPerson (id: string) {
  const [tournamentAthlete] = (await db.query(sql`
    select  "TournamentAthlete".id, "TournamentAthlete"."tournamentId", "TournamentAthlete"."createdAt",  "TournamentAthlete"."createdBy", "TournamentAthlete"."updatedAt",  "TournamentAthlete"."updatedBy", "Person"."clubHead", "Person"."firstName", "Person"."lastName" 
    from "TournamentAthlete" 
    join "Athlete"
    on "Athlete".id = "TournamentAthlete"."athleteId"
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
    on "Athlete".id = "TournamentAthlete"."athleteId"
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
  const foundTournamentJudges = await TournamentJudge(db).find({ ...tournamentJudge }).all()
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

// Performer
export async function insertPerformer (performer: Omit<Performer_InsertParameters, 'id'>) {
  const [insertedPerformer] = await Performer(db).insert({ ...performer, ...newRecordAttributes() })
  return insertedPerformer
}

export async function insertOrUpdatePerformer (performer: Omit<Performer_InsertParameters, 'id'>) {
  const [insertedOrUpdatedPerformer] = await Performer(db).insertOrUpdate(['tournamentId', 'performerName'], { ...performer, ...newRecordAttributes() })
  return insertedOrUpdatedPerformer
}

export async function findPerformer (performer: Partial<Performer_InsertParameters>) {
  const foundPerformer = await Performer(db).find(performer).all()
  return foundPerformer
}
