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
  const foundCategoryPoints = await getCategoryPointByPerformanceIdAndCategoryId(categoryPoint.performanceId, categoryPoint.categoryId)
  if (foundCategoryPoints) {
    const [updatedCategoryPoints] = await CategoryPoint(db).update(
      { performanceId: categoryPoint.performanceId, categoryId: categoryPoint.categoryId },
      { ...foundCategoryPoints, ...categoryPoint, updatedAt: new Date() })
    return updatedCategoryPoints
  }
  return await insertCategoryPoint(categoryPoint)
}

export async function updateCategoryPoint (categoryPoint: CategoryPoint_InsertParameters) {
  const [updatedCategoryPoint] = await CategoryPoint(db).update({ id: categoryPoint.id }, { ...categoryPoint, ...updateRecordAttributes() })
  return updatedCategoryPoint
}

export async function deleteCategoryPointById (id: string) {
  return await CategoryPoint(db).delete({ id })
}

export async function getCategoryPointById (id: string) {
  return await CategoryPoint(db).findOne({ id })
}

export async function getCategoryPointByPerformanceIdAndCategoryId (performanceId: string, categoryId: string) {
  return await CategoryPoint(db).findOne({ performanceId, categoryId })
}

export async function findCategoryPointByCategoryId (tournamentId: string, categoryId: string) {
  return await CategoryPoint(db).find({ tournamentId, categoryId }).orderByDesc('categoryPoint').all()
}

// CategoryRank
export async function insertCategoryRank (categoryRank: Omit<CategoryRank_InsertParameters, 'id'>) {
  const [insertedCategoryRank] = await CategoryRank(db).insert({ ...categoryRank, ...newRecordAttributes() })
  return insertedCategoryRank
}

export async function updateCategoryRank (categoryRank: CategoryRank_InsertParameters) {
  const [updatedCategoryRank] = await CategoryRank(db).update({ id: categoryRank.id }, { ...categoryRank, ...updateRecordAttributes() })
  return updatedCategoryRank
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

export async function deleteCategoryRankById (id: string) {
  return await CategoryRank(db).delete({ id })
}

export async function getCategoryRankById (id: string) {
  return await CategoryRank(db).findOne({ id })
}

export async function getCategoryRankByCategoryPointId (categoryPointId: string) {
  return await CategoryRank(db).findOne({ categoryPointId })
}

export async function findCategoryRankByCategoryId (tournamentId: string, categoryId: string) {
  return await CategoryRank(db).find({ tournamentId, categoryId }).orderByAsc('categoryRank').all()
}

// CombinationRank
export async function insertCombinationRank (combinationRank: Omit<CombinationRank_InsertParameters, 'id'>) {
  const [insertedCombinationRank] = await CombinationRank(db).insert({ ...combinationRank, ...newRecordAttributes() })
  return insertedCombinationRank
}

export async function insertOrUpdateCombinationRank (combinationRank: Omit<CombinationRank_InsertParameters, 'id'>) {
  const foundCombinationRank = await getCombinationRankByCombinationId(combinationRank.tournamentId, combinationRank.combinationId)
  if (foundCombinationRank) {
    const [updatedCombinationRank] = await CombinationRank(db).update(
      { tournamentId: combinationRank.tournamentId, combinationId: combinationRank.combinationId },
      { ...foundCombinationRank, ...combinationRank, updatedAt: new Date() }
    )
    return updatedCombinationRank
  }
  return await insertCombinationRank(combinationRank)
}

export async function getCombinationRankById (id: string) {
  return await CombinationRank(db).findOne({ id })
}

export async function getCombinationRankByCombinationName (tournamentId: string, combinationName: string) {
  const combination = await Combination(db).findOne({ combinationName })
  if (!combination) return null
  return await getCombinationRankByCombinationId(tournamentId, combination.id)
}

export async function getCombinationRankByCombinationId (tournamentId: string, combinationId: string) {
  return await CombinationRank(db).findOne({ tournamentId, combinationId })
}

export async function listCombinationRankByTournament (tournamentId: string) {
  return await CombinationRank(db).find({ tournamentId }).all()
}

export async function deleteCombinationRankForTournament (tournamentId: string) {
  return await CombinationRank(db).delete({ tournamentId })
}
