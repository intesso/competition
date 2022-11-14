import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith, respondWithError } from '../lib/common'
import { RawPoint } from './interfaces'

export const judgingController = new Router()

judgingController
  .use(bodyParser())
  .post('/raw-points', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.addRawPoint(ctx.request.body as RawPoint))
  })
  .delete('/raw-points/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.removeRawPoint(ctx.params.id as string))
  })
  .delete('/raw-points/performance/:performanceId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.removeRawPoints(ctx.params.performanceId as string))
  })
  .get('/categories', inputValidation.validate, (ctx) => {
    if (ctx.query.categoryName) {
      return respondWith(ctx, () => applicationContext.judging.getCategoryByName(ctx.query.categoryName as string))
    }
    return respondWith(ctx, () => applicationContext.judging.listCategories())
  })
  .get('/categories/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getCategory(ctx.params.id as string))
  })
  .get('/criteria', inputValidation.validate, (ctx) => {
    if (typeof ctx.request.query.categoryId === 'string' && typeof ctx.request.query.criteriaName === 'string') {
      return respondWith(ctx, () =>
        applicationContext.judging.getCriteriaByCategoryIdAndName(ctx.request.query.categoryId as string, ctx.request.query.criteriaName as string)
      )
    }
    if (typeof ctx.request.query.categoryId === 'string') {
      return respondWith(ctx, () =>
        applicationContext.judging.listCriteriaByCategoryId(ctx.request.query.categoryId as string)
      )
    }
    return respondWithError(ctx, 'categoryId queryParameter must be provided')
  })
  .get('/criteria/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getCriteria(ctx.params.id as string))
  })
  .get('/combinations/:combinationId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () =>
      applicationContext.judging.listWeightedCombination(ctx.params.combinationId as string)
    )
  })
  .get('/combinations', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.listWeightedCombinations())
  })
  .get('/judging-rule/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getJudgingRule(ctx.params.id as string))
  })
  .get('/judging-rule', inputValidation.validate, (ctx) => {
    if (typeof ctx.request.query.categoryId !== 'string') {
      return respondWithError(ctx, 'categoryId queryParameter must be provided')
    }
    return respondWith(ctx, () =>
      applicationContext.judging.getJudgingRuleByCategoryId(ctx.request.query.categoryId as string)
    )
  })
