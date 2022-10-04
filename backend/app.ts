import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import './applicationContext'
import { inputValidation } from './api/inputValidation'
import { calculationController } from './src/calculation/controller'
import { judgingController } from './src/judging/controller'
import { peopleController } from './src/people/controller'
import { tournamentController } from './src/tournament/controller'

const router = new Router()
  .use('/api/people', peopleController.routes())
  .use('/api/tournaments', tournamentController.routes())
  .use('/api/judging', judgingController.routes())
  .use('/api/calculations', calculationController.routes())

export const app = new Koa()

app.use(bodyParser())
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
