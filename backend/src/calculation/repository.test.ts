/* eslint-disable camelcase */
import { _insertTestPerformance } from '../tournament/repository.test'
import { findCategoryPointByPerformanceId, insertCategoryPoint } from './repository'

// CategoryPoint
test('should insert/find categoryPoint', async () => {
  const { performance } = await _insertTestPerformance()

  const categoryPoint = await insertCategoryPoint({
    tournamentId: performance.tournamentId,
    performanceId: performance.id,
    categoryId: performance.categoryId,
    categoryPoint: 200,
    criteriaPoints: {}
  })

  expect(categoryPoint).toBeTruthy()

  const foundCategoryPoint = await findCategoryPointByPerformanceId(performance.id)
  expect(foundCategoryPoint).toBeTruthy()
  expect(foundCategoryPoint?.categoryPoint).toBe(200)
})

// TODO
// CategoryRank
// CombinationRank
