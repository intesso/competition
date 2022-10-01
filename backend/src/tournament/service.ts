import { omit } from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import { findCategoryByCategoryName } from '../judging/repository'
import { Id, newRecordAttributes } from '../lib/common'
import { Person } from '../people/interfaces'
import { findClubByName, insertAddress, insertAthlete, insertJudge, insertPerson } from '../people/repository'
import { Location, Performance, Slot, Tournament, ITournamentContext } from './interfaces'
import { findLocationByLocationName, findTournamentByTournamentName, insertLocation, insertPerformance, insertSlot, insertTournament, insertTournamentAthlete, insertTournamentJudge } from './repository'

export class TournamentService implements ITournamentContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async addTournament (t: Tournament) : Promise<Tournament & Id> {
    const address = await insertAddress({ street: t.street, houseNumber: t.houseNumber, zipCode: t.zipCode, city: t.city, country: t.country })

    const tournament = await insertTournament({ ...t, addressId: address.id })
    return { ...t, id: tournament.id }
  }

  async addSlot (s: Slot) : Promise<Slot | null> {
    const tournament = await findTournamentByTournamentName(s.tournamentName)
    if (!tournament) return null
    await insertSlot({ ...s, tournamentId: tournament.id })
    return s
  }

  async addLocation (l: Location) : Promise<Location & Id | null> {
    const tournament = await findTournamentByTournamentName(l.tournamentName)
    if (!tournament) return null
    const location = await insertLocation({ ...l, tournamentId: tournament.id })
    return { ...l, id: location.id }
  }

  async addPerformance (p: Performance): Promise<Performance & Id | null> {
    // get TournamentName & ClubName & LocationName & CategoryName
    const [tournament, club, location, category] = await Promise.all([
      findTournamentByTournamentName(p.tournamentName),
      findClubByName(p.clubName),
      findLocationByLocationName(p.locationName),
      findCategoryByCategoryName(p.categoryName)
    ])
    if (!tournament || !club || !location || !category) {
      return null
    }

    // insert performance
    const performance = await insertPerformance({
      ...omit(p, 'tournamentName', 'clubName', 'locationName', 'categoryName'),
      tournamentId: tournament.id,
      clubId: club.id,
      locationId: location.id,
      categoryId: category.id,
      ...newRecordAttributes()
    })

    return { ...p, id: performance.id }
  }

  async addTournamentAthlete<P extends Person> (a: P): Promise<P & Id> {
    const person = await insertPerson(a)
    const athlete = await insertAthlete({ personId: person.id })
    const tournamentAthlete = await insertTournamentAthlete({ athleteId: athlete.id })
    return { ...a, id: tournamentAthlete.id }
  }

  async addTournamentJudge<P extends Person> (j: P): Promise<P & Id> {
    const person = await insertPerson(j)
    const judge = await insertJudge({ personId: person.id })
    const tournamentJudge = await insertTournamentJudge({ judgeId: judge.id })
    return { ...j, id: tournamentJudge.id }
  }
}
