import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { Location, Performance, Performer, TournamentAndAddress, TournamentAthlete, TournamentJudge } from './interfaces'

export const tournamentController = new Router()

tournamentController
  .use(bodyParser())
  .post('/:tournamentId/athletes', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentAthlete(ctx.request.body as TournamentAthlete))
  })
  .get('/:tournamentId/athletes/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournamentJudge(ctx.params.id as string))
  })
  .post('/:tournamentId/performer', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addPerformer(ctx.request.body as Performer))
  })
  .get('/:tournamentId/performer/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getPerformer(ctx.params.id as string))
  })
  .get('/:tournamentId/performer', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listPerformer(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/judges', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentJudge(ctx.request.body as TournamentJudge))
  })
  .get('/:tournamentId/judges', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listTournamentJudges(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId/judges/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournamentJudge(ctx.params.id as string))
  })
  .get('/:tournamentId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournament(ctx.params.tournamentId as string))
  })
  .post('/', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournament(ctx.request.body as TournamentAndAddress))
  })
  .get('/', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listTournaments())
  })
  .post('/:tournamentId/locations', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addLocation(ctx.request.body as unknown as Location))
  })
  .put('/:tournamentId/locations/:locationId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.modifyLocation(ctx.request.body as unknown as Location))
  })
  .delete('/:tournamentId/locations/:locationId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.removeLocation(ctx.request.body as unknown as Location))
  })
  .get('/:tournamentId/locations', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listLocations(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/performances', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addPerformance(ctx.request.body as unknown as Performance))
  })
  .get('/:tournamentId/performances', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listPerformances(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId/performances/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getPerformance(ctx.params.id as string))
  })
