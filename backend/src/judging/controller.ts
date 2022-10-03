import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { RawPoint } from './interfaces'

export const judgingController = new Router()

judgingController.use(bodyParser())
judgingController.post('/raw-points', inputValidation.validate, (ctx) => {
  return respondWith(ctx, () => applicationContext.judging.addRawPoint(ctx.request.body as RawPoint))
})
