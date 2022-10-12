import axios from 'axios'
import { createContext } from 'react'
import { Category, Club, Criteria, JudgingRule, Location, Performance, RawPoint, TorunamentAthlete, TorunamentJudge, Tournament, TournamentPerson } from './ApiContextInterface'

export interface Api {
  serverBaseUrl: string
  // person
  addClub: (club: Club) => Promise<void>
  listClubs: () => Promise<Club[]>
  // tournament
  listTournaments: () => Promise<Tournament[]>
  addTournament: (tournament: Tournament) => Promise<void>
  getTournament: (id: string) => Promise<Tournament | null>
  addTournamentAthlete: (person: TournamentPerson) => Promise<TournamentPerson>
  getTournamentAthlete: (tournamentId: string, id: string) => Promise<TournamentPerson | null>
  addTournamentJudge: (person: TournamentPerson) => Promise<TournamentPerson>
  getTournamentJudge: (tournamentId: string, id: string) => Promise<TournamentPerson | null>
  listTournamentJudges: (tournamentId: string) => Promise<TournamentPerson[]>
  addPerformance: (performance: Performance) => Promise<Performance>
  getPerformance: (tournamentId: string, id: string) => Promise<Performance | null>
  listPerformances: (tournamentId: string) => Promise<Performance[]>
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

  async function listTournaments () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments`,
        method: 'GET'
      })
    ).data as Tournament[]
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

  async function addPerformance (performance: Performance) {
    const data = performance
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${performance.tournamentId}/performances/`,
        method: 'POST',
        data
      })
    ).data
  }

  async function listPerformances (tournamentId: string) {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments/${tournamentId}/performances/`,
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

  return {
    serverBaseUrl,
    addClub,
    listClubs,
    addTournament,
    getTournament,
    listTournaments,
    listLocations,
    addLocation,
    modifyLocation,
    removeLocation,
    addTournamentAthlete,
    getTournamentAthlete,
    addTournamentJudge,
    getTournamentJudge,
    listTournamentJudges,
    addPerformance,
    getPerformance,
    listPerformances,
    getCategory,
    listCategories,
    getCriteria,
    listCriteria,
    getJudgingRule,
    getJudgingRuleByCategoryId,
    addRawPoint
  }
}

export const ApiContext = createContext<Api>({} as Api)

export function getEnvVariables () {
  console.log('ENV', import.meta.env)
  const secure = import.meta.env.SHARED_SERVER_SECURE === 'true'
  const serverAddress = import.meta.env.SHARED_SERVER_ADDRESS

  return { secure, serverAddress }
}
