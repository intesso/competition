import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { Athlete, Judge } from '../people/interfaces'

export const tournamentController = new Router()

tournamentController
  .use(bodyParser())
  .post('/athlete', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentAthlete(ctx.request.body as Athlete))
  })
  .post('/judge', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentJudge(ctx.request.body as Judge))
  })
