import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { CalculationCategoryRanksInput, CalculationPointsInput } from './interfaces'
import { respondWith } from '../lib/common'

export const calculationController = new Router()

calculationController.use(bodyParser())

calculationController
  .post('/:tournamentId/points/:performanceId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculatePoints(ctx.request.body as unknown as CalculationPointsInput))
  })
  .get('/:tournamentId/points/:performanceId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getPoints(ctx.params.performanceId as string))
  })
  .post('/:tournamentId/points', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllPoints(ctx.params.tournamentId))
  })
  .post('/:tournamentId/category-ranks/:categoryId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateCategoryRanks(ctx.request.body as unknown as CalculationCategoryRanksInput))
  })
  .post('/:tournamentId/category-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllCategoryRanks(ctx.params.tournamentId))
  })
  .post('/:tournamentId/combination-ranks/:combinationId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateCombinationRanks({ tournamentId: ctx.params.tournamentId, combinationId: ctx.params.combinationId }))
  })
  .post('/:tournamentId/combination-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllCombinationRanks(ctx.params.tournamentId))
  })
