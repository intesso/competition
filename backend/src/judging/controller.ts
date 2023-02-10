import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith, respondWithError } from '../lib/common'
import { RawPoint } from './interfaces'

export const judgingController = new Router()

judgingController
  .use(bodyParser())
  .post('/raw-points/import', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.importRawPoints(ctx.request.body as unknown as RawPoint[]))
  })
  .post('/raw-points', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.addRawPoint(ctx.request.body as RawPoint))
  })
  .get('/raw-points/judges', inputValidation.validate, (ctx) => {
    if (typeof ctx.query.performanceId !== 'string') {
      return respondWithError(ctx, 'performanceId queryParameter must be provided')
    }
    if (typeof ctx.query.judgeId !== 'string') {
      return respondWithError(ctx, 'judgeId queryParameter must be provided')
    }
    if (typeof ctx.query.criteriaId !== 'string') {
      return respondWithError(ctx, 'criteriaId queryParameter must be provided')
    }
    return respondWith(ctx, () => applicationContext.judging.getRawPointForJudge(ctx.query.performanceId as string, ctx.query.judgeId as string, ctx.query.criteriaId as string))
  })
  .get('/raw-points/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getRawPoint(ctx.params.id as string))
  })
  .get('/raw-points', inputValidation.validate, (ctx) => {
    if (typeof ctx.query.performanceId !== 'string') {
      return respondWithError(ctx, 'performanceId queryParameter must be provided')
    }
    return respondWith(ctx, () => applicationContext.judging.listRawPoints(ctx.query.performanceId as string))
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
    if (typeof ctx.query.categoryId === 'string' && typeof ctx.query.criteriaName === 'string') {
      return respondWith(ctx, () =>
        applicationContext.judging.getCriteriaByCategoryIdAndName(ctx.query.categoryId as string, ctx.query.criteriaName as string)
      )
    }
    if (typeof ctx.query.categoryId === 'string') {
      return respondWith(ctx, () =>
        applicationContext.judging.listCriteriaByCategoryId(ctx.query.categoryId as string)
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
    if (typeof ctx.query.categoryId !== 'string') {
      return respondWithError(ctx, 'categoryId queryParameter must be provided')
    }
    return respondWith(ctx, () =>
      applicationContext.judging.getJudgingRuleByCategoryId(ctx.query.categoryId as string)
    )
  })
