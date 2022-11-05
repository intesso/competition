import { AxiosError } from 'axios'
import { toLower, upperFirst } from 'lodash'

export function snakeToPascal (text: string) {
  return text.split('-').map(str => upperFirst(toLower(str))).join(' ')
}

// eslint-disable-next-line n/handle-callback-err, @typescript-eslint/no-explicit-any
export function parseError (err: any) {
  if (err instanceof AxiosError) {
    const data = err.response?.data
    if (!data) return err.message
    // postgres error
    if (data?.error?.detail) return data?.error?.detail
  }
  return err.message
}
