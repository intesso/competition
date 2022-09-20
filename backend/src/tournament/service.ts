import { Id } from '../lib/common'
import { Person } from '../people/interfaces'
import { insertAddress } from '../people/repository'
import { Category, Combination, Location, Performance, Slot, Tournament, TournamentContext, WeightedCategory } from './interfaces'
import { insertTournament } from './repository'

export class TournamentService implements TournamentContext {
  async addTournament (t: Tournament) : Promise<Tournament & Id> {
    const address = await insertAddress({ street: t.street, houseNumber: t.houseNumber, zipCode: t.zipCode, city: t.city, country: t.country })

    const tournament = await insertTournament({ ...t, addressId: address.id })
    return { ...t, id: tournament.id }
  }

  // TODO

  addSlot: (slot: Slot) => Promise<Slot & Id>
  addLocation: (location: Location) => Promise<Location & Id>
  addCategory: (category: Category) => Promise<Category & Id>
  addCombination: (combinationName: string, weightedCategories: WeightedCategory[]) => Promise<Combination & Id>
  addPerformance: (performance: Performance) => Promise<Performance & Id>
  addTournamentAthlete: <P extends Person>(athlete: P) => Promise<P & Id>
  addTournamentJudge: <P extends Person>(judge: P) => Promise<P & Id>
}
