import axios from 'axios'
import { createContext } from 'react'
import { Category, Club, Location, Performance, RawPoints, TorunamentAthlete, TorunamentJudge, Tournament, TournamentPerson } from './ApiContextInterface'

export interface Api {
  serverBaseUrl: string
  addClub: (club: Club) => Promise<void>
  listClubs: () => Promise<Club[]>
  listTournaments: () => Promise<Tournament[]>
  listLocations: (tournamentName: string) => Promise<Location[]>
  listCategories: () => Promise<Category[]>
  addLocation: (location: Location) => Promise<Location>
  modifyLocation: (location: Location) => Promise<Location>
  removeLocation: (location: Location) => Promise<void>
  addTournament: (tournament: Tournament) => Promise<void>
  sendRawPoints: (points: RawPoints) => Promise<void>
  addTournamentAthlete: (person: TournamentPerson) => Promise<TournamentPerson>
  addTournamentJudge: (person: TournamentPerson) => Promise<TournamentPerson>
  addPerformance: (performance: Performance) => Promise<Performance>
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

  async function listTournaments () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournaments`,
        method: 'GET'
      })
    ).data as Tournament[]
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

  async function sendRawPoints (points: RawPoints) {
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

  async function listCategories () {
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/judging/categories`,
        method: 'GET'
      })
    ).data as Category[]
  }

  return {
    serverBaseUrl,
    addClub,
    listClubs,
    addTournament,
    listTournaments,
    listLocations,
    addLocation,
    modifyLocation,
    removeLocation,
    addTournamentAthlete,
    addTournamentJudge,
    addPerformance,
    sendRawPoints,
    listCategories
  }
}

export const ApiContext = createContext<Api>({} as Api)

export function getEnvVariables () {
  console.log('ENV', import.meta.env)
  const secure = import.meta.env.SHARED_SERVER_SECURE === 'true'
  const serverAddress = import.meta.env.SHARED_SERVER_ADDRESS

  return { secure, serverAddress }
}
