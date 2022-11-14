/* eslint-disable camelcase */
import { CategoryPoint, CategoryRank, Combination, CombinationRank, db } from '../lib/db/database'
import { CategoryPoint_InsertParameters, CategoryRank_InsertParameters, CombinationRank_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes, updateRecordAttributes } from '../lib/common'

// CategoryPoint
export async function insertCategoryPoint (categoryPoint: Omit<CategoryPoint_InsertParameters, 'id'>) {
  const [insertedCategoryPoint] = await CategoryPoint(db).insert({ ...categoryPoint, ...newRecordAttributes() })
  return insertedCategoryPoint
}

export async function insertOrUpdateCategoryPoint (categoryPoint: Omit<CategoryPoint_InsertParameters, 'id'>) {
  const [insertedCategoryPoint] = await CategoryPoint(db).insertOrUpdate(['performanceId'], { ...categoryPoint, ...newRecordAttributes() })
  return insertedCategoryPoint
}

export async function getCategoryPointById (id: string) {
  return await CategoryPoint(db).findOne({ id })
}

export async function getCategoryPointByPerformanceId (performanceId: string) {
  return await CategoryPoint(db).findOne({ performanceId })
}

export async function findCategoryPointByCategoryId (tournamentId: string, categoryId: string) {
  return await CategoryPoint(db).find({ tournamentId, categoryId }).orderByDesc('categoryPoint').all()
}

// CategoryRank
export async function insertCategoryRank (categoryRank: Omit<CategoryRank_InsertParameters, 'id'>) {
  const [insertedCategoryRank] = await CategoryRank(db).insert({ ...categoryRank, ...newRecordAttributes() })
  return insertedCategoryRank
}

export async function insertOrUpdateCategoryRanks (categoryRanks: Omit<CategoryRank_InsertParameters, 'id'>[]) {
  const records = categoryRanks.map(r => ({
    tournamentId: r.tournamentId,
    categoryId: r.categoryId,
    categoryPointId: r.categoryPointId,
    categoryRank: r.categoryRank === undefined ? null : r.categoryRank,
    disqualified: r.disqualified === undefined ? null : r.disqualified,
    ...newRecordAttributes(),
    ...updateRecordAttributes()
  }))
  return await CategoryRank(db).bulkInsertOrUpdate({
    columnsToInsert: ['categoryPointId', 'tournamentId', 'categoryId', 'categoryRank', 'disqualified', 'createdAt', 'updatedAt'],
    columnsThatConflict: ['categoryPointId'],
    columnsToUpdate: ['tournamentId', 'categoryId', 'categoryRank', 'disqualified', 'createdAt', 'updatedAt'],
    records
  })
}

export async function getCategoryRankById (id: string) {
  return await CategoryRank(db).findOne({ id })
}

export async function findCategoryRankByCategoryId (tournamentId: string, categoryId: string) {
  return await CategoryRank(db).find({ tournamentId, categoryId }).orderByDesc('categoryRank').all()
}

// CombinationRank
export async function insertCombinationRank (combinationRank: Omit<CombinationRank_InsertParameters, 'id'>) {
  const [insertedCombinationRank] = await CombinationRank(db).insert({ ...combinationRank, ...newRecordAttributes() })
  return insertedCombinationRank
}

export async function findCombinationRankById (id: string) {
  return await CombinationRank(db).findOne({ id })
}

export async function findCategoryRankByCombinationName (combinationName: string) {
  const combination = await Combination(db).findOne({ combinationName })
  if (!combination) return null
  return await CombinationRank(db).findOne({ combinationId: combination.id })
}
