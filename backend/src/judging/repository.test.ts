/* eslint-disable camelcase */
// /* eslint-disable camelcase */

import { omit } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../lib/db/database'
import { Criteria, JudgingRule, Person_InsertParameters, RawPoint } from '../lib/db/__generated__'
import { insertJudge, insertPerson } from '../people/repository'
import { insertTournamentJudge } from '../tournament/repository'
import { _insertTestPerformance } from '../tournament/repository.test'
import { findCriteriaByCriteriaJudgingRuleAndCriteriaName, findJudgingRuleByName, findRawPoint, insertCriteria, insertJudgingRule, insertRawPoint } from './repository'

test('should insert/find judgingRule', async () => {
  const judgingRuleName = 'single-speed-' + Math.random()
  const judgingRule = await insertJudgingRule({
    judgingRuleName,
    judgingRuleDescription: 'blub'
  })

  expect(judgingRule).toBeTruthy()
  expect(judgingRule.id).toBeTruthy()
  expect(judgingRule.createdAt).toBeTruthy()

  function testJudgingRule (it: JudgingRule | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      judgingRuleName,
      judgingRuleDescription: 'blub',
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }

  const foundJudgingRule = await findJudgingRuleByName(judgingRuleName)

  testJudgingRule(judgingRule)
  testJudgingRule(foundJudgingRule)
})

test('should insert/find criteria', async () => {
  const judgingRuleName = 'single-speed' + Math.random()
  const judgingRule = await insertJudgingRule({
    judgingRuleName,
    judgingRuleDescription: 'blub'
  })

  expect(judgingRule).toBeTruthy()

  const criteriaName = 'count'
  const criteria = await insertCriteria({
    criteriaName,
    subCriteriaDefinition: {
      falseStart: 'boolean',
      count: 'integer'
    },
    judgingRuleId: judgingRule.id
  })

  function testCriteria (it: Criteria | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      criteriaName,
      subCriteriaDefinition: {
        falseStart: 'boolean',
        count: 'integer'
      },
      judgingRuleId: judgingRule.id,
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }

  const foundCriteria = await findCriteriaByCriteriaJudgingRuleAndCriteriaName(judgingRuleName, criteriaName)

  testCriteria(criteria)
  testCriteria(foundCriteria)
})

test('should insert/find rawPoint', async () => {
  // insert judgingRule
  const judgingRuleName = 'single-speed' + Math.random()
  const judgingRule = await insertJudgingRule({
    judgingRuleName,
    judgingRuleDescription: 'blub'
  })

  // insert criteria
  const criteriaName = 'count'
  const criteria = await insertCriteria({
    criteriaName,
    subCriteriaDefinition: {
      falseStart: 'boolean',
      count: 'integer'
    },
    judgingRuleId: judgingRule.id
  })

  // insert performance
  const { performance } = await _insertTestPerformance()
  const performanceId = performance.id

  // insert tournamentJudge
  const clubName = 'SATUS Dachsen ' + Math.random().toString()

  const addressInformation = {
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
  }

  const contactInformation = {
    email: 'andi.neck@intesso.com',
    phone: '0796543210'
  }

  const personInformation: Omit<Person_InsertParameters, 'id'> = {
    clubHead: true,
    firstName: 'Iris',
    lastName: 'Neck',
    gender: 'female',
    birthDate: new Date(1980, 1, 1),
    licenseNumber: '1234'
  }

  const person = await insertPerson({
    clubName, ...addressInformation, ...contactInformation, ...personInformation
  })
  const judge = await insertJudge({ personId: person.id })
  const tournamentJudge = await insertTournamentJudge({ judgeId: judge.id })

  const rawPoint = await insertRawPoint({
    criteriaId: criteria.id,
    performanceId,
    tournamentJudgeId: tournamentJudge.id,
    subCriteriaPoints: {
      falseStart: false,
      count: 102
    }
  })

  function testRawPoint (it: RawPoint | null) {
    expect(omit(it, 'id', 'createdAt')).toEqual({
      criteriaId: criteria.id,
      performanceId,
      tournamentJudgeId: tournamentJudge.id,
      subCriteriaPoints: {
        falseStart: false,
        count: 102
      },
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  }

  const foundRawPoint = await findRawPoint(performanceId, tournamentJudge.id, criteria.id)

  testRawPoint(rawPoint)
  testRawPoint(foundRawPoint)
})

afterAll(() => db.dispose())
