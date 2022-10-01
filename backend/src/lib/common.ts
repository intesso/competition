import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import { v4 as uuidv4 } from 'uuid'

export type Id = {id: string}

export const dateTimeFormat = 'yyyy-MM-dd hh:mm'

export function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function newRecordAttributes () {
  return { id: uuidv4(), createdAt: new Date() }
}

export function isDefined<T> (argument: T | undefined): argument is T {
  return argument !== undefined
}

export function isNotNull<T> (argument: T | null): argument is T {
  return argument !== null
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export async function respondWith<T> (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>, fn: () => T) {
  try {
    const response = await fn()
    ctx.body = response
  } catch (error) {
    ctx.status = 400
    ctx.body = { error }
  }
  return ctx
}
