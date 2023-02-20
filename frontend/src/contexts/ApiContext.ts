import axios from 'axios'
import { createContext } from 'react'
import {
  Category,
  CategoryPointDetails,
  Club,
  Criteria,
  CurrentQueueUIResponse,
  CurrentTournament,
  JudgingRule,
  Location,
  Performance,
  Performer,
  RawPoint,
  ReportFormat,
  TorunamentAthlete,
  TorunamentJudge,
  Tournament,
  TournamentPerson,
  TournamentPlanDetails,
  TournamentQueue
} from './ApiContextInterface'

export interface Api {
  serverBaseUrl: string
  // person
  addClub: (club: Club) => Promise<void>
  listClubs: () => Promise<Club[]>
  // tournament
  getCurrentTournamentName: () => Promise<CurrentTournament>
  getTournamentQueue: (tournamentId: string) => Promise<TournamentQueue>
  setTournamentQueue: (tournamentId: string, slotNumber: number) => Promise<TournamentQueue>
  moveQueueForward: (tournamentId: string) => Promise<TournamentQueue>
  moveQueueBackward: (tournamentId: string) => Promise<TournamentQueue>
  listTournamentPlan: (tournamentId: string) => Promise<TournamentPlanDetails[]>
  listTournaments: () => Promise<Tournament[]>
  getTournamentQueueForJudge: (tournamentId: string, judgeId: string) => Promise<CurrentQueueUIResponse | null>
  addTournament: (tournament: Tournament) => Promise<void>
  getTournament: (id: string) => Promise<Tournament | null>
  getTournamentByName: (tournamentName: string) => Promise<Tournament | null>
  addTournamentAthlete: (person: TournamentPerson) => Promise<TournamentPerson>
  getTournamentAthlete: (tournamentId: string, id: string) => Promise<TournamentPerson | null>
  listTournamentAthletes: (tournamentId: string) => Promise<TournamentPerson[]>
  addTournamentJudge: (person: TournamentPerson) => Promise<TournamentPerson>
  getTournamentJudge: (tournamentId: string, id: string) => Promise<TournamentPerson | null>
  listTournamentJudges: (tournamentId: string) => Promise<TournamentPerson[]>
  addPerformer: (performer: Performer) => Promise<Performer>
  getPerformer: (tournamentId: string, id: string) => Promise<Performer | null>
  listPerformer: (tournamentId: string) => Promise<Performer[]>
  addPerformance: (performance: Performance) => Promise<Performance>
  getPerformance: (tournamentId: string, id: string) => Promise<Performance | null>
  listPerformances: (tournamentId: string) => Promise<Performance[]>
  disqualifyPerformance: (tournamentId: string, performanceId: string, disqualified: boolean) => Promise<Performance | null>
  getLocation: (tournamentId: string, id: string) => Promise<Location | null>
  listLocations: (tournamentName: string) => Promise<Location[]>
  addLocation: (location: Location) => Promise<Location>
  modifyLocation: (location: Location) => Promise<Location>
  removeLocation: (location: Location) => Promise<void>

  // judging
  listCategories: () => Promise<Category[]>
  getCategory: (id: string) => Promise<Category | null>
  listCriteria: (categoryId: string) => Promise<Criteria[]>
  getCriteria: (id: string) => Promise<Criteria | null>
  getJudgingRuleByCategoryId: (categoryId: string) => Promise<JudgingRule | null>
  getJudgingRule: (id: string) => Promise<JudgingRule | null>
  addRawPoint: (rawPoint: RawPoint) => Promise<RawPoint>
  getRawPointForJudge: (performanceId: string, judgeId: string, criteriaId: string) => Promise<RawPoint>
  // ranks (calculatiom)
  getCategoryPoints: (tournamentId: string) => Promise<CategoryPointDetails>
  getCategoryRanks: (tournamentId: string) => Promise<ReportFormat>
  getCombinationRanks: (tournamentId: string) => Promise<ReportFormat>
  calculateAllPoints: (tournamentId: string) => Promise<void>
  calculateAllCategoryRanks: (tournamentId: string) => Promise<void>
  calculateAllCombinationRanks: (tournamentId: string) => Promise<void>
  deleteAllCalculations: (tournamentId: string) => Promise<void>
}

