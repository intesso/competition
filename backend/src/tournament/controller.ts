import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { Athlete, Judge } from '../people/interfaces'
import { Tournament } from './interfaces'

export const tournamentController = new Router()

tournamentController
  .use(bodyParser())
  .post('/athlete', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentAthlete(ctx.request.body as Athlete))
  })
  .post('/judge', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentJudge(ctx.request.body as Judge))
  })
  .post('/tournament', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournament(ctx.request.body as Tournament))
  })
