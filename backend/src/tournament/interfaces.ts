import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { Address as AddressDAO, Tournament as TournamentDAO, Location as LocationDAO, Slot as SlotDAO, Performance as PerformanceDAO, Performer as PerformerDAO } from '../lib/db/__generated__'
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
export type Slot = Omit<Omit<SlotDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'tournamentId' | 'slotNumber'> & SlotNumber & TournamentId, 'id'>
export type Location = LocationDAO
export type Performer = Omit<PerformerDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' >
export type Performance = Omit<PerformanceDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' >
export type TournamentAthlete = Person & TournamentId
export type TournamentJudge = Person & TournamentId

// Interfaces (Ports)
export interface ITournamentContext extends IGetApplicationContext {
  addTournament: (tournament: TournamentAndAddress) => Promise<TournamentAndAddress & Id>
  getTournament: (id: string) => Promise<(Tournament & Id) | null>
  listTournaments: () => Promise<(Tournament & Id)[]>
  addSlot: (slot: Slot) => Promise<Slot | null>
  listSlots: (tournamentId: string) => Promise<(Slot)[]>
  addLocation: (location: Omit<Location, 'id'>) => Promise<Location | null>
  modifyLocation: (location: Location) => Promise<Location | null>
  removeLocation: (location: Location) => Promise<void>
  listLocations: (tournamentId: TournamentDAO['id']) => Promise<(Location)[]>
  addPerformer: (performer: Performer) => Promise<Performer & Id | null>
  getPerformer: (performerId: string) => Promise<(Performer & Id | null)>
  listPerformer: (tournamentId: string) => Promise<(Performer & Id)[]>
  addPerformance: (performance: Performance) => Promise<Performance & Id | null>
  listPerformances: (tournamentId: string) => Promise<(Performance & Id)[]>
  getPerformance: (id: string) => Promise<(Performance & Id) | null>
  addTournamentAthlete: (athlete: TournamentAthlete) => Promise<TournamentAthlete>
  getTournamentAthlete: (id: string) => Promise<(TournamentAthlete & Id) | null>
  addTournamentJudge: (judge: TournamentJudge) => Promise<TournamentJudge>
  getTournamentJudge: (id: string) => Promise<(TournamentJudge & Id) | null>
  listTournamentJudges: (tournamentId: string) => Promise<TournamentJudge[]>
}
