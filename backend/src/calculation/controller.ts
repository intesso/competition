import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { CalculationCategoryRanksInput, CalculationCombinationRanksInput, CalculationPointsInput } from './interfaces'
import { respondWith } from '../lib/common'

export const calculationController = new Router()

calculationController.use(bodyParser())

calculationController
  .post('/points', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculatePoints(ctx.request.body as unknown as CalculationPointsInput))
  })
  .post('/category-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateCategoryRanks(ctx.request.body as unknown as CalculationCategoryRanksInput))
  })
  .post('/combination-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateCombinationRanks(ctx.request.body as unknown as CalculationCombinationRanksInput))
  })
