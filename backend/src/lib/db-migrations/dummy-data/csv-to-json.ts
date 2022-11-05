import { readCsv } from '../../db/csv-import'
import { readFileSync, writeFileSync } from 'fs'

const inputFile = process.argv[2]
const outputFile = process.argv[3]
const csv = readFileSync(inputFile, 'utf8')

const json = readCsv(csv)
console.log(json)
writeFileSync(outputFile, JSON.stringify(json, null, 2))
