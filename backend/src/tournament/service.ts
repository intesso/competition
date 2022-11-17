import _ from 'lodash'
import { IGetApplicationContext } from '../../applicationContext'
import { Id, newRecordAttributes } from '../lib/common'
import { TournamentQueue } from '../lib/db/__generated__'
// TODO only access other modules via service (use applicationContext)
import { insertAddress, insertAthlete, insertJudge, insertPerson } from '../people/repository'
import {
  Location,
  Performance,
  Slot,
  TournamentAndAddress,
  ITournamentContext,
  Tournament,
  TournamentAthlete,
  TournamentJudge,
  Performer,
  TournamentPlan,
  TournamentPlanDetails,
  PerformanceJudge,
  CurrentQueueUIResponse,
  QueueRun
} from './interfaces'
import {
  deleteLocation,
  findAllTournaments,
  findAllTournamentSlots,
  findLocationsByTournamentId,
  findPerformances,
  findPerformer,
  findTournamentAthletesAndPerson,
  findTournamentByTournamentName,
  findTournamentJudgesAndPerson,
  findTournamentPlan,
  getDistinctTorunamentCategories,
  getLocationById,
  getPerformance,
  getPerformanceById,
  getPerformerById,
  getPerformerByName,
  getTournamentAthleteAndPerson,
  getTournamentById,
  getTournamentByName,
  getTournamentJudgeAndPerson,
  getTournamentQueueByTournamentId,
  insertLocation,
  insertOrUpdateLocation,
  insertOrUpdatePerformance,
  insertOrUpdatePerformer,
  insertOrUpdateSlot,
  insertOrUpdateTournamentQueue,
  insertPerformance,
  insertPerformer,
  insertSlot,
  insertTournament,
  insertTournamentAthlete,
  insertTournamentJudge,
  updateLocation,
  updatePerformance
} from './repository'

