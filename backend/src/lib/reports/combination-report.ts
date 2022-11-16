/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleSpreadsheetRow } from 'google-spreadsheet'
import { combinationNames, reportAttributes } from './definitions'
import { createDoc } from './reportUtils'

export interface Report {
  [key: string]: {
    [key: string]: string | number | boolean
  }[]
}

export async function generateCombinationReport (report: Report) {
  // FIXME it's just an example
  // the problem with this approach is, that google has rate limits
  // the google library has wrong typescript typings, which is annoying
  // the library: google-spreadsheet works for writing rows, loading Cells leads to error,
  // therefore formatting does not work with this library
  // -> output generation is rubbish

  // example: creating a new doc
  const doc = await createDoc(reportAttributes.combinationRank)

  for (const [combinationName, ranks] of Object.entries(report)) {
    const sheet = await doc.addSheet({ title: combinationNames[combinationName] })
    await sheet.setHeaderRow(Object.keys(ranks[0]))
    let row: GoogleSpreadsheetRow | null = null
    for (const rank of Object.values(ranks)) {
      row = await sheet.addRow(rank, { raw: false, insert: true })
    }
    await sheet.loadCells()
    // const rowIndex = row?.rowIndex || 1
    // FIXME it crashes on this line
    const c = sheet.getCellByA1('A1')
    // const c = await sheet.getCell(1, 1)
    c.value = 'hallo sheet'
    c.textFormat = { bold: true, fontSize: 16 }
    c.backgroundColor = { red: 255, green: 200, blue: 20, alpha: 50 }
    c.borders = {
      top: { style: 'SOLID', width: 2, color: { red: 0, green: 200, blue: 20, alpha: 50 }, colorStyle: { rgbColor: { red: 0, green: 200, blue: 20, alpha: 50 }, themeColor: 'TEXT' } },
      left: { style: 'SOLID', width: 2, color: { red: 0, green: 200, blue: 20, alpha: 50 }, colorStyle: { rgbColor: { red: 0, green: 200, blue: 20, alpha: 50 }, themeColor: 'TEXT' } },
      bottom: { style: 'SOLID', width: 2, color: { red: 0, green: 200, blue: 20, alpha: 50 }, colorStyle: { rgbColor: { red: 0, green: 200, blue: 20, alpha: 50 }, themeColor: 'TEXT' } },
      right: { style: 'SOLID', width: 2, color: { red: 0, green: 200, blue: 20, alpha: 50 }, colorStyle: { rgbColor: { red: 0, green: 200, blue: 20, alpha: 50 }, themeColor: 'TEXT' } }
    }
    const color = c.userEnteredFormat.backgroundColor
    console.log('color', color)
    const border = c.userEnteredFormat.borders
    console.log('color', border)
    await sheet.saveUpdatedCells()
  }

  // first sheet always exists
  const sheet = doc.sheetsByIndex[0]
  sheet.delete()
}
