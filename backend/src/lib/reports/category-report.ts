/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleSpreadsheetRow } from 'google-spreadsheet'
import { openDoc } from './reportUtils'

export interface Report {
  [key: string]: {
    [key: string]: string | number | boolean
  }[]
}

export async function generateCategoryReport (report: Report) {
  // FIXME it's just an example
  // the problem with this approach is, that google has rate limits
  // the google library has wrong typescript typings, which is annoying
  // the library: google-spreadsheet works for writing rows, loading Cells leads to error,
  // therefore formatting does not work with this library
  // -> output generation is rubbish

  // example: open existing doc and write into it
  const doc = await openDoc('1FiWWSuzg1SS28S-NIxmwepQ-O6lFw1V0v2ylkz2LppA')
  const sheet = doc.sheetsByTitle.Kategorien
  let rowIndex = 1

  for (const [combinationName, ranks] of Object.entries(report)) {
    await sheet.setHeaderRow(Object.keys(ranks[0]), rowIndex)
    sheet.addRow([combinationName])
    let row: GoogleSpreadsheetRow | null = null
    for (const rank of Object.values(ranks)) {
      row = await sheet.addRow(rank, { raw: false, insert: true })
    }
    rowIndex = (row?.rowIndex || rowIndex) + 10
    sheet.loadCells()

    await sheet.saveUpdatedCells()
  }
}
