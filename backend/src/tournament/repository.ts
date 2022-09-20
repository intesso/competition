/* eslint-disable camelcase */
import { Category, CategoryCombination, Combination, db, Location, Performance, Slot, Tournament } from '../lib/db/database'
import { Category_InsertParameters, Combination_InsertParameters, Location_InsertParameters, Performance_InsertParameters, Slot_InsertParameters, Tournament_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes } from '../lib/common'

// Tournament
export async function insertTournament (tournament: Omit<Tournament_InsertParameters, 'id'>) {
  const [insertedTournament] = await Tournament(db).insert({ ...tournament, ...newRecordAttributes() })
  return insertedTournament
}

export async function findTournamentByTournamentName (tournamentName: string) {
  return await Tournament(db).findOne({ tournamentName })
}

// Location
export async function insertLocation (location: Omit<Location_InsertParameters, 'id'>) {
  const [insertedLocation] = await Location(db).insert({ ...location, ...newRecordAttributes() })
  return insertedLocation
}

export async function findLocationByLocationName (locationName: string) {
  return await Location(db).findOne({ locationName })
}

// Slot
export async function insertSlot (slot: Omit<Slot_InsertParameters, 'id'>) {
  const [insertedSlot] = await Slot(db).insert({ ...slot, createdAt: new Date() })
  return insertedSlot
}

export async function findSlotByTorunamentNameAndSlotNumber (tournamentName: string, slotNumber: number) {
  const tournament = await findTournamentByTournamentName(tournamentName)
  if (!tournament) return null
  return await Slot(db).findOne({ tournamentId: tournament.id, slotNumber })
}

// Category
export async function insertCategory (category: Omit<Category_InsertParameters, 'id'>) {
  const [insertedCategory] = await Category(db).insert({ ...category, ...newRecordAttributes() })
  return insertedCategory
}

export async function findCategoryByCategoryName (categoryName: string) {
  return await Category(db).findOne({ categoryName })
}

// Combination
export async function insertCombination (combination: Omit<Combination_InsertParameters, 'id'>) {
  const [insertedCombination] = await Combination(db).insert({ ...combination, ...newRecordAttributes() })
  return insertedCombination
}

export async function findCombinationByCombinationName (combinationName: string) {
  return await Combination(db).findOne({ combinationName })
}

// CategoryCombination
export async function insertCategoryCombination (categoryName: string, combinationName: string, categoryWeight: number) {
  const combination = await findCombinationByCombinationName(combinationName)
  const category = await findCategoryByCategoryName(categoryName)
  if (!combination || !category) return null
  const [insertedCombination] = await CategoryCombination(db).insert({ categoryId: category.id, combinationId: combination.id, categoryWeight, createdAt: new Date() })
  return insertedCombination
}

export async function findCategoryCombinationByNames (categoryName: string, combinationName: string) {
  const combination = await findCombinationByCombinationName(combinationName)
  const category = await findCategoryByCategoryName(categoryName)
  if (!combination || !category) return null
  return await CategoryCombination(db).findOne({ categoryId: category.id, combinationId: combination.id })
}

// Performance
export async function insertPerformance (performance: Omit<Performance_InsertParameters, 'id'>) {
  const [insertedPerformance] = await Performance(db).insert({ ...performance, ...newRecordAttributes() })
  return insertedPerformance
}

export async function findPerformances (performance: Performance_InsertParameters) {
  return await Performance(db).find(performance).all()
}
