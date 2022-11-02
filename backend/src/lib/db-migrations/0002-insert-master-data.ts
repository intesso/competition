/* eslint-disable camelcase */
import '../../../dotenv'
import { readCsvFile } from '../db/csv-import'
import { Category, CategoryCombination, Combination, Criteria, db, JudgingRule } from '../db/database'
import { JudgingRule_InsertParameters } from '../db/__generated__'

async function insertJudgingRule () {
  const rows = await readCsvFile('./src/lib/db-migrations/master-data/JudgingRule.csv')
  const header = rows.shift()
  const records = rows.map(row => ({
    id: row[0] as string,
    judgingRuleName: row[1] as string,
    judgingRuleDescription: row[2] as string,
    createdAt: new Date()
  } as JudgingRule_InsertParameters))
  return await JudgingRule(db).bulkInsert({
    columnsToInsert: [...header, 'createdAt'],
    records
  })
}

async function insertCategory () {
  const rows = await readCsvFile('./src/lib/db-migrations/master-data/Category.csv')
  rows.shift() // remove header
  const records = rows.map(row => ({
    id: row[0] as string,
    judgingRuleId: row[1] as string,
    categoryName: row[8] as string,
    competition: row[3] as string,
    group: row[4] as string,
    level: row[5] as string,
    type: row[6] as string,
    discipline: row[7] as string,
    createdAt: new Date() as Date
  }))
  return await Category(db).bulkInsert({
    columnsToInsert: ['createdAt'],
    records
  })
}

async function insertCriteria () {
  const rows = await readCsvFile('./src/lib/db-migrations/master-data/Criteria.csv')
  rows.shift()
  // create object with judgingRuleName-criteriaName as key first
  const distinctCriteria = rows
    .reduce((memo, row) => {
      const key = `${row[0]}-${row[1]}`
      if (memo[key]) {
        memo[key].push(row)
      } else {
        memo[key] = [row]
      }
      return memo
    }, {})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const records = Object.values(distinctCriteria).map((rows: any) => ({
    id: rows[0][0] as string,
    judgingRuleId: rows[0][1] as string,
    criteriaName: rows[0][3] as string,
    criteriaDescription: rows[0][4] as string,
    criteriaWeight: parseInt(rows[0][5]) as number,
    criteriaUiLayout: rows[0][13] as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subCriteriaDefinition: rows.reduce((memo: any, row: any) => {
      memo[row[6]] = {
        subCriteriaName: row[6],
        subCriteriaDescription: row[7],
        subCriteriaWeight: parseInt(row[8]) as number,
        valueType: row[9],
        rangeStart: parseInput(row[9], row[10]),
        rangeEnd: parseInput(row[9], row[11]),
        step: parseInt(row[12]),
        uiPosition: row[14]
      }
      return memo
    }, {}),
    createdAt: new Date()
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseInput (valueType: string, input: any) {
    if (valueType === 'integer' || valueType === 'int') {
      return parseInt(input)
    } else if (valueType === 'number' || valueType === 'float') {
      return parseFloat(input)
    }
    return input
  }

  return await Criteria(db).bulkInsert({
    columnsToInsert: ['subCriteriaDefinition', 'criteriaUiLayout', 'createdAt'],
    records
  })
}

async function insertCombination () {
  const rows = await readCsvFile('./src/lib/db-migrations/master-data/Combination.csv')
  rows.shift()
  // create object with combinationName-categoryName as key first
  const combinations = rows
    .reduce<{[key: string]: { id: string, combinationName: string, createdAt: Date}}>((memo, row: string[]) => {
      memo[row[1]] = { id: row[0], combinationName: row[1], createdAt: new Date() }
      return memo
    }, {})

  const records = Object.values(combinations)

  return await Combination(db).bulkInsert({
    columnsToInsert: ['createdAt'],
    records
  })
}

async function insertCategoryCombination () {
  const rows = await readCsvFile('./src/lib/db-migrations/master-data/Combination.csv')
  rows.shift()
  const records = rows.map(row => ({
    categoryId: row[2] as string,
    combinationId: row[0] as string,
    categoryWeight: parseFloat(row[4]),
    createdAt: new Date()
  }))

  return await CategoryCombination(db).bulkInsert({
    columnsToInsert: ['createdAt'],
    records
  })
}

(async function () {
  if (!process.argv[2] || !process.argv[2].startsWith('import=')) {
    await insertJudgingRule()
    await insertCategory()
    await insertCriteria()
    await insertCombination()
    await insertCategoryCombination()
  } else {
    const table = process.argv[2].replace('import=', '')
    switch (table) {
      case 'JudgingRule':
        await insertJudgingRule()
        break
      case 'Category':
        await insertCategory()
        break
      case 'Criteria':
        await insertCriteria()
        break
      case 'Combination':
        await insertCombination()
        break
      case 'CategoryCombination':
        await insertCategoryCombination()
        break
      default:
        break
    }
  }

  await db.dispose()
})()
