import { omit } from 'lodash-es'
import { findJudgingRuleByName } from '../judging/repository'
import { Id, isNotNull, newRecordAttributes } from '../lib/common'
import { Category as CategoryDAO } from '../lib/db/__generated__'
import { Person } from '../people/interfaces'
import { findClubByName, insertAddress, insertAthlete, insertJudge, insertPerson } from '../people/repository'
import { Category, Combination, Location, Performance, Slot, Tournament, ITournamentContext, WeightedCategory } from './interfaces'
import { findCategoryByCategoryName, findLocationByLocationName, findTournamentByTournamentName, insertCategory, insertCategoryCombination, insertCombination, insertLocation, insertPerformance, insertSlot, insertTournament, insertTournamentAthlete, insertTournamentJudge } from './repository'

export class TournamentService implements ITournamentContext {
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

  async addCategory (c: Category) : Promise<Category & Id | null> {
    const judgingRule = await findJudgingRuleByName(c.judgingRuleName)
    if (!judgingRule) return null
    const category = await insertCategory({ ...c, judgingRuleId: judgingRule.id })
    return { ...c, id: category.id }
  }

  async addCombination (combinationName: string, weightedCategories: WeightedCategory[]) : Promise<Combination & Id | null> {
    // first insert the combination
    const combination = await insertCombination({ combinationName, ...newRecordAttributes() })
    interface C {category: CategoryDAO, weight: number}
    // then retrieve the categories with the given categoryNames
    const categories = await Promise.all(weightedCategories.map(weightedCategory => findCategoryByCategoryName(weightedCategory.categoryName)))
    const categoryWeightPairs = categories.map((category, i) => ({ category, weight: weightedCategories[i].categoryWeight }))
    const filteredCategories = categoryWeightPairs.filter((categoryWeightPair): categoryWeightPair is C => isNotNull(categoryWeightPair.category))
    // then insert the CategoryCombination Objects
    await Promise.all(filteredCategories.map(category => insertCategoryCombination(combination.combinationName, category.category?.categoryName, category.weight)))
    return combination
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
