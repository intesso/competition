import axios from 'axios'
import { createContext } from 'react'
import { RawPoints } from './ApiContextInterface'

export interface Api {
  serverBaseUrl: string
  sendRawPoints: (points: RawPoints) => Promise<void>
}

export function provideApiContext (): Api {
  const { serverAddress } = getEnvVariables()
  const serverBaseUrl = serverAddress

  const headers = {}

  // API REST call methods
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

  return {
    serverBaseUrl,
    sendRawPoints
  }
}

export const ApiContext = createContext<Api>({} as Api)

export function getEnvVariables () {
  console.log('ENV', import.meta.env)
  const secure = import.meta.env.SHARED_SERVER_SECURE === 'true'
  const serverAddress = import.meta.env.SHARED_SERVER_ADDRESS

  return { secure, serverAddress }
}
