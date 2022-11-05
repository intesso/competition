import fs from 'fs'
import { resolve } from 'path'
import { parse, Options } from 'csv-parse'
import { parse as parseSync } from 'csv-parse/sync'
import { finished } from 'stream/promises'

export const readCsvFile = async (pathName: string, csvOptions = {} as Options) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const records: any[] = []
  const parser = fs
    .createReadStream(resolve(pathName))
    .pipe(parse(csvOptions))
  parser.on('readable', function () {
    let record; while ((record = parser.read()) !== null) {
    // Work with each record
      records.push(record)
    }
  })
  await finished(parser)
  return records
}

export const readCsv = <T>(csvInput: string) => {
  return parseSync(csvInput, {
    columns: true,
    skip_empty_lines: true
  }) as T
}
