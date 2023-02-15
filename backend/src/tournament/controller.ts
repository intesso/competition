import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { inputValidation } from '../../api/inputValidation'
import { applicationContext } from '../../applicationContext'
import { respondWith } from '../lib/common'
import { Location, Performance, Performer, TournamentAndAddress, TournamentAthlete, TournamentJudge, TournamentPlan } from './interfaces'

export const tournamentController = new Router()

tournamentController
  .use(bodyParser())
  .use('/current', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => ({ tournamentName: process.env.CURRENT_TOURNAMENT }))
  })
  .post('/plan', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.planTournament(ctx.request.body as unknown as TournamentPlan[]))
  })
  .get('/:tournamentId/plan', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournamentPlan(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId/queue', inputValidation.validate, (ctx) => {
    if (ctx.query.judgeId) {
      return respondWith(ctx, () => applicationContext.tournament.getCurrentTournamentQueueForJudge(ctx.params.tournamentId, ctx.query.judgeId as string))
    }
    return respondWith(ctx, () => applicationContext.tournament.getCurrentTournamentQueue(ctx.params.tournamentId))
  })
  .delete('/:tournamentId/queue/DANGER', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.removeTournamentQueueForTournamentDANGER(ctx.params.tournamentId))
  })
  .put('/:tournamentId/queue/next', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.moveTournamentQueueToNextSlot(ctx.params.tournamentId as string))
  })
  .put('/:tournamentId/queue/back', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.moveTournamentQueueToPreviousSlot(ctx.params.tournamentId as string))
  })
  .put('/:tournamentId/queue/:slotNumber', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.setTournamentQueueSlot(ctx.params.tournamentId as string, parseInt(ctx.params.slotNumber)))
  })
  .post('/:tournamentId/athletes', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentAthlete(ctx.request.body as TournamentAthlete))
  })
  .get('/:tournamentId/athletes/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournamentAthlete(ctx.params.id as string))
  })
  .get('/:tournamentId/athletes', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listTournamentAthletes(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/performers', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addPerformer(ctx.request.body as Performer))
  })
  .get('/:tournamentId/performers/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getPerformer(ctx.params.id as string))
  })
  .get('/:tournamentId/performers', inputValidation.validate, (ctx) => {
    if (ctx.query.performerName) {
      return respondWith(ctx, () => applicationContext.tournament.getPerformerByName(ctx.params.tournamentId as string, ctx.params.id as string))
    }
    return respondWith(ctx, () => applicationContext.tournament.listPerformer(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/judges', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournamentJudge(ctx.request.body as TournamentJudge))
  })
  .get('/:tournamentId/judges/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournamentJudge(ctx.params.id as string))
  })
  .get('/:tournamentId/judges', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listTournamentJudges(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getTournament(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId/categories', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listTournamentCategories(ctx.params.tournamentId as string))
  })
  .post('/', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addTournament(ctx.request.body as TournamentAndAddress))
  })
  .get('/', inputValidation.validate, (ctx) => {
    if (ctx.query.tournamentName) {
      return respondWith(ctx, () => applicationContext.tournament.getTournamentByName(ctx.query.tournamentName as string))
    }
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
  .get('/:tournamentId/locations/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getLocation(ctx.params.id as string))
  })
  .get('/:tournamentId/locations', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.listLocations(ctx.params.tournamentId as string))
  })
  .post('/:tournamentId/performances', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.addPerformance(ctx.request.body as unknown as Performance))
  })
  .get('/:tournamentId/performances', inputValidation.validate, (ctx) => {
    if (ctx.query.performanceName) {
      return respondWith(ctx, () => applicationContext.tournament.getPerformanceByName(ctx.params.tournamentId as string, ctx.query.performanceName as string))
    }
    return respondWith(ctx, () => applicationContext.tournament.listPerformances(ctx.params.tournamentId as string))
  })
  .get('/:tournamentId/performances/:id', inputValidation.validate, (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.getPerformance(ctx.params.id as string))
  })
  .put('/:tournamentId/performances/:id/disqualified/:disqualified', inputValidation.validate, (ctx) => {
    const disqualified = ctx.params.disqualified.toLowerCase() === 'true'
    return respondWith(ctx, () => applicationContext.tournament.disqualifyPerformance(ctx.params.id as string, disqualified))
  })
  .delete('/:tournamentId/performances/:id/points', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.removePointsForPerformance(ctx.params.id as string))
  })
  .delete('/:tournamentId/points/DANGER', inputValidation.validate, async (ctx) => {
    return respondWith(ctx, () => applicationContext.tournament.removePointsForTournamentDANGER(ctx.params.tournamentId as string))
  })
