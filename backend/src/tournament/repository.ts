/* eslint-disable camelcase */
import { db, Location, Performance, Performer, Slot, sql, Tournament, TournamentAthlete, TournamentJudge } from '../lib/db/database'
import { Location_InsertParameters, Performance_InsertParameters, Performer_InsertParameters, Slot_InsertParameters, TournamentAthlete_InsertParameters, TournamentJudge_InsertParameters, Tournament_InsertParameters } from '../lib/db/__generated__'
import { Id, newRecordAttributes, updateRecordAttributes } from '../lib/common'
import { TournamentJudge as TournamentJudgeDomainObject, TournamentAthlete as TournamentAthleteDomainObject, TournamentPlanDetails } from './interfaces'

// Tournament
export async function insertTournament (tournament: Omit<Tournament_InsertParameters, 'id'>) {
  const [insertedTournament] = await Tournament(db).insert({ ...tournament, ...newRecordAttributes() })
  return insertedTournament
}

export async function insertOrUpdateTournament (tournament: Omit<Tournament_InsertParameters, 'id'>) {
  const foundTournament = await getTournament(tournament.tournamentName)
  if (foundTournament) {
    const [updatedLocation] = await Tournament(db).update({ tournamentName: tournament.tournamentName }, { ...foundTournament, ...tournament, updatedAt: new Date() })
    return updatedLocation
  }
  return await insertTournament(tournament)
}

export async function findAllTournaments () {
  return await (await Tournament(db).find().all())
}

export async function getTournamentById (id: string) {
  return await Tournament(db).findOne({ id })
}
export async function getTournament (tournamentName: string) {
  return await Tournament(db).findOne({ tournamentName })
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

export async function insertOrUpdateLocation (location: Omit<Location_InsertParameters, 'id'>) {
  const foundLocation = await getLocation(location.tournamentId, location.locationName)
  if (foundLocation) {
    const [updatedLocation] = await Location(db).update({ tournamentId: location.tournamentId, locationName: location.locationName }, { ...foundLocation, ...location, updatedAt: new Date() })
    return updatedLocation
  }
  return await insertLocation(location)
}

export async function getLocation (tournamentId: string, locationName: string) {
  return await Location(db).findOne({ tournamentId, locationName })
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
export async function insertSlot (slot: Slot_InsertParameters) {
  const [insertedSlot] = await Slot(db).insert({ ...slot, createdAt: new Date() })
  return insertedSlot
}

export async function insertOrUpdateSlot (slot: Slot_InsertParameters) {
  const foundSlot = await getSlot(slot.tournamentId, slot.slotNumber)
  if (foundSlot) {
    const [updatedSlot] = await Slot(db).update({ tournamentId: slot.tournamentId, slotNumber: slot.slotNumber }, { ...foundSlot, ...slot, updatedAt: new Date() })
    return updatedSlot
  }
  return await insertSlot(slot)
}

export async function findSlotByTorunamentNameAndSlotNumber (tournamentName: string, slotNumber: number) {
  const tournament = await findTournamentByTournamentName(tournamentName)
  if (!tournament) return null
  return await getSlot(tournament.id, slotNumber)
}

export async function getSlot (tournamentId: string, slotNumber: number) {
  return await Slot(db).findOne({ tournamentId, slotNumber })
}

export async function findAllTournamentSlots (tournamentId: string) {
  return await Slot(db).find({ tournamentId }).all()
}

// Performance
export async function insertPerformance (performance: Omit<Performance_InsertParameters, 'id'>) {
  const [insertedPerformance] = await Performance(db).insert({ ...performance, ...newRecordAttributes() })
  return insertedPerformance
}

export async function insertOrUpdatePerformance (performance: Omit<Performance_InsertParameters, 'id'>) {
  const foundPerformance = await getPerformance(performance.tournamentId, performance.performanceName)
  if (foundPerformance) {
    const [updatedPerformance] = await Performance(db).update({ tournamentId: performance.tournamentId, performanceName: performance.performanceName }, { ...foundPerformance, ...performance, updatedAt: new Date() })
    return updatedPerformance
  }
  return await insertPerformance(performance)
}

export async function findPerformances (performance: Partial<Performance_InsertParameters>) {
  return await Performance(db).find(performance).all()
}

export async function getPerformanceById (id: string) {
  return await Performance(db).findOne({ id })
}

export async function getPerformance (tournamentId: string, performanceName: string) {
  return await Performance(db).findOne({ tournamentId, performanceName })
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
  const foundPerformer = await getPerformer(performer.tournamentId, performer.performerName)
  if (foundPerformer) {
    const [updatedLocation] = await Performer(db).update({ tournamentId: performer.tournamentId, performerName: performer.performerName }, { ...foundPerformer, ...performer, updatedAt: new Date() })
    return updatedLocation
  }
  return await insertPerformer(performer)
}

export async function findPerformer (performer: Partial<Performer_InsertParameters>) {
  const foundPerformer = await Performer(db).find(performer).all()
  return foundPerformer
}

export async function getPerformer (tournamentId: string, performerName: string) {
  return await Performer(db).findOne({ tournamentId, performerName })
}

// Plan Tournament
export async function findTournamentPlan (tournamentId: string) {
  const tournamentAthletes = (await db.query(sql`
    select "Tournament"."id" as "tournamentId",
      "Tournament"."tournamentName",
      "Tournament"."addressId" as "tournamentAddressId",
      "Performance"."id" as "performanceId",
      "Performance"."performanceName",
      "Performance"."performanceNumber",
      "Performance"."judges" as "judges",
      "Club"."id" as "clubId",
      "Club"."clubName",
      "Club"."addressId" as "clubAddressId",
      "Location"."id" as "locationId",
      "Location"."locationName",
      "Slot"."slotNumber",
      "Performer"."id" as "performerId",
      "Performer"."performerName",
      "Performer"."performerNumber",
      "Performer"."tournamentAthletes",
      "Category"."id" as "categoryId",
      "Category"."categoryName" 
    from "Tournament" 
    left outer join "Performance" 
    on "Tournament"."id" = "Performance"."tournamentId" 
    left outer join "Club" 
    on "Performance"."clubId" = "Club"."id" 
    left outer join "Location" 
    on "Performance"."locationId" = "Location"."id" 
    left outer join "Slot" 
    on "Performance"."tournamentId" = "Slot"."tournamentId" and "Performance"."slotNumber" = "Slot"."slotNumber" 
    left outer join "Performer" 
    on "Performance"."performerId" = "Performer"."id" 
    left outer join "Category"
    on "Performance"."categoryId" = "Category"."id"
    where "Tournament"."id" = ${tournamentId}
    order by "Performance"."slotNumber" asc, "Location"."locationName" asc
`)) as (TournamentPlanDetails)[]
  return tournamentAthletes
}
