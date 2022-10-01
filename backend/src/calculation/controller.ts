import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'

export const calculationController = new Router()

calculationController.use(bodyParser())

calculationController.post('', inputValidation.validate, async (ctx) => {
  const output = await applicationContext.calculation.calculate(ctx.request.body)
  ctx.body(output)
})
