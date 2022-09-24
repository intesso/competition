// /* eslint-disable camelcase */

import { findCategoryByCategoryName, findLocationByLocationName, findSlotByTorunamentNameAndSlotNumber, findTournamentByTournamentName, insertCategory, insertLocation, insertSlot, insertTournament } from './repository'

import { DateTime } from 'luxon'
import { dateTimeFormat } from '../lib/common'
import { db } from '../lib/db/database'
import { omit } from 'lodash'
import { Category, Location, Slot, Tournament } from '../lib/db/__generated__'
import { insertJudgingRule } from '../judging/repository'

test('should insert/find tournament', async () => {
  const tournamentName = 'Team SM 2022 ' + Math.random().toString()
  const tournament = await insertTournament({
    tournamentEndTime: DateTime.fromFormat('2022-10-25 10:00', dateTimeFormat).toUTC().toJSDate(),
    tournamentName,
    tournamentStartTime: DateTime.fromFormat('2022-10-25 19:00', dateTimeFormat).toUTC().toJSDate()
  })

  expect(tournament).toBeTruthy()
  expect(tournament.id).toBeTruthy()
  expect(tournament.createdAt).toBeTruthy()

  const foundTournament = await findTournamentByTournamentName(tournamentName)

  function testTournament (it: Tournament | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      addressId: null,
      competition: null,
      createdBy: null,
      tournamentEndTime: new Date('2022-10-25T08:00:00.000Z'),
      tournamentName,
      tournamentStartTime: new Date('2022-10-25T17:00:00.000Z'),
      updatedAt: null,
      updatedBy: null
    })
  }
  testTournament(tournament)
  testTournament(foundTournament)
})

test('should insert/find location', async () => {
  const tournamentName = 'Team SM 2022 ' + Math.random().toString()
  const tournament = await insertTournament({
    tournamentEndTime: DateTime.fromFormat('2022-10-25 10:00', dateTimeFormat).toUTC().toJSDate(),
    tournamentName,
    tournamentStartTime: DateTime.fromFormat('2022-10-25 19:00', dateTimeFormat).toUTC().toJSDate()
  })

  const locationName = 'Feld 1' + Math.random().toString()

  const location = await insertLocation({
    locationName,
    tournamentId: tournament.id
  })

  expect(location).toBeTruthy()
  expect(location.id).toBeTruthy()
  expect(location.createdAt).toBeTruthy()

  const foundLocation = await findLocationByLocationName(locationName)

  function testLocation (it: Location | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      locationCoordinates: null,
      locationName,
      tournamentId: tournament.id,
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }
  testLocation(location)
  testLocation(foundLocation)
})

test('should insert/find slot', async () => {
  const tournamentName = 'Team SM 2022 ' + Math.random().toString()
  const tournament = await insertTournament({
    tournamentEndTime: DateTime.fromFormat('2022-10-25 10:00', dateTimeFormat).toUTC().toJSDate(),
    tournamentName,
    tournamentStartTime: DateTime.fromFormat('2022-10-25 19:00', dateTimeFormat).toUTC().toJSDate()
  })

  const slot = await insertSlot({
    tournamentId: tournament.id,
    slotStartTime: DateTime.fromFormat('2022-10-25 10:10', dateTimeFormat).toUTC().toJSDate(),
    slotNumber: 1
  })

  expect(slot).toBeTruthy()
  expect(slot.slotNumber).toBeTruthy()
  expect(slot.createdAt).toBeTruthy()

  const foundSlot = await findSlotByTorunamentNameAndSlotNumber(tournamentName, 1)

  function testSlot (it: Slot | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      slotName: null,
      slotNumber: 1,
      slotStartTime: new Date('2022-10-25T08:10:00.000Z'),
      tournamentId: tournament.id,
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }
  testSlot(slot)
  testSlot(foundSlot)
})

test('should insert/find category', async () => {
  const judgingRuleName = 'single-speed'
  const judgingRule = await insertJudgingRule({
    judgingRuleName
  })

  expect(judgingRule).toBeTruthy()

  const categoryName = 'team-speed-u15-single-rope-' + Math.random().toString()
  const category = await insertCategory({
    competition: 'team',
    categoryName,
    discipline: 'speed',
    group: 'ü15',
    judgingRuleId: judgingRule.id,
    level: 'erso',
    type: 'double-dutch'
  })

  expect(category).toBeTruthy()
  expect(category.id).toBeTruthy()
  expect(category.createdAt).toBeTruthy()

  const foundCategory = await findCategoryByCategoryName(categoryName)

  function testCategory (it: Category | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      competition: 'team',
      categoryName,
      discipline: 'speed',
      group: 'ü15',
      judgingRuleId: judgingRule.id,
      level: 'erso',
      type: 'double-dutch',
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }
  testCategory(category)
  testCategory(foundCategory)
})

// TODO Test:
// Combination
// CategoryCombination
// Performance
// TournamentAthlete
// TournamentJudge

afterAll(() => db.dispose())
