import { AxiosError } from 'axios'
import { toLower, upperFirst } from 'lodash'

export function snakeToPascal (text: string) {
  return text.split('-').map(str => upperFirst(toLower(str))).join(' ')
}

export function dedupe (text: string) {
  let memo = ''
  return text.split(' ').filter(it => {
    const keep = it !== memo
    memo = it
    return keep
  }).join(' ')
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

export function getPageName (page: string) {
  const segments = page.split('/')
  return segments[segments.length - 1].replace(/-/g, ' ')
}
