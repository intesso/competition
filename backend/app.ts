import Koa from 'koa'
import send from 'koa-send'
import serve from 'koa-static'
import { resolve } from 'path'
import Router from 'koa-router'
import cors from '@koa/cors'
import './applicationContext'
import { inputValidation } from './api/inputValidation'
import { calculationController } from './src/calculation/controller'
import { judgingController } from './src/judging/controller'
import { peopleController } from './src/people/controller'
import { tournamentController } from './src/tournament/controller'
import { getBodyParser } from './src/lib/common'

const router = new Router()
  .use('/api/people', peopleController.routes())
  .use('/api/tournaments', tournamentController.routes())
  .use('/api/judging', judgingController.routes())
  .use('/api/calculations', calculationController.routes())

export const app = new Koa()

// frontend spa production build
const staticRoot = resolve(__dirname, '../frontend/dist')
app
  .use(serve(staticRoot))
  .use(async (ctx, next) => send(ctx, '/index.html', { root: staticRoot }).then(() => next()))

// backend api routes
app
  .use(getBodyParser())
  .use(cors())
  .use(async (ctx, next) => {
    try {
      return await next()
    } catch (err) {
      if (err instanceof inputValidation.InputValidationError) {
        ctx.status = 400
        ctx.body = err.errors
      }
      throw err
    }
  })
  .use(router.routes())

process.on('uncaughtException', function (err) {
  console.log(err)
})
