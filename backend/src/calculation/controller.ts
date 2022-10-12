import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { CalculationInput } from './interfaces'

export const calculationController = new Router()

calculationController.use(bodyParser())

calculationController.post('/', inputValidation.validate, async (ctx) => {
  const output = await applicationContext.calculation.calculate(ctx.request.body as unknown as CalculationInput)
  ctx.body(output)
})
