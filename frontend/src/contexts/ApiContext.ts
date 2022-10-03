import axios from 'axios'
import { createContext } from 'react'
import { Club, Person, RawPoints, Tournament } from './ApiContextInterface'

export interface Api {
  serverBaseUrl: string
  addClub: (club: Club) => Promise<void>
  addTournament: (tournament: Tournament) => Promise<void>
  sendRawPoints: (points: RawPoints) => Promise<void>
  addTournamentAthlete: (person: Person) => Promise<void>
  addTournamentJudge: (person: Person) => Promise<void>
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
        url: `${serverBaseUrl}/api/people/club`,
        method: 'POST',
        data
      })
    ).data
  }

  async function addTournament (tournament: Tournament) {
    const data = tournament
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournament/tournament`,
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

  async function addTournamentAthlete (person: Person) {
    const data = person
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournament/athlete`,
        method: 'POST',
        data
      })
    ).data
  }

  async function addTournamentJudge (person: Person) {
    const data = person
    return (
      await axios({
        headers,
        url: `${serverBaseUrl}/api/tournament/judge`,
        method: 'POST',
        data
      })
    ).data
  }

  return {
    serverBaseUrl,
    addClub,
    addTournament,
    sendRawPoints,
    addTournamentAthlete,
    addTournamentJudge
  }
}

export const ApiContext = createContext<Api>({} as Api)

export function getEnvVariables () {
  console.log('ENV', import.meta.env)
  const secure = import.meta.env.SHARED_SERVER_SECURE === 'true'
  const serverAddress = import.meta.env.SHARED_SERVER_ADDRESS

  return { secure, serverAddress }
}
