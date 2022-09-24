import { Id } from '../lib/common'
import { Address as AddressDAO, Tournament as TournamentDAO, Location as LocationDAO, Slot as SlotDAO, Performance as PerformanceDAO, Category as CategoryDAO, Combination as CombinationDAO } from '../lib/db/__generated__'
import { Person } from '../people/interfaces'

// Domain Types
export type TournamentName = {tournamentName: string}
export type ClubName = {clubName: string}
export type CategoryName = {categoryName: string}
export type LocationName = {locationName: string}
export type SlotNumber = {slotNumber: number}
export type JudgingRuleName = {judgingRuleName: string}
export type CategoryWeight = {categoryWeight: number}
export type Tournament = Omit<TournamentDAO & AddressDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId'>
export type Slot = Omit<Omit<SlotDAO & TournamentName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId' | 'slotNumber'> & SlotNumber, 'id'>
export type Location = Omit<LocationDAO & TournamentName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId'>
export type Category = Omit<CategoryDAO & JudgingRuleName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'judgingRuleId'>
export type WeightedCategory = CategoryName & CategoryWeight
export type Combination = Omit<CombinationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>

export type Performance = Omit<Omit<PerformanceDAO & TournamentName & ClubName & LocationName & CategoryName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId' | 'clubId' | 'categoryId' | 'locationId' | 'slotNumber'> & SlotNumber, 'id'>
export type TournamentAthlete = Person
export type TournamentJudge = Person

// Interfaces (Ports)
export interface ITournamentContext {
  addTournament: (tournament: Tournament) => Promise<Tournament & Id>
  addSlot: (slot: Slot) => Promise<Slot | null>
  addLocation: (location: Location) => Promise<Location & Id | null>
  addCategory: (category: Category) => Promise<Category & Id | null>
  addCombination: (combinationName: string, weightedCategories: WeightedCategory[]) => Promise<Combination & Id | null>
  addPerformance: (performance: Performance) => Promise<Performance & Id | null>
  addTournamentAthlete: <P extends Person>(athlete: P) => Promise<P & Id>
  addTournamentJudge: <P extends Person>(judge: P) => Promise<P & Id>
}
