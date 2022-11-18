import { readCsv } from '../../db/csv-import'
import { readFileSync, writeFileSync } from 'fs'

// transforms csv to json:
// Example:
//
// cd src/lib/db-migrations/dummy-data
// ts-node csv-to-json.ts Tournament.csv Tournament.json
// import via postman test

const inputFile = process.argv[2]
const outputFile = process.argv[3]
const csv = readFileSync(inputFile, 'utf8')

const json = readCsv(csv)
console.log(json)
writeFileSync(outputFile, JSON.stringify(json, null, 2))
