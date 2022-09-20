import { v4 as uuidv4 } from 'uuid'

export type Id = {id: string}

export function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function newRecordAttributes () {
  return { id: uuidv4(), createdAt: new Date() }
}
