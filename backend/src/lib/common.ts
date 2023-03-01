import { AxiosError } from 'axios'
import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { v4 as uuidv4 } from 'uuid'

import { spawn, SpawnOptionsWithoutStdio } from 'child_process'

export type Id = {id: string}

export const dateTimeFormat = 'yyyy-MM-dd hh:mm'

export function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface InsertRecordAttributes {
  id: string | null
  createdAt?: (Date) | null
  createdBy?: (string) | null
  updatedAt?: (Date) | null
  updatedBy?: (string) | null
}

export function recordAttributes <T extends InsertRecordAttributes> (r :T) {
  if (r.id) {
    return {
      ...r,
      id: r.id,
      createdAt: r.createdAt === undefined ? null : r.createdAt,
      createdBy: r.createdBy === undefined ? null : r.createdBy,
      updatedAt: new Date(),
      updatedBy: r.updatedBy === undefined ? null : r.updatedBy
    }
  }
  return {
    ...r,
    id: uuidv4(),
    createdAt: new Date(),
    createdBy: r.createdBy === undefined ? null : r.createdBy,
    updatedAt: null,
    updatedBy: r.updatedBy === undefined ? null : r.updatedBy

  }
}

export function newRecordAttributes () {
  return { id: uuidv4(), createdAt: new Date() }
}

export function updateRecordAttributes () {
  return { updatedAt: new Date() }
}

export function isDefined<T> (argument: T | undefined): argument is T {
  return argument !== undefined
}

export function isNotNull<T> (argument: T | null): argument is T {
  return argument !== null
}

export function getBodyParser () {
  return bodyParser({
    jsonLimit: '5mb'
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export async function respondWith<T> (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>, fn: () => T) {
  try {
    const response = await fn()
    ctx.body = response
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data)
      ctx.body = { error: error.response?.data }
    } else {
      console.error(error)
      ctx.body = { error }
    }
    ctx.status = 400
  }
  return ctx
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export async function respondWithError (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>, error: string) {
  ctx.status = 400
  ctx.body = { error }
  return ctx
}

export const spawnAsync = async (
  command: string,
  options?: SpawnOptionsWithoutStdio
) =>
  new Promise<Buffer>((resolve, reject) => {
    const [spawnCommand, ...args] = command.split(/\s+/)
    const spawnProcess = spawn(spawnCommand, args, options)
    const chunks: Buffer[] = []
    const errorChunks: Buffer[] = []
    spawnProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString())
      chunks.push(data)
    })
    spawnProcess.stderr.on('data', (data) => {
      process.stderr.write(data.toString())
      errorChunks.push(data)
    })
    spawnProcess.on('error', (error) => {
      reject(error)
    })
    spawnProcess.on('close', (code) => {
      if (code === 1) {
        reject(Buffer.concat(errorChunks).toString())
        return
      }
      resolve(Buffer.concat(chunks))
    })
  })

export function equalFloat (a: number | null | undefined, b: number | null | undefined, precision = 2) {
  // both "nullish"
  if (a === undefined && b === undefined) return true
  if (a === null && b === null) return true
  // one "nullish"
  if (a === null || b === null) return false
  if (a === undefined || b === undefined) return false
  // equal within precision
  if (a === b) return true
  if (a.toFixed(precision) === b.toFixed(precision)) return true
  // unequal
  return false
}
