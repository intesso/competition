import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import {
  Address as AddressDAO,
  Tournament as TournamentDAO,
  Location as LocationDAO,
  Slot as SlotDAO,
  Performance as PerformanceDAO,
  Performer as PerformerDAO,
  TournamentQueue
} from '../lib/db/__generated__'
import { Person } from '../people/interfaces'

// Domain Types

export interface TournamentPlan {
  tournamentName: string
  slotNumber: number | string
  locationName: string
  categoryName: string
  performerName: string
  performerNumber?: string
  clubName: string
  performanceName: string
  judgeDevice: PerformanceJudgePlanImport['judgeDevice']
  judgeName: PerformanceJudgePlanImport['judgeName']
  criteriaName: PerformanceJudgePlanImport['criteriaName']
}

export interface PerformanceJudgePlanImport {
  judgeDevice: string
  judgeName: string
  criteriaName: string
}

export interface TournamentPlanDetails {
  tournamentId: string
  tournamentName: string
  slotNumber: number | string
  locationId: string
  locationName: string
  categoryId: string
  categoryName: string
  performerId: string
  performerName: string
  performerNumber?: string
  tournamentAthletes: string[]
  clubId: string
  clubName: string
  clubAddressId: string
  performanceId: string
  performanceName: string
  judges: PerformanceJudge[]
}

export interface PerformanceJudge {
  judgeId: string
  judgeName: string
  criteriaName: string
}

export interface QueueRunPerformanceJudge extends PerformanceJudge {
  sent: string | null
}

export interface CurrentQueueUIResponse {
  path: string
  query: {
    slotNumber: number | null
    tournamentId: string
    performanceId: string
    performerId: string
    categoryId: string
    criteriaId: string
    judgeId: string
    judgeName: string
    criteriaName: string
  }
}

export interface QueueRun {
  slotNumber: number | null
  slotStart: string
  status: QueueRunPerformanceJudge[] | null
}

export type TournamentName = { tournamentName: string };
export type TournamentId = { tournamentId: string };
export type ClubName = { clubName: string };
export type CategoryName = { categoryName: string };
export type LocationName = { locationName: string };
export type SlotNumber = { slotNumber: number };
export type JudgingRuleName = { judgingRuleName: string };
export type TournamentAndAddress = Omit<
  TournamentDAO & AddressDAO,
  'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy' | 'addressId'
>;
export type Tournament = Omit<
  TournamentDAO,
  'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy' | 'addressId'
>;
export type Slot = Omit<
  Omit<SlotDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy' | 'tournamentId' | 'slotNumber'> &
    SlotNumber &
    TournamentId,
  'id'
>;
export type Location = LocationDAO;
export type Performer = Omit<PerformerDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type Performance = Omit<PerformanceDAO, 'id' | 'updatedAt' | 'updatedBy' | 'createdAt' | 'createdBy'>;
export type TournamentAthlete = Person & TournamentId;
export type TournamentJudge = Person & TournamentId;
export type CurrentTournamentQueue = TournamentQueue & { status: QueueRunPerformanceJudge[], mode: TournamentQueueMode }
export type TournamentQueueMode = 'normal' | 'reset' | 'pause' | 'message'

// Interfaces (Ports)
export interface ITournamentContext extends IGetApplicationContext {
  planTournament: (tournamentPlan: TournamentPlan[]) => Promise<TournamentPlan[] | null>
  getTournamentPlan: (tournamentId: string) => Promise<TournamentPlanDetails[] | null>
  addTournament: (tournament: TournamentAndAddress) => Promise<TournamentAndAddress & Id>
  getTournament: (id: string) => Promise<(Tournament & Id) | null>
  listTournamentCategories: (tournamentId: string) =>Promise<string[]>
  getTournamentByName: (tournamentName: string) => Promise<(Tournament & Id) | null>
  listTournaments: () => Promise<(Tournament & Id)[]>
  addSlot: (slot: Slot) => Promise<Slot | null>
  listSlots: (tournamentId: string) => Promise<Slot[]>
  addLocation: (location: Omit<Location, 'id'>) => Promise<Location | null>
  modifyLocation: (location: Location) => Promise<Location | null>
  removeLocation: (location: Location) => Promise<void>
  listLocations: (tournamentId: TournamentDAO['id']) => Promise<Location[]>
  getLocation: (locationId: LocationDAO['id']) => Promise<Location | null>
  addPerformer: (performer: Performer) => Promise<(Performer & Id) | null>
  getPerformer: (id: string) => Promise<(Performer & Id) | null>
  getPerformerByName: (tournamentId: TournamentDAO['id'], performerName: string) => Promise<(Performer & Id) | null>
  listPerformer: (tournamentId: string) => Promise<(Performer & Id)[]>
  addPerformance: (performance: Performance) => Promise<(Performance & Id) | null>
  listPerformances: (tournamentId: string) => Promise<(Performance & Id)[]>
  getPerformanceByName: (tournamentId: string, performanceName: string) => Promise<(Performance & Id) | null>
  getPerformance: (id: string) => Promise<(Performance & Id) | null>
  disqualifyPerformance: (id: string, disqualified: boolean) => Promise<(Performance & Id) | null>
  removePointsForPerformance: (id: string) => Promise<void>
  removePointsForTournamentDANGER: (tournamentId: string) => Promise<void>
  addTournamentAthlete: (athlete: TournamentAthlete) => Promise<TournamentAthlete>
  getTournamentAthlete: (id: string) => Promise<(TournamentAthlete & Id) | null>
  listTournamentAthletes: (tournamentId: string) => Promise<TournamentAthlete[]>
  addTournamentJudge: (judge: TournamentJudge) => Promise<TournamentJudge>
  getTournamentJudge: (id: string) => Promise<(TournamentJudge & Id) | null>
  listTournamentJudges: (tournamentId: string) => Promise<TournamentJudge[]>
  setTournamentQueueMode: (tournamentId: string, mode: TournamentQueueMode) => Promise<TournamentQueue | null>
  setTournamentQueueSlot: (tournamentId: string, slotNumber: number) => Promise<TournamentQueue | null>
  moveTournamentQueueToNextSlot: (tournamentId: string) => Promise<TournamentQueue | null>
  moveTournamentQueueToPreviousSlot: (tournamentId: string) => Promise<TournamentQueue | null>
  getCurrentTournamentQueue: (tournamentId: string) => Promise<TournamentQueue | null>
  getCurrentTournamentQueueForJudge: (tournamentId: string, judgeId: string) => Promise<CurrentQueueUIResponse | null>
  removeTournamentQueueForTournamentDANGER: (tournamentId: string) => Promise<void>
}
