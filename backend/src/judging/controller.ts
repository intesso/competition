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
  .get('/categories', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.listCategories())
  })
  .get('/categories/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getCategory(ctx.params.id as string))
  })
  .get('/criteria', inputValidation.validate, (ctx) => {
    if (typeof ctx.request.query.categoryId !== 'string') {
      return respondWithError(ctx, 'categoryId queryParameter must be provided')
    }
    return respondWith(ctx, () => applicationContext.judging.listCriteria(ctx.request.query.categoryId as string))
  })
  .get('/criteria/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getCriteria(ctx.params.id as string))
  })
  .get('/judging-rule/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.judging.getJudgingRule(ctx.params.id as string))
  })
  .get('/judging-rule', inputValidation.validate, (ctx) => {
    if (typeof ctx.request.query.categoryId !== 'string') {
      return respondWithError(ctx, 'categoryId queryParameter must be provided')
    }
    return respondWith(ctx, () => applicationContext.judging.getJudgingRuleByCategoryId(ctx.request.query.categoryId as string))
  })
