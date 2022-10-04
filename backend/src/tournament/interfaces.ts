import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { Address as AddressDAO, Tournament as TournamentDAO, Location as LocationDAO, Slot as SlotDAO, Performance as PerformanceDAO } from '../lib/db/__generated__'
import { Person } from '../people/interfaces'

// Domain Types
export type TournamentName = {tournamentName: string}
export type TournamentId = {tournamentId: string}
export type ClubName = {clubName: string}
export type CategoryName = {categoryName: string}
export type LocationName = {locationName: string}
export type SlotNumber = {slotNumber: number}
export type JudgingRuleName = {judgingRuleName: string}
export type TournamentAndAddress = Omit<TournamentDAO & AddressDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId'>
export type Tournament = Omit<TournamentDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId'>
export type Slot = Omit<Omit<SlotDAO & TournamentName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId' | 'slotNumber'> & SlotNumber, 'id'>
export type Location = LocationDAO
export type Performance = Omit<Omit<PerformanceDAO & TournamentName & ClubName & LocationName & CategoryName, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId' | 'clubId' | 'categoryId' | 'locationId' | 'slotNumber'> & SlotNumber, 'id'>
export type TournamentAthlete = Person & TournamentId
export type TournamentJudge = Person & TournamentId

// Interfaces (Ports)
export interface ITournamentContext extends IGetApplicationContext {
  addTournament: (tournament: TournamentAndAddress) => Promise<TournamentAndAddress & Id>
  listTournaments: () => Promise<(Tournament & Id)[]>
  addSlot: (slot: Slot) => Promise<Slot | null>
  listSlots: (tournamentName: TournamentName['tournamentName']) => Promise<(Slot & Id)[]>
  addLocation: (location: Omit<Location, 'id'>) => Promise<Location | null>
  modifyLocation: (location: Location) => Promise<Location | null>
  removeLocation: (location: Location) => Promise<void>
  listLocations: (tournamentId: TournamentDAO['id']) => Promise<(Location)[]>
  addPerformance: (performance: Performance) => Promise<Performance & Id | null>
  addTournamentAthlete: (athlete: TournamentAthlete) => Promise<TournamentAthlete>
  addTournamentJudge: (judge: TournamentAthlete) => Promise<TournamentAthlete>
}
