/* eslint-disable camelcase */
import { Category, CategoryCombination, Combination, Criteria, db, JudgingRule, RawPoint } from '../lib/db/database'
import { Category_InsertParameters, Combination_InsertParameters, Criteria_InsertParameters, JudgingRule_InsertParameters, RawPoint_InsertParameters } from '../lib/db/__generated__'
import { isNotNull, newRecordAttributes } from '../lib/common'
import { promises as fs } from 'fs'
import { resolve } from 'path'

let backupPath = ''

// Category
export async function insertCategory (category: Omit<Category_InsertParameters, 'id'>) {
  const [insertedCategory] = await Category(db).insert({ ...category, ...newRecordAttributes() })
  return insertedCategory
}

export async function listCategories () {
  return await Category(db).find().all()
}

export async function getCategoryByCategoryName (categoryName: string) {
  return await Category(db).findOne({ categoryName })
}

export async function getCategoryById (id: string) {
  return await Category(db).findOne({ id })
}

export async function findCategoriesByCombinationName (combinationName: string) {
  const combination = await findCombinationByCombinationName(combinationName)
  if (!combination) return null
  const categoryCombinations = await CategoryCombination(db).find({ combinationId: combination.id }).all()

  const categories = await Promise.all(categoryCombinations.map(cc => getCategoryById(cc.categoryId)))
  return categories.filter(isNotNull)
}

// Combination
export async function insertCombination (combination: Omit<Combination_InsertParameters, 'id'>) {
  const [insertedCombination] = await Combination(db).insert({ ...combination, ...newRecordAttributes() })
  return insertedCombination
}

export async function findCombinationByCombinationName (combinationName: string) {
  return await Combination(db).findOne({ combinationName })
}

export async function findCombinationById (id: string) {
  return await Combination(db).findOne({ id })
}

export async function listCombinations () {
  return await Combination(db).find().all()
}

// CategoryCombination
export async function insertCategoryCombination (combinationName: string, categoryName: string, categoryWeight: number) {
  const combination = await findCombinationByCombinationName(combinationName)
  const category = await getCategoryByCategoryName(categoryName)
  if (!combination || !category) return null
  const [insertedCombination] = await CategoryCombination(db).insert({ categoryId: category.id, combinationId: combination.id, categoryWeight, createdAt: new Date() })
  return insertedCombination
}

export async function findCategoryCombinationByNames (combinationName: string, categoryName: string) {
  const combination = await findCombinationByCombinationName(combinationName)
  const category = await getCategoryByCategoryName(categoryName)
  if (!combination || !category) return null
  return await CategoryCombination(db).findOne({ categoryId: category.id, combinationId: combination.id })
}

export async function listCategoryCombinations () {
  return await CategoryCombination(db).find().all()
}

// JudgingRule
export async function insertJudgingRule (judgingRule: Omit<JudgingRule_InsertParameters, 'id'>) {
  const [insertedJudgingRule] = await JudgingRule(db).insert({ ...judgingRule, ...newRecordAttributes() })
  return insertedJudgingRule
}

export async function findJudgingRuleById (id: string) {
  return await JudgingRule(db).findOne({ id })
}

export async function findJudgingRuleByName (judgingRuleName: string) {
  return await JudgingRule(db).findOne({ judgingRuleName })
}

export async function findJudgingRuleByCategoryId (categoryId: string) {
  const category = await Category(db).findOne({ id: categoryId })
  if (!category) return null
  return await JudgingRule(db).findOne({ id: category.judgingRuleId })
}

// Criteria
export async function insertCriteria (criteria: Omit<Criteria_InsertParameters, 'id'>) {
  const [insertedCriteria] = await Criteria(db).insert({ ...criteria, ...newRecordAttributes() })
  return insertedCriteria
}

export async function findCriteriaByCriteriaJudgingRuleAndCriteriaName (judgingRuleName: string, criteriaName: string) {
  const judgingRule = await JudgingRule(db).findOne({ judgingRuleName })
  if (!judgingRule) return null

  return await Criteria(db).findOne({ criteriaName, judgingRuleId: judgingRule.id })
}

export async function findCriteriaByCategoryId (categoryId: string) {
  const category = await Category(db).findOne({ id: categoryId })
  if (!category) return null
  const judgingRule = await JudgingRule(db).findOne({ id: category.judgingRuleId })
  if (!judgingRule) return null

  return await Criteria(db).find({ judgingRuleId: judgingRule.id }).all()
}

export async function getCriteriaByCategoryIdAndName (categoryId: string, criteriaName: string) {
  const category = await Category(db).findOne({ id: categoryId })
  if (!category) return null
  const judgingRule = await JudgingRule(db).findOne({ id: category.judgingRuleId })
  if (!judgingRule) return null

  return await Criteria(db).findOne({ judgingRuleId: judgingRule?.id, criteriaName })
}

export async function getCriteriaById (id: string) {
  return await Criteria(db).findOne({ id })
}

export async function listCriteria () {
  return await Criteria(db).find().all()
}

// RawPoint
export async function insertRawPoint (rawPoint: Omit<RawPoint_InsertParameters, 'id'>) {
  const [insertedRawPoint] = await RawPoint(db).insert({ ...rawPoint, ...newRecordAttributes() })
  return insertedRawPoint
}

export async function insertOrUpdateRawPoint (rawPoint: Omit<RawPoint_InsertParameters, 'id'>) {
  const foundRawPoints = await getRawPoint(rawPoint.performanceId, rawPoint.judgeId, rawPoint.criteriaId)
  if (foundRawPoints) {
    const [updatedRawPoints] = await RawPoint(db).update(
      { performanceId: rawPoint.performanceId, judgeId: rawPoint.judgeId, criteriaId: rawPoint.criteriaId },
      { ...foundRawPoints, ...rawPoint, updatedAt: new Date() })
    return updatedRawPoints
  }
  return await insertRawPoint(rawPoint)
}

export async function getRawPointById (id: string) {
  return await RawPoint(db).findOne({ id })
}

export async function getRawPoint (performanceId: string, judgeId: string, criteriaId: string) {
  return await RawPoint(db).findOne({ performanceId, judgeId, criteriaId })
}

export async function findRawPoints (rawPoints: Partial<RawPoint_InsertParameters>) {
  return await RawPoint(db).find({ ...rawPoints }).all()
}

export async function deleteRawPointsForPerformance (performanceId: string) {
  return await RawPoint(db).delete({ performanceId })
}

export async function deleteRawPoint (id: string) {
  return await RawPoint(db).delete({ id })
}

export async function backupRawPoint (rp: Omit<RawPoint_InsertParameters, 'id'>) {
  await initializeBackup()
  const fileName = generateFilename()
  fs.writeFile(resolve(backupPath, fileName), JSON.stringify(rp, null, 2), { encoding: 'utf8' })
    .then(() => console.log(`backupRawPoint written: ${fileName}`))
    .catch((err) => console.error(`backupRawPoint ERROR: ${fileName}, ${err.message}`))
}

async function initializeBackup () {
  if (backupPath || !process.env.BACKUP_RAW_DATA) {
    return true
  }
  const path = resolve(process.env.BACKUP_RAW_DATA)
  await fs.mkdir(path, { recursive: true })
  backupPath = path
}

function generateFilename () {
  const now = (Date.now()).toString().padStart(24, '0')
  const rand = (Math.random() * 100000).toFixed(0).padStart(5, '0')
  return `${now}-${rand}.json`
}
