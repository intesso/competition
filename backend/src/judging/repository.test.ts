/* eslint-disable camelcase */
// /* eslint-disable camelcase */

import { omit } from 'lodash'
import { db } from '../lib/db/database'
import { Category, Combination, Criteria, JudgingRule, Person_InsertParameters, RawPoint } from '../lib/db/__generated__'
import { insertJudge, insertPerson } from '../people/repository'
import { insertTournamentJudge } from '../tournament/repository'
import { _insertTestPerformance } from '../tournament/repository.test'
import { findCategoriesByCombinationName, findCategoryByCategoryName, findCombinationByCombinationName, findCriteriaByCriteriaJudgingRuleAndCriteriaName, findJudgingRuleByName, findRawPoint, insertCategory, insertCategoryCombination, insertCombination, insertCriteria, insertJudgingRule, insertRawPoint } from './repository'

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
      timestamp: null,
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
