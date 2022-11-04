import { IGetApplicationContext } from '../../applicationContext'
import { Id, newRecordAttributes } from '../lib/common'
import { insertAddress, insertAthlete, insertJudge, insertPerson } from '../people/repository'
import {
  Location,
  Performance,
  Slot,
  TournamentAndAddress,
  ITournamentContext,
  Tournament,
  TournamentAthlete,
  TournamentJudge,
  Performer
} from './interfaces'
import {
  deleteLocation,
  findAllTournaments,
  findAllTournamentSlots,
  findLocationsByTournamentId,
  findPerformances,
  findPerformer,
  findTournamentAthletesAndPerson,
  findTournamentJudgesAndPerson,
  getPerformanceById,
  getTournamentAthleteAndPerson,
  getTournamentById,
  getTournamentJudgeAndPerson,
  insertLocation,
  insertPerformance,
  insertPerformer,
  insertSlot,
  insertTournament,
  insertTournamentAthlete,
  insertTournamentJudge,
  updateLocation
} from './repository'

export class TournamentService implements ITournamentContext {
  getApplicationContext
  constructor (getApplicationContext: IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async listTournaments (): Promise<(Tournament & Id)[]> {
    const tournaments = await findAllTournaments()
    return tournaments
  }

  async getTournament (id: string): Promise<((Tournament & Id) | null)> {
    return await getTournamentById(id)
  }

  async listSlots (tournamentId: string): Promise<Slot[]> {
    const slots = await findAllTournamentSlots(tournamentId)
    return slots
  }

  async addTournament (t: TournamentAndAddress): Promise<TournamentAndAddress & Id> {
    const address = await insertAddress({
      street: t.street,
      houseNumber: t.houseNumber,
      zipCode: t.zipCode,
      city: t.city,
      country: t.country
    })

    const tournament = await insertTournament({
      addressId: address.id,
      tournamentName: t.tournamentName,
      competition: t.competition,
      tournamentStartTime: t.tournamentStartTime,
      tournamentEndTime: t.tournamentEndTime
    })
    return { ...t, id: tournament.id }
  }

  async addSlot (s: Slot): Promise<Slot | null> {
    const insertedSlot = await insertSlot(s)
    return insertedSlot
  }

  async addLocation (l: Omit<Location, 'id'>): Promise<Location | null> {
    const location = await insertLocation(l)
    return { ...l, id: location.id }
  }

  async modifyLocation (l: Location & Id): Promise<Location | null> {
    return await updateLocation(l)
  }

  async removeLocation (l: Location & Id): Promise<void> {
    return await deleteLocation(l)
  }

  async listLocations (tournamentId: string): Promise<Location[]> {
    const locations = await findLocationsByTournamentId(tournamentId)
    return locations
  }

  async addPerformer (p: Performer): Promise<(Performer & Id) | null> {
    const performance = await insertPerformer({
      ...p,
      ...newRecordAttributes()
    })
    return { ...p, id: performance.id }
  }

  async getPerformer (performerId: string): Promise<(Performer & Id | null)> {
    return await this.getPerformer(performerId)
  }

  async listPerformer (tournamentId: string): Promise<(Performer & Id)[]> {
    return await findPerformer({ tournamentId })
  }

  async addPerformance (p: Performance): Promise<(Performance & Id) | null> {
    const performance = await insertPerformance({
      ...p,
      ...newRecordAttributes()
    })

    return { ...p, id: performance.id }
  }

  async listPerformances (tournamentId: string): Promise<(Performance & Id)[]> {
    return await findPerformances({ tournamentId })
  }

  async getPerformance (id: string): Promise<(Performance & Id) | null> {
    return await getPerformanceById(id)
  }

  async addTournamentAthlete (a: TournamentAthlete): Promise<TournamentAthlete> {
    const person = await insertPerson(a)
    const athlete = await insertAthlete({ personId: person.id })
    const tournamentAthlete = await insertTournamentAthlete({ tournamentId: a.tournamentId, athleteId: athlete.id })
    return { ...a, ...tournamentAthlete }
  }

  async getTournamentAthlete (id: string): Promise<(TournamentAthlete & Id) | null> {
    return await getTournamentAthleteAndPerson(id)
  }

  async listTournamentAthletes (tournamentId: string): Promise<TournamentJudge[]> {
    return await findTournamentAthletesAndPerson(tournamentId)
  }

  async addTournamentJudge (j: TournamentJudge): Promise<TournamentJudge> {
    const person = await insertPerson(j)
    const judge = await insertJudge({ personId: person.id })
    const tournamentJudge = await insertTournamentJudge({ tournamentId: j.tournamentId, judgeId: judge.id })
    return { ...j, ...tournamentJudge }
  }

  async getTournamentJudge (id: string): Promise<(TournamentJudge & Id) | null> {
    return await getTournamentJudgeAndPerson(id)
  }

  async listTournamentJudges (tournamentId: string): Promise<TournamentJudge[]> {
    return await findTournamentJudgesAndPerson(tournamentId)
  }
}
