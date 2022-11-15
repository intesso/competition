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
  .get('/:tournamentId/category-ranks/:categoryId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getCategoryRanks(ctx.params.tournamentId as string, ctx.params.categoryId as string))
  })
  .get('/:tournamentId/category-ranks/:categoryId/details', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getCategoryRanksDetailed(ctx.params.tournamentId as string, ctx.params.categoryId as string))
  })
  .post('/:tournamentId/category-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllCategoryRanks(ctx.params.tournamentId))
  })
  .get('/:tournamentId/category-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getAllCategoryRanksDetailed(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/combination-ranks/:combinationId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateCombinationRanks({ tournamentId: ctx.params.tournamentId, combinationId: ctx.params.combinationId }))
  })
  .get('/:tournamentId/combination-ranks/:combinationId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getCombinationRanks(ctx.params.tournamentId as string, ctx.params.combinationId as string))
  })
  .post('/:tournamentId/combination-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllCombinationRanks(ctx.params.tournamentId))
  })
