import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { calculate } from './service'
import { inputValidation } from '../../api/inputValidation'

export const calculationController = new Router()

calculationController.use(bodyParser())

calculationController.post('/calculations', inputValidation.validate, async (ctx) => {
  const output = await calculate(ctx.request.body)
  ctx.body(output)
})
