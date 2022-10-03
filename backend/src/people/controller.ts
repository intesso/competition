import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { Club } from './interfaces'

export const peopleController = new Router()

peopleController
  .use(bodyParser())
  .post('/club', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.people.addClub(ctx.request.body as Club))
  })
