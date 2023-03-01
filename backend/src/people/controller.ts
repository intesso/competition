import Router from 'koa-router'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { getBodyParser, respondWith } from '../lib/common'
import { ClubWithAddress } from './interfaces'

export const peopleController = new Router()

peopleController
  .use(getBodyParser())
  .post('/clubs', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.people.addClubWithAddress(ctx.request.body as ClubWithAddress))
  })
  .get('/clubs/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.people.getClubById(ctx.params.id))
  })
  .get('/clubs', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.people.listClubs())
  })
