/* eslint-disable camelcase */
import { CategoryPoint, CategoryRank, Combination, CombinationRank, db } from '../lib/db/database'
import { CategoryPoint_InsertParameters, CategoryRank_InsertParameters, CombinationRank_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes } from '../lib/common'

// CategoryPoint
export async function insertCategoryPoint (categoryPoint: Omit<CategoryPoint_InsertParameters, 'id'>) {
  const [insertedCategoryPoint] = await CategoryPoint(db).insert({ ...categoryPoint, ...newRecordAttributes() })
  return insertedCategoryPoint
}

export async function insertOrUpdateCategoryPoint (categoryPoint: Omit<CategoryPoint_InsertParameters, 'id'>) {
  const [insertedCategoryPoint] = await CategoryPoint(db).insertOrUpdate(['performanceId'], { ...categoryPoint, ...newRecordAttributes() })
  return insertedCategoryPoint
}

export async function findCategoryPointById (id: string) {
  return await CategoryPoint(db).findOne({ id })
}

export async function findCategoryPointByPerformanceId (performanceId: string) {
  return await CategoryPoint(db).findOne({ performanceId })
}

// CategoryRank
export async function insertCategoryRank (categoryRank: Omit<CategoryRank_InsertParameters, 'id'>) {
  const [insertedCategoryRank] = await CategoryRank(db).insert({ ...categoryRank, ...newRecordAttributes() })
  return insertedCategoryRank
}

export async function findCategoryRankById (id: string) {
  return await CategoryRank(db).findOne({ id })
}

export async function findCategoryPointByCategoryId (categoryId: string) {
  return await CategoryRank(db).findOne({ categoryId })
}

// CombinationRank
export async function insertCombinationRank (combinationRank: Omit<CombinationRank_InsertParameters, 'id'>) {
  const [insertedCombinationRank] = await CombinationRank(db).insert({ ...combinationRank, ...newRecordAttributes() })
  return insertedCombinationRank
}

export async function findCombinationRankById (id: string) {
  return await CombinationRank(db).findOne({ id })
}

export async function findCategoryPointByCombinationName (combinationName: string) {
  const combination = await Combination(db).findOne({ combinationName })
  if (!combination) return null
  return await CombinationRank(db).findOne({ combinationId: combination.id })
}
