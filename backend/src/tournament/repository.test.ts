/* eslint-disable camelcase */
// /* eslint-disable camelcase */

import { findCategoriesByCombinationName, findCategoryByCategoryName, findCombinationByCombinationName, findLocationByLocationName, findSlotByTorunamentNameAndSlotNumber, findTournamentByTournamentName, insertCategory, insertCategoryCombination, insertCombination, insertLocation, insertPerformance, insertSlot, insertTournament, insertTournamentAthlete, insertTournamentJudge } from './repository'

import { DateTime } from 'luxon'
import { dateTimeFormat } from '../lib/common'
import { db } from '../lib/db/database'
import { omit } from 'lodash'
import { Category, Combination, Location, Person_InsertParameters, Slot, Tournament } from '../lib/db/__generated__'
import { insertJudgingRule } from '../judging/repository'
import { insertAddress, insertAthlete, insertClub, insertJudge, insertPerson } from '../people/repository'

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
  const judgingRuleName = 'single-speed-' + Math.random()
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

// Combination
test('should insert/find combination', async () => {
  const combinationName = 'Speed ' + Math.random().toString()
  const combination = await insertCombination({
    combinationName
  })

  expect(combination).toBeTruthy()
  expect(combination.id).toBeTruthy()
  expect(combination.createdAt).toBeTruthy()

  const foundCombination = await findCombinationByCombinationName(combinationName)

  function testCombination (it: Combination | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      combinationName,
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }
  testCombination(combination)
  testCombination(foundCombination)
})

// CategoryCombination
test('should insert/find categoryCombination', async () => {
  // instert combination
  const combinationName = 'Speed ' + Math.random().toString()
  const combination = await insertCombination({
    combinationName
  })

  // insert judgingRule
  const judgingRuleName = 'single-speed-' + Math.random()
  const judgingRule = await insertJudgingRule({
    judgingRuleName
  })

  // insert category1
  const categoryName1 = 'team-speed-u15-single-rope-' + Math.random().toString()
  const category1 = await insertCategory({
    competition: 'team',
    categoryName: categoryName1,
    discipline: 'speed',
    group: 'u15',
    judgingRuleId: judgingRule.id,
    level: 'erso',
    type: 'single-rope'
  })
  expect(category1).toBeTruthy()

  // insert category2
  const categoryName2 = 'team-speed-u15-double-dutch-' + Math.random().toString()
  const category2 = await insertCategory({
    competition: 'team',
    categoryName: categoryName2,
    discipline: 'speed',
    group: 'u15',
    judgingRuleId: judgingRule.id,
    level: 'erso',
    type: 'double-dutch'
  })
  expect(category2).toBeTruthy()

  const categoryCombination1 = await insertCategoryCombination(combinationName, categoryName1, 60)
  const categoryCombination2 = await insertCategoryCombination(combinationName, categoryName2, 40)

  expect(categoryCombination1?.categoryId).toEqual(category1.id)
  expect(categoryCombination1?.combinationId).toEqual(combination.id)
  expect(categoryCombination1?.categoryWeight).toEqual(60)

  expect(categoryCombination2?.categoryId).toEqual(category2.id)
  expect(categoryCombination2?.combinationId).toEqual(combination.id)
  expect(categoryCombination2?.categoryWeight).toEqual(40)

  const categories = await findCategoriesByCombinationName(combinationName)
  expect(categories).toBeTruthy()
  expect(categories?.some(category => category.categoryName === categoryName1)).toBeTruthy()
  expect(categories?.some(category => category.categoryName === categoryName2)).toBeTruthy()
})

// Performance
test('should insert/find performance', async () => {
  const { tournament, club, location, category, performance } = await _insertTestPerformance()
  expect(performance.id).toBeTruthy()
  expect(omit(performance, 'id', 'createdAt')).toEqual({
    categoryId: category.id,
    tournamentId: tournament.id,
    athletes: ['2345643573457612345', '23450234985602349867'],
    clubId: club.id,
    locationId: location.id,
    slotNumber: 1,
    performanceName: 'simply the best',
    performanceNumber: 1,
    performanceStartTime: DateTime.fromFormat('2022-10-25 10:15', dateTimeFormat).toUTC().toJSDate(),
    createdBy: null,
    updatedAt: null,
    updatedBy: null
  })
})