export function provideApiContext (): Api {
  const { serverAddress } = getEnvVariables()
  const serverBaseUrl = serverAddress

  const headers = {}

  // API REST call methods
  async function addClub (club: Club) {
    const data = club
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/people/clubs`,
        method: 'POST',
        data
      })
    ).data
  }

  async function listClubs () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/people/clubs`,
        method: 'GET'
      })
    ).data as Club[]
  }

  async function getCurrentTournamentName () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/current`,
        method: 'GET'
      })
    ).data as CurrentTournament
  }

  async function addTournament (tournament: Tournament) {
    const data = tournament
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments`,
        method: 'POST',
        data
      })
    ).data
  }

  async function getTournament (id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${id}`,
        method: 'GET'
      })
    ).data as Tournament | null
  }

  async function getTournamentByName (tournamentName: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/?tournamentName=${tournamentName}`,
        method: 'GET'
      })
    ).data as Tournament | null
  }

  async function listTournaments () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments`,
        method: 'GET'
      })
    ).data as Tournament[]
  }

  async function getTournamentQueueForJudge (tournamentId: string, judgeId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue?judgeId=${judgeId}`,
        method: 'GET'
      })
    ).data as CurrentQueueUIResponse | null
  }

  async function getTournamentQueue (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue`,
        method: 'GET'
      })
    ).data
  }

  async function setTournamentQueue (tournamentId: string, slotNumber: number) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue/${slotNumber}`,
        method: 'PUT'
      })
    ).data
  }

  async function getTournamentAthlete (tournamentId: string, id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/athletes/${id}`,
        method: 'GET'
      })
    ).data as TorunamentAthlete
  }

  async function listTournamentAthletes (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/athletes`,
        method: 'GET'
      })
    ).data as TorunamentAthlete[]
  }

  async function addTournamentAthlete (athlete: TorunamentAthlete) {
    const data = athlete
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${athlete.tournamentId}/athletes`,
        method: 'POST',
        data
      })
    ).data as TorunamentAthlete
  }

  async function getTournamentJudge (tournamentId: string, id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/judges/${id}`,
        method: 'GET'
      })
    ).data as TorunamentJudge
  }

  async function addTournamentJudge (judge: TorunamentJudge) {
    const data = judge
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${judge.tournamentId}/judges`,
        method: 'POST',
        data
      })
    ).data as TorunamentJudge
  }

  async function listTournamentJudges (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/judges`,
        method: 'GET'
      })
    ).data as TorunamentJudge[]
  }

  async function listLocations (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/locations`,
        method: 'GET'
      })
    ).data as Location[]
  }

  async function getLocation (tournamentId: string, id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/locations/${id}`,
        method: 'GET'
      })
    ).data as Location | null
  }

  async function addLocation (location: Location) {
    const data = location
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${location.tournamentId}/locations`,
        method: 'POST',
        data
      })
    ).data
  }

  async function modifyLocation (location: Location) {
    const data = location
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${location.tournamentId}/locations/${location.id}`,
        method: 'PUT',
        data
      })
    ).data
  }

  async function removeLocation (location: Location) {
    const data = location
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${location.tournamentId}/locations/${location.id}`,
        method: 'DELETE',
        data
      })
    ).data
  }

  async function addPerformer (performer: Performer) {
    const data = performer
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${performer.tournamentId}/performers`,
        method: 'POST',
        data
      })
    ).data
  }

  async function listPerformer (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performers`,
        method: 'GET'
      })
    ).data as Performer[]
  }

  async function getPerformer (tournamentId: string, id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performers/${id}`,
        method: 'GET'
      })
    ).data as Performer | null
  }

  async function addPerformance (performance: Performance) {
    const data = performance
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${performance.tournamentId}/performances`,
        method: 'POST',
        data
      })
    ).data
  }

  async function listPerformances (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performances`,
        method: 'GET'
      })
    ).data as Performance[]
  }

  async function getPerformance (tournamentId: string, id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performances/${id}`,
        method: 'GET'
      })
    ).data as Performance | null
  }

  async function disqualifyPerformance (tournamentId: string, performanceId: string, disqualified: boolean) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performances/${performanceId}/disqualified/${disqualified}`,
        method: 'PUT'
      })
    ).data as Performance | null
  }

  async function listTournamentPlan (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/plan`,
        method: 'GET'
      })
    ).data as TournamentPlanDetails[]
  }

  async function getCategory (id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/categories/${id}`,
        method: 'GET'
      })
    ).data as Category | null
  }

  async function listCategories () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/categories`,
        method: 'GET'
      })
    ).data as Category[]
  }

  async function getCriteria (id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/criteria/${id}`,
        method: 'GET'
      })
    ).data as Criteria | null
  }

  async function listCriteria (categoryId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/criteria?categoryId=${categoryId}`,
        method: 'GET'
      })
    ).data as Criteria[]
  }

  async function getJudgingRule (id: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/judging-rule/${id}`,
        method: 'GET'
      })
    ).data as JudgingRule | null
  }

  async function getJudgingRuleByCategoryId (categoryId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/judging-rule?categoryId=${categoryId}`,
        method: 'GET'
      })
    ).data as JudgingRule | null
  }

  async function addRawPoint (points: RawPoint) {
    const data = points
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/raw-points`,
        method: 'POST',
        data
      })
    ).data
  }

  async function getRawPointForJudge (performanceId: string, judgeId: string, criteriaId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/raw-points/judges`,
        method: 'GET',
        params: { performanceId, judgeId, criteriaId }
      })
    ).data
  }

  async function moveQueueForward (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue/next`,
        method: 'PUT'
      })
    ).data
  }

  async function moveQueueBackward (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/queue/back`,
        method: 'PUT'
      })
    ).data
  }

  async function getCategoryPoints (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/points`,
        method: 'GET'
      })
    ).data as CategoryPointDetails
  }

  async function getCategoryRanks (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/category-ranks`,
        method: 'GET'
      })
    ).data as ReportFormat
  }

  async function getCombinationRanks (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/combination-ranks`,
        method: 'GET'
      })
    ).data as ReportFormat
  }

  async function calculateAllPoints (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/points`,
        method: 'POST'
      })
    ).data
  }

  async function calculateAllCategoryRanks (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/category-ranks`,
        method: 'POST'
      })
    ).data
  }

  async function calculateAllCombinationRanks (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}/combination-ranks`,
        method: 'POST'
      })
    ).data
  }

  async function deleteAllCalculations (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/calculations/${tournamentId}`,
        method: 'DELETE'
      })
    ).data
  }

  return {
    serverBaseUrl,
    addClub,
    listClubs,
    getCurrentTournamentName,
    getTournamentQueue,
    setTournamentQueue,
    moveQueueForward,
    moveQueueBackward,
    addTournament,
    getTournament,
    getTournamentByName,
    listTournaments,
    getTournamentQueueForJudge,
    getLocation,
    listLocations,
    addLocation,
    modifyLocation,
    removeLocation,
    addTournamentAthlete,
    getTournamentAthlete,
    listTournamentAthletes,
    addTournamentJudge,
    getTournamentJudge,
    listTournamentJudges,
    addPerformer,
    getPerformer,
    listPerformer,
    addPerformance,
    getPerformance,
    listPerformances,
    disqualifyPerformance,
    listTournamentPlan,
    getCategory,
    listCategories,
    getCriteria,
    listCriteria,
    getJudgingRule,
    getJudgingRuleByCategoryId,
    addRawPoint,
    getRawPointForJudge,
    getCategoryPoints,
    getCategoryRanks,
    getCombinationRanks,
    calculateAllPoints,
    calculateAllCategoryRanks,
    calculateAllCombinationRanks,
    deleteAllCalculations
  }
}

export const ApiContext = createContext<Api>({} as Api)

export function getEnvVariables () {
  console.log('ENV', import.meta.env)
  const secure = import.meta.env.SHARED_SERVER_SECURE === 'true'
  const serverAddress = import.meta.env.SHARED_SERVER_ADDRESS || window.location.origin
  return { secure, serverAddress }
}
