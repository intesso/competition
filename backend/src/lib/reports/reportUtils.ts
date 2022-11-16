/* eslint-disable no-new-wrappers */
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { authorize } from './google-auth'

export async function createDoc (title: string) {
  const auth = await authorize()
  const doc = new GoogleSpreadsheet()
  doc.useOAuth2Client(auth)
  await doc.createNewSpreadsheetDocument({ title })
  await doc.loadInfo()
  return doc
}

export async function openDoc (id: string) {
  const auth = await authorize()
  const doc = new GoogleSpreadsheet(id)
  doc.useOAuth2Client(auth)
  await doc.loadInfo()
  return doc
}

interface RGBColor {
  'red': number
  'green': number
  'blue': number
  'alpha': number
}

export function protoToCssColor (rgbColor: RGBColor) {
  const redFrac = rgbColor.red || 0.0
  const greenFrac = rgbColor.green || 0.0
  const blueFrac = rgbColor.blue || 0.0
  const red = Math.floor(redFrac * 255)
  const green = Math.floor(greenFrac * 255)
  const blue = Math.floor(blueFrac * 255)

  if (!('alpha' in rgbColor)) {
    return rgbToCssColor(red, green, blue)
  }

  const alphaFrac = rgbColor.alpha || 0.0
  const rgbParams = [red, green, blue].join(',')
  return ['rgba(', rgbParams, ',', alphaFrac, ')'].join('')
}

export function rgbToCssColor (red: number, green: number, blue: number) {
  const rgbNumber = new Number((red << 16) | (green << 8) | blue)
  const hexString = rgbNumber.toString(16)
  const missingZeros = 6 - hexString.length
  const resultBuilder = ['#']
  for (let i = 0; i < missingZeros; i++) {
    resultBuilder.push('0')
  }
  resultBuilder.push(hexString)
  return resultBuilder.join('')
}