export class TournamentService implements ITournamentContext {
  getApplicationContext
  constructor (getApplicationContext: IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async listTournaments (): Promise<(Tournament & Id)[]> {
    const tournaments = await findAllTournaments()
    return tournaments
  }

  async getTournament (id: string): Promise<(Tournament & Id) | null> {
    return await getTournamentById(id)
  }

  async listTournamentCategories (tournamentId: string): Promise<string[]> {
    return await getDistinctTorunamentCategories(tournamentId)
  }

  async getTournamentByName (tournamentName: string): Promise<(Tournament & Id) | null> {
    return await getTournamentByName(tournamentName)
  }

  async listSlots (tournamentId: string): Promise<Slot[]> {
    const slots = await findAllTournamentSlots(tournamentId)
    return slots
  }

  async addTournament (t: TournamentAndAddress): Promise<TournamentAndAddress & Id> {
    const address = await insertAddress({
      street: t.street,
      houseNumber: t.houseNumber,
      zipCode: t.zipCode,
      city: t.city,
      country: t.country
    })

    const tournament = await insertTournament({
      addressId: address.id,
      tournamentName: t.tournamentName,
      competition: t.competition,
      tournamentStartTime: t.tournamentStartTime,
      tournamentEndTime: t.tournamentEndTime
    })
    return { ...t, id: tournament.id }
  }

  async addSlot (s: Slot): Promise<Slot | null> {
    const insertedSlot = await insertSlot(s)
    return insertedSlot
  }

  async addLocation (l: Omit<Location, 'id'>): Promise<Location | null> {
    const location = await insertLocation(l)
    return { ...l, id: location.id }
  }

  async modifyLocation (l: Location & Id): Promise<Location | null> {
    return await updateLocation(l)
  }

  async removeLocation (l: Location & Id): Promise<void> {
    return await deleteLocation(l)
  }

  async listLocations (tournamentId: string): Promise<Location[]> {
    const locations = await findLocationsByTournamentId(tournamentId)
    return locations
  }

  async getLocation (id: string): Promise<Location | null> {
    const locations = await getLocationById(id)
    return locations
  }

  async addPerformer (p: Performer): Promise<(Performer & Id) | null> {
    const performance = await insertPerformer({
      ...p,
      ...newRecordAttributes()
    })
    return { ...p, id: performance.id }
  }

  async getPerformer (id: string): Promise<(Performer & Id) | null> {
    return await getPerformerById(id)
  }

  async getPerformerByName (tournamentId: string, performerName: string): Promise<(Performer & Id) | null> {
    return await getPerformerByName(tournamentId, performerName)
  }

  async listPerformer (tournamentId: string): Promise<(Performer & Id)[]> {
    return await findPerformer({ tournamentId })
  }

  async addPerformance (p: Performance): Promise<(Performance & Id) | null> {
    const performance = await insertPerformance({
      ...p,
      ...newRecordAttributes()
    })

    return { ...p, id: performance.id }
  }

  async listPerformances (tournamentId: string): Promise<(Performance & Id)[]> {
    return await findPerformances({ tournamentId })
  }

  async getPerformance (id: string): Promise<(Performance & Id) | null> {
    return await getPerformanceById(id)
  }

  async getPerformanceByName (tournamentId: string, performanceName: string): Promise<(Performance & Id) | null> {
    return await getPerformance(tournamentId, performanceName)
  }

  async addTournamentAthlete (a: TournamentAthlete): Promise<TournamentAthlete> {
    const person = await insertPerson(a)
    const athlete = await insertAthlete({ personId: person.id })
    const tournamentAthlete = await insertTournamentAthlete({ tournamentId: a.tournamentId, athleteId: athlete.id })
    return { ...a, ...tournamentAthlete }
  }

  async getTournamentAthlete (id: string): Promise<(TournamentAthlete & Id) | null> {
    return await getTournamentAthleteAndPerson(id)
  }

  async listTournamentAthletes (tournamentId: string): Promise<TournamentJudge[]> {
    return await findTournamentAthletesAndPerson(tournamentId)
  }

  async addTournamentJudge (j: TournamentJudge): Promise<TournamentJudge> {
    const person = await insertPerson(j)
    const judge = await insertJudge({ personId: person.id })
    const tournamentJudge = await insertTournamentJudge({ tournamentId: j.tournamentId, judgeId: judge.id })
    return { ...j, ...tournamentJudge }
  }

  async getTournamentJudge (id: string): Promise<(TournamentJudge & Id) | null> {
    return await getTournamentJudgeAndPerson(id)
  }

  async listTournamentJudges (tournamentId: string): Promise<TournamentJudge[]> {
    return await findTournamentJudgesAndPerson(tournamentId)
  }

  async planTournament (tournamentPlan: TournamentPlan[]): Promise<TournamentPlan[] | null> {
    const groupedByPerformance = _(tournamentPlan)
      .groupBy('performanceName')
      .map((items: TournamentPlan[], performanceName: string) => ({
        tournamentName: items[0].tournamentName,
        slotNumber: items[0].slotNumber,
        locationName: items[0].locationName,
        categoryName: items[0].categoryName,
        performerName: items[0].performerName,
        performerNumber: items[0].performerNumber,
        clubName: items[0].clubName,
        performanceName,
        judges: items.map((it) => ({
          judgeId: it.judgeDevice,
          judgeName: it.judgeName,
          criteriaName: it.criteriaName
        }))
      }))

    // precondition
    if (groupedByPerformance.size() < 1) {
      throw new Error('no performance provided')
    }

    // tournament
    const tournamentName = groupedByPerformance.get(0).tournamentName
    let tournament = await findTournamentByTournamentName(tournamentName)
    if (!tournament) {
      tournament = await insertTournament({
        tournamentName,
        tournamentEndTime: new Date(),
        tournamentStartTime: new Date()
      })
    }

    // iterate over grouped performance plan
    const ctx = this.getApplicationContext()
    const planArray = groupedByPerformance.toJSON()
    for await (const plan of planArray) {
      // slot
      const slot = await insertOrUpdateSlot({
        tournamentId: tournament.id,
        slotNumber: typeof plan.slotNumber === 'string' ? parseInt(plan.slotNumber) : plan.slotNumber
      })

      // location
      const location = await insertOrUpdateLocation({
        tournamentId: tournament.id,
        locationName: plan.locationName
      })

      // club
      let club = await ctx.people.getClubByName(plan.clubName)
      if (!club) {
        club = await ctx.people.addClub({
          clubName: plan.clubName,
          associationId: null
        })
      }

      // performer
      const performer = await insertOrUpdatePerformer({
        tournamentId: tournament.id,
        performerName: plan.performerName,
        performerNumber:
          typeof plan.performerNumber === 'string' ? parseInt(plan.performerNumber) : plan.performerNumber,
        tournamentAthletes: []
      })

      // category
      const category = await ctx.judging.getCategoryByName(plan.categoryName)
      if (!category) {
        throw new Error(`no category found with name: ${plan.categoryName}`)
      }

      // performance
      await insertOrUpdatePerformance({
        tournamentId: tournament.id,
        performanceName: plan.performanceName,
        categoryId: category.id,
        clubId: club.id,
        slotNumber: slot.slotNumber,
        locationId: location.id,
        performerId: performer.id,
        judges: plan.judges
      })
    }

    return tournamentPlan
  }

  async getTournamentPlan (tournamentId: string): Promise<TournamentPlanDetails[] | null> {
    const tournamentPlan = await findTournamentPlan(tournamentId)
    return tournamentPlan
  }

  async setTournamentQueueSlot (tournamentId: string, slotNumber: number) {
    try {
      const tournamentQueue = (await getTournamentQueueByTournamentId(tournamentId)) || { tournamentId } as TournamentQueue
      const newSlot = slotNumber
      const updatedTournamentQueue = await insertOrUpdateTournamentQueue({ ...tournamentQueue, slotNumber: newSlot })
      return updatedTournamentQueue
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async moveTournamentQueueToNextSlot (tournamentId: string): Promise<TournamentQueue | null> {
    return await this.moveTournamentQueueSlot(tournamentId, 1)
  }

  async moveTournamentQueueToPreviousSlot (tournamentId: string): Promise<TournamentQueue | null> {
    return await this.moveTournamentQueueSlot(tournamentId, -1)
  }

  async moveTournamentQueueSlot (tournamentId: string, steps: number): Promise<TournamentQueue | null> {
    try {
      const tournamentQueue = (await getTournamentQueueByTournamentId(tournamentId)) || { tournamentId } as TournamentQueue
      const newSlot = (tournamentQueue.slotNumber || 0) + steps
      const newRuns = (tournamentQueue.runs as QueueRun[] || [] as QueueRun[])
      newRuns.push({
        slotNumber: newSlot,
        slotStart: new Date().toISOString(),
        // TODO
        status: {}
      })
      const updatedTournamentQueue = await insertOrUpdateTournamentQueue({ ...tournamentQueue, slotNumber: newSlot, runs: newRuns })
      return updatedTournamentQueue
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getCurrentTournamentQueue (tournamentId: string): Promise<any | null> {
    try {
      // 0. check parameters
      if (!tournamentId) {
        return null
      }
      // 1. get tournamentQueue
      const tournamentQueue = await getTournamentQueueByTournamentId(tournamentId)
      if (!tournamentQueue) {
        return null
      }
      // 2. get performances with tournamentId and current slotNumber
      const performances = await findPerformances({ tournamentId, slotNumber: tournamentQueue.slotNumber })
      console.log(performances)

      // TODO

      // 3. get rawPoints for performances

      // 4. check rawPoints with judgeId

      // let criteriaName = ''
      // let judgeName = ''
      // const performance = performances.find(p => {
      //   const judges: PerformanceJudge[] = p.judges
      //   const judge = judges.find(j => j.judgeId === judgeId)
      //   if (judge) {
      //     criteriaName = judge.criteriaName
      //     judgeName = judge.judgeName
      //     return true
      //   }
      //   return false
      // })
      // if (!performance) {
      //   return null
      // }
      // const criteria = await this.getApplicationContext().judging.getCriteriaByCategoryIdAndName(performance.categoryId, criteriaName)
      // if (!criteria) {
      //   return null
      // }
      // // 4. return queryParams for UI
      // const uiResponse: CurrentQueueUIResponse = {
      //   path: `/judging/${criteria?.criteriaUiLayout || 'nothing'}`,
      //   query: {
      //     slotNumber: performance.slotNumber,
      //     tournamentId,
      //     performanceId: performance.id,
      //     performerId: performance.performerId,
      //     categoryId: performance.categoryId,
      //     criteriaId: criteria.id,
      //     judgeId,
      //     judgeName,
      //     criteriaName
      //   }
      // }
      // return uiResponse
      return tournamentQueue
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getCurrentTournamentQueueForJudge (tournamentId: string, judgeId: string): Promise<CurrentQueueUIResponse | null> {
    try {
      // 0. check parameters
      if (!tournamentId || !judgeId) {
        return null
      }
      // 1. get tournamentQueue
      const tournamentQueue = await getTournamentQueueByTournamentId(tournamentId)
      if (!tournamentQueue) {
        return null
      }
      // 2. get performances with tournamentId and current slotNumber
      const performances = await findPerformances({ tournamentId, slotNumber: tournamentQueue.slotNumber })
      // 3. search performance with judgeId
      let criteriaName = ''
      let judgeName = ''
      const performance = performances.find(p => {
        const judges: PerformanceJudge[] = p.judges
        const judge = judges.find(j => j.judgeId === judgeId)
        if (judge) {
          criteriaName = judge.criteriaName
          judgeName = judge.judgeName
          return true
        }
        return false
      })
      if (!performance) {
        return null
      }
      const criteria = await this.getApplicationContext().judging.getCriteriaByCategoryIdAndName(performance.categoryId, criteriaName)
      if (!criteria) {
        return null
      }
      // 4. return queryParams for UI
      const uiResponse: CurrentQueueUIResponse = {
        path: `/judging/${criteria?.criteriaUiLayout || 'nothing'}`,
        query: {
          slotNumber: performance.slotNumber,
          tournamentId,
          performanceId: performance.id,
          performerId: performance.performerId,
          categoryId: performance.categoryId,
          criteriaId: criteria.id,
          judgeId,
          judgeName,
          criteriaName
        }
      }
      return uiResponse
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async disqualifyPerformance (performanceId: string, disqualified: boolean): Promise<(Performance & Id) | null> {
    const performance = await getPerformanceById(performanceId)
    if (!performance) {
      return null
    }
    const updatedPerformance = await updatePerformance({ ...performance, disqualified })
    this.getApplicationContext().calculation.setDisqualified(performanceId, disqualified)
    return updatedPerformance
  }

  async removePointsForPerformance (performanceId: string) {
    await this.getApplicationContext().calculation.removeCalculation(performanceId)
    await this.getApplicationContext().judging.removeRawPoints(performanceId)
  }
}
