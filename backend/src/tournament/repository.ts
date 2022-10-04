/* eslint-disable camelcase */
import { db, Location, Performance, Slot, Tournament, TournamentAthlete, TournamentJudge } from '../lib/db/database'
import { Location_InsertParameters, Performance_InsertParameters, Slot_InsertParameters, TournamentAthlete_InsertParameters, TournamentJudge_InsertParameters, Tournament_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes, updateRecordAttributes } from '../lib/common'

// Tournament
export async function insertTournament (tournament: Omit<Tournament_InsertParameters, 'id'>) {
  const [insertedTournament] = await Tournament(db).insert({ ...tournament, ...newRecordAttributes() })
  return insertedTournament
}

export async function findAllTournaments () {
  return await (await Tournament(db).find().all())
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

export async function findPerformances (performance: Performance_InsertParameters) {
  return await Performance(db).find(performance).all()
}

// TournamentAthlete
export async function insertTournamentAthlete (tournamentAthlete: Omit<TournamentAthlete_InsertParameters, 'id'>) {
  const [insertetTournamentAthlete] = await TournamentAthlete(db).insert({ ...tournamentAthlete, ...newRecordAttributes() })
  return insertetTournamentAthlete
}

// TournamentJudge
export async function insertTournamentJudge (tournamentJudge: Omit<TournamentJudge_InsertParameters, 'id'>) {
  const [insertetTournamentJudge] = await TournamentJudge(db).insert({ ...tournamentJudge, ...newRecordAttributes() })
  return insertetTournamentJudge
}