export async function _insertTestPerformance () {
  // insert tournament
  const tournamentName = 'Team SM 2022 ' + Math.random().toString()
  const tournament = await insertTournament({
    tournamentEndTime: DateTime.fromFormat('2022-10-25 10:00', dateTimeFormat).toUTC().toJSDate(),
    tournamentName,
    tournamentStartTime: DateTime.fromFormat('2022-10-25 19:00', dateTimeFormat).toUTC().toJSDate()
  })

  // insert club with club address first
  const clubName = 'SATUS Dachsen ' + Math.random().toString()
  const clubAddress = await insertAddress({
    street: 'Dorfstrasse',
    houseNumber: '3',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
  })

  const club = await insertClub({
    clubName,
    addressId: clubAddress.id,
    associationId: '12345678'
  })

  // insert category with judgingRule first
  const judgingRuleName = 'single-speed-' + Math.random()
  const judgingRule = await insertJudgingRule({
    judgingRuleName
  })

  const categoryName = 'team-speed-u15-single-rope-' + Math.random().toString()
  const category = await insertCategory({
    competition: 'team',
    categoryName,
    discipline: 'speed',
    group: 'u15',
    judgingRuleId: judgingRule.id,
    level: 'erso',
    type: 'single-rope'
  })

  // insert slot
  const slot = await insertSlot({
    tournamentId: tournament.id,
    slotStartTime: DateTime.fromFormat('2022-10-25 10:10', dateTimeFormat).toUTC().toJSDate(),
    slotNumber: 1
  })

  // insert location
  const locationName = 'Feld 1' + Math.random().toString()
  const location = await insertLocation({
    locationName,
    tournamentId: tournament.id
  })

  // finally insert performance
  const performance = await insertPerformance({
    categoryId: category.id,
    tournamentId: tournament.id,
    athletes: ['2345643573457612345', '23450234985602349867'],
    clubId: club.id,
    locationId: location.id,
    slotNumber: 1,
    performanceName: 'simply the best',
    performanceNumber: 1,
    performanceStartTime: DateTime.fromFormat('2022-10-25 10:15', dateTimeFormat).toUTC().toJSDate()
  })

  return { tournament, clubAddress, club, slot, location, category, judgingRule, performance }
}

// TournamentAthlete
test('should insert/find tournamentAthlete', async () => {
  const personInformation: Omit<Person_InsertParameters, 'id'> = {
    addressId: null,
    contactInformationId: null,
    clubId: null,
    clubHead: null,
    firstName: 'Iris',
    lastName: 'Neck',
    gender: 'female',
    birthDate: new Date(1980, 1, 1),
    licenseNumber: null
  }

  const person = await insertPerson(personInformation)
  const athlete = await insertAthlete({ personId: person.id })
  const tournamentAthlete = await insertTournamentAthlete({ athleteId: athlete.id })
  expect(tournamentAthlete.athleteId).toEqual(athlete.id)
})

// TournamentJudge
test('should insert/find tournamentJudge', async () => {
  const personInformation: Omit<Person_InsertParameters, 'id'> = {
    addressId: null,
    contactInformationId: null,
    clubId: null,
    clubHead: null,
    firstName: 'Iris',
    lastName: 'Neck',
    gender: 'female',
    birthDate: new Date(1980, 1, 1),
    licenseNumber: null
  }

  const person = await insertPerson(personInformation)
  const judge = await insertJudge({ personId: person.id })
  const tournamentJudge = await insertTournamentJudge({ judgeId: judge.id })
  expect(tournamentJudge.judgeId).toEqual(judge.id)
})
afterAll(() => db.dispose())
