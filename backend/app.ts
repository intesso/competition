import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from './api/inputValidation'
import { calculationController } from './src/calculation/controller'

export const app = new Koa()
app.use(bodyParser())
app.use(cors())

const router = new Router()

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'Hello Koa'
})

router.get('/pets', inputValidation.validate, async (ctx) => {
  ctx.status = 200
  ctx.body = { result: 'OK' }
})

app.use(async (ctx, next) => {
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

app.use(router.routes())
app.use(calculationController.routes())
