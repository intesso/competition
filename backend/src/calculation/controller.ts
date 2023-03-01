import Router from 'koa-router'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { CalculationCategoryRanksInput, CalculationPointsInput } from './interfaces'
import { getBodyParser, respondWith } from '../lib/common'

export const calculationController = new Router()

calculationController.use(getBodyParser())

calculationController
  .post('/:tournamentId/points/:performanceId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculatePoints(ctx.request.body as unknown as CalculationPointsInput))
  })
  .get('/:tournamentId/points/:performanceId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getPoints(ctx.params.performanceId as string))
  })
  .delete('/:tournamentId/points/:performanceId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.removeCalculation(ctx.params.performanceId as string))
  })
  .delete('/:tournamentId', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.removeAllCalculations(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/points', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.calculateAllPoints(ctx.params.tournamentId))
  })
  .get('/:tournamentId/points', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getAllCategoryPointsDetailed(ctx.params.tournamentId))
  })
  .post('/:tournamentId/category-ranks/reports', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.generateCategoryRanksReport(ctx.params.tournamentId))
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
  .post('/:tournamentId/combination-ranks/reports', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.generateCombinationRanksReport(ctx.params.tournamentId))
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
  .get('/:tournamentId/combination-ranks', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.calculation.getAllCombinationRanks(ctx.params.tournamentId as string))
  })
