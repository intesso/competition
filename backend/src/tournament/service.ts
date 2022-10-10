import { IGetApplicationContext } from '../../applicationContext'
import { Id, newRecordAttributes } from '../lib/common'
import { insertAddress, insertAthlete, insertJudge, insertPerson } from '../people/repository'
import { Location, Performance, Slot, TournamentAndAddress, ITournamentContext, Tournament, TournamentAthlete, TournamentJudge } from './interfaces'
import {
  deleteLocation,
  findAllTournaments,
  findLocationsByTournamentId,
  findTournamentByTournamentName,
  insertLocation,
  insertPerformance,
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

  async listSlots (tournamentName: string): Promise<(Slot & Id)[]> {
    // TODO
    return Promise.resolve([])
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
    const tournament = await findTournamentByTournamentName(s.tournamentName)
    if (!tournament) return null
    await insertSlot({ ...s, tournamentId: tournament.id })
    return s
  }

  async addLocation (l: Omit<Location, 'id'>): Promise<Location | null> {
    const location = await insertLocation(l)
    return { ...l, id: location.id }
  }

  async modifyLocation (l: Location & Id) : Promise<Location | null> {
    return await updateLocation(l)
  }

  async removeLocation (l: Location & Id) : Promise<void> {
    return await deleteLocation(l)
  }

  async listLocations (tournamentId: string): Promise<Location[]> {
    const locations = await findLocationsByTournamentId(tournamentId)
    return locations
  }

  // TODO remove
  // async addPerformance (p: Performance): Promise<(Performance & Id) | null> {
  //   // get TournamentName & ClubName & LocationName & CategoryName
  //   const [tournament, club, location, category] = await Promise.all([
  //     findTournamentByTournamentName(p.tournamentName),
  //     findClubByName(p.clubName),
  //     findLocationByLocationName(p.locationName),
  //     findCategoryByCategoryName(p.categoryName)
  //   ])
  //   if (!tournament || !club || !location || !category) {
  //     return null
  //   }

  //   // insert performance
  //   const performance = await insertPerformance({
  //     ...omit(p, 'tournamentName', 'clubName', 'locationName', 'categoryName'),
  //     tournamentId: tournament.id,
  //     clubId: club.id,
  //     locationId: location.id,
  //     categoryId: category.id,
  //     ...newRecordAttributes()
  //   })

  //   return { ...p, id: performance.id }
  // }

  async addPerformance (p: Performance): Promise<(Performance & Id) | null> {
    const performance = await insertPerformance({
      ...p,
      ...newRecordAttributes()
    })

    return { ...p, id: performance.id }
  }

  async addTournamentAthlete (a: TournamentAthlete): Promise<TournamentAthlete> {
    const person = await insertPerson(a)
    const athlete = await insertAthlete({ personId: person.id })
    const tournamentAthlete = await insertTournamentAthlete({ tournamentId: a.tournamentId, athleteId: athlete.id })
    return { ...a, ...tournamentAthlete }
  }

  async addTournamentJudge (j: TournamentJudge): Promise<TournamentJudge> {
    const person = await insertPerson(j)
    const judge = await insertJudge({ personId: person.id })
    const tournamentJudge = await insertTournamentJudge({ tournamentId: j.tournamentId, judgeId: judge.id })
    return { ...j, ...tournamentJudge }
  }
}
