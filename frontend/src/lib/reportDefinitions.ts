import { toLower, upperFirst } from 'lodash'

export function snakeToPascal (text: string) {
  return text.split('-').map(str => upperFirst(toLower(str))).join(' ')
}

export function dedupe (text: string) {
  let memo = ''
  return text.split(' ').filter(it => {
    const keep = it !== memo
    memo = it
    return keep
  }).join(' ')
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportLookup {
  [key: string]: string
}

export type CategoryRank = ReportLookup
export type CombinationRank = ReportLookup

export interface ReportOrder {
  [key: string]: {
    [key: string]: number
  }
}

export interface CombinationMixed {
  [key: string]: {
    [key: string]: string[]
  }
}

export interface ReportFormat {
  [key: string]: ReportItemFormat[]
}

export interface ReportItemFormat {
  [key: string]: string | number
}

export function beautifyReportItems (name: string, items: ReportItemFormat[], orderLookup: ReportOrder, itemKeyLookup: ReportLookup, addMissing = false) {
  const foundOrderLookup = orderLookup[name]
  if (!foundOrderLookup) { return items }

  return items.map(item => {
    const orderedRankEntries: [string, string | number][] = []
    const missingEntries: [string, string | number][] = []
    const entries = Object.entries(item)
    entries.forEach(([key, value]) => {
      const index = foundOrderLookup[key]
      let beautifiedKey = itemKeyLookup[key] || key
      beautifiedKey = (reportAttributes as any)[beautifiedKey] || beautifiedKey
      beautifiedKey = (criteriaNames as any)[beautifiedKey] || beautifiedKey
      beautifiedKey = categoryNames[beautifiedKey] || beautifiedKey
      if (index >= 0) {
        orderedRankEntries[index] = [beautifiedKey, beautifyValue(key, value)]
      } else if (addMissing) {
        if (!['performanceName'].includes(key)) {
          missingEntries.push([beautifiedKey, beautifyValue(key, value)])
        }
      }
    })
    // console.log('orderedRankEntries', orderedRankEntries)
    return Object.fromEntries([
      ...orderedRankEntries.filter(it => it),
      ...missingEntries
    ])
  })
}

export function beautifyValue (key: string, value: string | number) {
  if (key === 'categoryName') {
    return beautifyAttribute(value, categoryNames)
  }
  if (key === 'combinationName') {
    return beautifyAttribute(value, combinationNames)
  }
  return value
}

export function beautifyAttribute (key: string | number, attributeLookup: ReportLookup) {
  return attributeLookup[key] || dedupe(snakeToPascal(key.toString()))
}

export const reportAttributes = {
  categoryName: 'Kategorie',
  clubName: 'Verein',
  performerName: 'Athlete/Team',
  combinationName: 'Kombination',
  performerNumber: 'StartNr.',
  combinationRankPoints: 'Rangpunkte TOTAL',
  combinationRank: 'Schlussrang',
  categoryRank: 'Rang',
  categoryRankPoints: 'Rangpunkte',
  categoryPoint: 'Punkte'
}

export const criteriaNames: ReportLookup = {
  speed: 'Speed',
  difficulty: 'Level',
  variation: 'Variation',
  presentation: 'Präsentation',
  deductions: 'Abzüge',
  intermediate: 'Compulsory',
  beginner: 'Compulsory',
  tripleUnder: 'Triple Under',
  presentationMusic: 'Präs. Musik',
  presentationCreativity: 'Präs. Kreativität'
}

export const categoryTitles: ReportLookup = {
  'single-men-erso-speed-30sSingleRope': 'ERSO Männer Speed 30s',
  'single-men-erso-speed-180sSingleRope': 'ERSO Männer Speed 180s',
  'single-men-erso-freestyle-singleRope': 'ERSO Männer Freestyle',
  'single-women-erso-speed-30sSingleRope': 'ERSO Frauen Speed 30s',
  'single-women-erso-speed-180sSingleRope': 'ERSO Frauen Speed 180s',
  'single-women-erso-freestyle-singleRope': 'ERSO Frauen Freestyle',
  'single-menEU-erso-speed-30sSingleRope': 'ERSO Männer EU Speed 30s',
  'single-menEU-erso-speed-180sSingleRope': 'ERSO Männer EU Speed 180s',
  'single-menEU-erso-freestyle-singleRope': 'ERSO Männer EU Freestyle',
  'single-womenEU-erso-speed-30sSingleRope': 'ERSO Frauen EU Speed 30s',
  'single-womenEU-erso-speed-180sSingleRope': 'ERSO Frauen EU Speed 180s',
  'single-womenEU-erso-freestyle-singleRope': 'ERSO Frauen EU Freestyle',
  'single-overallMen-erso-speed-30sSingleRope': 'ERSO Männer OVERALL Speed 30s',
  'single-overallMen-erso-speed-180sSingleRope': 'ERSO Männer OVERALL Speed 180s',
  'single-overallMen-erso-freestyle-singleRope': 'ERSO Männer OVERALL Freestyle',
  'single-overallWomen-erso-speed-30sSingleRope': 'ERSO Frauen OVERALL Speed 30s',
  'single-overallWomen-erso-speed-180sSingleRope': 'ERSO Frauen OVERALL Speed 180s',
  'single-overallWomen-erso-freestyle-singleRope': 'ERSO Frauen OVERALL Freestyle',
  'single-ü15-beginner-speed-30sSingleRope': 'Beginner Ü15 Speed 30s',
  'single-ü15-beginner-speed-60sSingleRope': 'Beginner Ü15 Speed 60s',
  'single-ü15-beginner-speed-30sCrissCross': 'Beginner Ü15 CrissCross 30s',
  'single-ü15-beginner-compulsory-compulsory': 'Beginner Ü15 Compulsory',
  'single-ü15-intermediate-speed-30sSingleRope': 'Intermediate Ü15 Speed 30s',
  'single-ü15-intermediate-speed-60sSingleRope': 'Intermediate Ü15 Speed 60s',
  'single-ü15-intermediate-speed-30sDoubleUnder': 'Intermediate Ü15 DoubleUnder 30s',
  'single-ü15-intermediate-compulsory-compulsory': 'Intermediate Ü15 Compulsory',
  'single-ü15-advanced-speed-30sSingleRope': 'Advanced Ü15 Speed 30s',
  'single-ü15-advanced-speed-120sSingleRope': 'Advanced Ü15 Speed 120s',
  'single-ü15-advanced-freestyle-singleRope': 'Advanced Ü15 Freestyle',
  'single-u15-beginner-speed-30sSingleRope': 'Beginner U15 Speed 30s',
  'single-u15-beginner-speed-60sSingleRope': 'Beginner U15 Speed 60s',
  'single-u15-beginner-speed-30sCrissCross': 'Beginner U15 CrissCross 30s',
  'single-u15-beginner-compulsory-compulsory': 'Beginner U15 Compulsory',
  'single-u15-intermediate-speed-30sSingleRope': 'Intermediate U15 Speed 30s',
  'single-u15-intermediate-speed-60sSingleRope': 'Intermediate U15 Speed 60s',
  'single-u15-intermediate-speed-30sDoubleUnder': 'Intermediate U15 DoubleUnder 30s',
  'single-u15-intermediate-compulsory-compulsory': 'Intermediate U15 Compulsory',
  'single-u15-advanced-speed-30sSingleRope': 'Advanced U15 Speed 30s',
  'single-u15-advanced-speed-120sSingleRope': 'Advanced U15 Speed 120s',
  'single-u15-advanced-freestyle-singleRope': 'Advanced U15 Freestyle',
  'single-u12-beginner-speed-30sSingleRope': 'Beginner U12 Speed 30s',
  'single-u12-beginner-speed-60sSingleRope': 'Beginner U12 Speed 60s',
  'single-u12-beginner-speed-30sCrissCross': 'Beginner U12 CrissCross 30s',
  'single-u12-beginner-compulsory-compulsory': 'Beginner U12 Compulsory',
  'single-u12-intermediate-speed-30sSingleRope': 'Intermediate U12 Speed 30s',
  'single-u12-intermediate-speed-60sSingleRope': 'Intermediate U12 Speed 60s',
  'single-u12-intermediate-speed-30sDoubleUnder': 'Intermediate U12 DoubleUnder 30s',
  'single-u12-intermediate-compulsory-compulsory': 'Intermediate U12 Compulsory',
  'single-u12-advanced-speed-30sSingleRope': 'Advanced U12 Speed 30s',
  'single-u12-advanced-speed-120sSingleRope': 'Advanced U12 Speed 120s',
  'single-u12-advanced-freestyle-singleRope': 'Advanced U12 Freestyle',
  'single-men-open-speed-tripleUnder': 'Triple Under Männer',
  'single-women-open-speed-tripleUnder': 'Triple Under Frauen',
  'team-open-erso-speed-doubleDutchRelay': 'ERSO DD Relay',
  'team-open-erso-speed-singleRopeRelay': 'ERSO SR Relay',
  'team-open-erso-freestyle-singleRopePair': 'ERSO SR Pair',
  'team-open-erso-freestyle-singleRopeTeam': 'ERSO SR Team',
  'team-open-erso-freestyle-doubleDutchSingle': 'ERSO DD Single',
  'team-openEU-erso-speed-doubleDutchRelay': 'ERSO EU DD Relay',
  'team-openEU-erso-speed-singleRopeRelay': 'ERSO EU SR Relay',
  'team-openEU-erso-freestyle-singleRopePair': 'ERSO EU SR Pair',
  'team-openEU-erso-freestyle-singleRopeTeam': 'ERSO EU SR Team',
  'team-openEU-erso-freestyle-doubleDutchSingle': 'ERSO EU DD Single',
  'team-overall-erso-speed-doubleDutchRelay': 'ERSO OVERALL DD Relay',
  'team-overall-erso-speed-singleRopeRelay': 'ERSO OVERALL SR Relay',
  'team-overall-erso-freestyle-singleRopePair': 'ERSO OVERALL SR Pair',
  'team-overall-erso-freestyle-singleRopeTeam': 'ERSO OVERALL SR Team',
  'team-overall-erso-freestyle-doubleDutchSingle': 'ERSO OVERALL DD Single',
  'team-ü21-teamShow-speed-doubleDutchRelay': 'SHOW Ü21 DD Relay',
  'team-ü21-teamShow-speed-singleRopeRelay': 'SHOW Ü21 SR Relay',
  'team-ü21-teamShow-teamShow-teamShow': 'SHOW Ü21 Show',
  'team-u21-teamShow-speed-doubleDutchRelay': 'SHOW U21 DD Relay',
  'team-u21-teamShow-speed-singleRopeRelay': 'SHOW U21 SR Relay',
  'team-u21-teamShow-teamShow-teamShow': 'SHOW U21 Show',
  'team-u15-teamShow-speed-doubleDutchRelay': 'SHOW U15 DD Relay',
  'team-u15-teamShow-speed-singleRopeRelay': 'SHOW U15 SR Relay',
  'team-u15-teamShow-teamShow-teamShow': 'SHOW U15 Show',
  'team-u12-teamShow-speed-doubleDutchRelay': 'SHOW U12 DD Relay',
  'team-u12-teamShow-speed-singleRopeRelay': 'SHOW U12 SR Relay',
  'team-u12-teamShow-teamShow-teamShow': 'SHOW U12 Show',
  'team-overall-teamShow-speed-singleRopeRelay': 'SHOW OVERALL SR RELAY',
  'team-overall-teamShow-speed-doubleDutchRelay': 'SHOW OVERALL DD RELAY',
  'team-overall-teamShow-teamShow-teamShow': 'SHOW OVERALL Show',
  'team-ü21-doubleUnder-speed-doubleUnderRelay': 'Ü21 DU Relay',
  'team-u21-doubleUnder-speed-doubleUnderRelay': 'U21 DU Relay',
  'team-u15-doubleUnder-speed-doubleUnderRelay': 'U15 DU Relay',
  'team-u12-doubleUnder-speed-doubleUnderRelay': 'U12 DU Relay'
}

export function getCategoryName (key: string) {
  return categoryNames[key] || key
}

export const categoryNames: ReportLookup = {
  'single-men-erso-speed-30sSingleRope': 'Speed 30s',
  'single-men-erso-speed-180sSingleRope': 'Speed 180s',
  'single-men-erso-freestyle-singleRope': 'Freestyle',
  'single-women-erso-speed-30sSingleRope': 'Speed 30s',
  'single-women-erso-speed-180sSingleRope': 'Speed 180s',
  'single-women-erso-freestyle-singleRope': 'Freestyle',
  'single-menEU-erso-speed-30sSingleRope': 'Speed 30s',
  'single-menEU-erso-speed-180sSingleRope': 'Speed 180s',
  'single-menEU-erso-freestyle-singleRope': 'Freestyle',
  'single-womenEU-erso-speed-30sSingleRope': 'Speed 30s',
  'single-womenEU-erso-speed-180sSingleRope': 'Speed 180s',
  'single-womenEU-erso-freestyle-singleRope': 'Freestyle',
  'single-overallMen-erso-speed-30sSingleRope': 'Speed 30s',
  'single-overallMen-erso-speed-180sSingleRope': 'Speed 180s',
  'single-overallMen-erso-freestyle-singleRope': 'Freestyle',
  'single-overallWomen-erso-speed-30sSingleRope': 'Speed 30s',
  'single-overallWomen-erso-speed-180sSingleRope': 'Speed 180s',
  'single-overallWomen-erso-freestyle-singleRope': 'Freestyle',
  'single-ü15-beginner-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-beginner-speed-60sSingleRope': 'Speed 60s',
  'single-ü15-beginner-speed-30sCrissCross': 'CrissCross 30s',
  'single-ü15-beginner-compulsory-compulsory': 'Compulsory',
  'single-ü15-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-ü15-intermediate-speed-30sDoubleUnder': 'DoubleUnder 30s',
  'single-ü15-intermediate-compulsory-compulsory': 'Compulsory',
  'single-ü15-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-ü15-advanced-freestyle-singleRope': 'Freestyle',
  'single-u15-beginner-speed-30sSingleRope': 'Speed 30s',
  'single-u15-beginner-speed-60sSingleRope': 'Speed 60s',
  'single-u15-beginner-speed-30sCrissCross': 'CrissCross 30s',
  'single-u15-beginner-compulsory-compulsory': 'Compulsory',
  'single-u15-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-u15-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-u15-intermediate-speed-30sDoubleUnder': 'DoubleUnder 30s',
  'single-u15-intermediate-compulsory-compulsory': 'Compulsory',
  'single-u15-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-u15-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-u15-advanced-freestyle-singleRope': 'Freestyle',
  'single-u12-beginner-speed-30sSingleRope': 'Speed 30s',
  'single-u12-beginner-speed-60sSingleRope': 'Speed 60s',
  'single-u12-beginner-speed-30sCrissCross': 'CrissCross 30s',
  'single-u12-beginner-compulsory-compulsory': 'Compulsory',
  'single-u12-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-u12-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-u12-intermediate-speed-30sDoubleUnder': 'DoubleUnder 30s',
  'single-u12-intermediate-compulsory-compulsory': 'Compulsory',
  'single-u12-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-u12-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-u12-advanced-freestyle-singleRope': 'Freestyle',
  'single-men-open-speed-tripleUnder': 'Triple Under',
  'single-women-open-speed-tripleUnder': 'Triple Under',
  'team-open-erso-speed-doubleDutchRelay': 'DD Relay',
  'team-open-erso-speed-singleRopeRelay': 'SR Relay',
  'team-open-erso-freestyle-singleRopePair': 'SR Pair',
  'team-open-erso-freestyle-singleRopeTeam': 'SR Team',
  'team-open-erso-freestyle-doubleDutchSingle': 'DD Single',
  'team-openEU-erso-speed-doubleDutchRelay': 'DD Relay',
  'team-openEU-erso-speed-singleRopeRelay': 'SR Relay',
  'team-openEU-erso-freestyle-singleRopePair': 'SR Pair',
  'team-openEU-erso-freestyle-singleRopeTeam': 'SR Team',
  'team-openEU-erso-freestyle-doubleDutchSingle': 'DD Single',
  'team-overall-erso-speed-doubleDutchRelay': 'DD Relay',
  'team-overall-erso-speed-singleRopeRelay': 'SR Relay',
  'team-overall-erso-freestyle-singleRopePair': 'SR Pair',
  'team-overall-erso-freestyle-singleRopeTeam': 'SR Team',
  'team-overall-erso-freestyle-doubleDutchSingle': 'DD Single',
  'team-ü21-teamShow-speed-doubleDutchRelay': 'DD Relay',
  'team-ü21-teamShow-speed-singleRopeRelay': 'SR Relay',
  'team-ü21-teamShow-teamShow-teamShow': 'Show',
  'team-u21-teamShow-speed-doubleDutchRelay': 'DD Relay',
  'team-u21-teamShow-speed-singleRopeRelay': 'SR Relay',
  'team-u21-teamShow-teamShow-teamShow': 'Show',
  'team-u15-teamShow-speed-doubleDutchRelay': 'DD Relay',
  'team-u15-teamShow-speed-singleRopeRelay': 'SR Relay',
  'team-u15-teamShow-teamShow-teamShow': 'Show',
  'team-u12-teamShow-speed-doubleDutchRelay': 'DD Relay',
  'team-u12-teamShow-speed-singleRopeRelay': 'SR Relay',
  'team-u12-teamShow-teamShow-teamShow': 'Show',
  'team-overall-teamShow-speed-singleRopeRelay': 'SR RELAY',
  'team-overall-teamShow-speed-doubleDutchRelay': 'DD RELAY',
  'team-overall-teamShow-teamShow-teamShow': 'Show',
  'team-ü21-doubleUnder-speed-doubleUnderRelay': 'DU Relay',
  'team-u21-doubleUnder-speed-doubleUnderRelay': 'DU Relay',
  'team-u15-doubleUnder-speed-doubleUnderRelay': 'DU Relay',
  'team-u12-doubleUnder-speed-doubleUnderRelay': 'DU Relay'

}

export function getCombinationName (key: string) {
  return combinationNames[key] || key
}

export const combinationNames: ReportLookup = {
  'single-men-erso': 'ERSO Männer',
  'single-women-erso': 'ERSO Frauen',
  'single-overallMen-erso': 'ERSO Männer OVERALL',
  'single-overallWomen-erso': 'ERSO Frauen OVERALL',
  'single-menEU-erso': 'ERSO Männer EU',
  'single-womenEU-erso': 'ERSO Frauen EU',
  'single-ü15-beginner': 'Beginner Ü15',
  'single-ü15-intermediate': 'Intermediate Ü15',
  'single-ü15-advanced': 'Advanced Ü15',
  'single-u15-beginner': 'Beginner U15',
  'single-u15-intermediate': 'Intermediate U15',
  'single-u15-advanced': 'Advanced U15',
  'single-u12-beginner': 'Beginner U12',
  'single-u12-intermediate': 'Intermediate U12',
  'single-u12-advanced': 'Advanced U12',
  'team-erso': 'ERSO',
  'team-ersoEU': 'ERSO EU',
  'team-overall-erso': 'ERSO OVERALL',
  'team-ü21-show': 'SHOW Ü21',
  'team-u21-show': 'SHOW U21',
  'team-overall-show': 'SHOW OVERALL',
  'team-u15-show': 'SHOW U15',
  'team-u12-show': 'SHOW U12'
}

export const categoryOrder: ReportOrder = {
  'team-open-erso-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-open-erso-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-openEU-erso-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-openEU-erso-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-ü21-teamShow-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-ü21-teamShow-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u21-teamShow-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u21-teamShow-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u15-teamShow-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u15-teamShow-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u12-teamShow-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u12-teamShow-speed-doubleDutchRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-open-erso-freestyle-singleRopePair': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-open-erso-freestyle-singleRopeTeam': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-open-erso-freestyle-doubleDutchSingle': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-openEU-erso-freestyle-singleRopePair': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-openEU-erso-freestyle-singleRopeTeam': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-openEU-erso-freestyle-doubleDutchSingle': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-ü21-teamShow-teamShow-teamShow': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentationCreativity: 4,
    presentationMusic: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-u21-teamShow-teamShow-teamShow': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentationCreativity: 4,
    presentationMusic: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-u15-teamShow-teamShow-teamShow': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentationCreativity: 4,
    presentationMusic: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-u12-teamShow-teamShow-teamShow': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentationCreativity: 4,
    presentationMusic: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'team-ü21-doubleUnder-speed-doubleUnderRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u21-doubleUnder-speed-doubleUnderRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u15-doubleUnder-speed-doubleUnderRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-u12-doubleUnder-speed-doubleUnderRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-men-erso-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-men-erso-speed-180sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-women-erso-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-women-erso-speed-180sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-menEU-erso-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-menEU-erso-speed-180sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-womenEU-erso-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-womenEU-erso-speed-180sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginner-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginner-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginner-speed-30sCrissCross': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginner-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginner-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginner-speed-30sCrissCross': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginner-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginner-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginner-speed-30sCrissCross': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-intermediate-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-intermediate-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-intermediate-speed-30sDoubleUnder': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-intermediate-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-intermediate-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-intermediate-speed-30sDoubleUnder': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-intermediate-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-intermediate-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-intermediate-speed-30sDoubleUnder': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-advanced-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-advanced-speed-120sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-advanced-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-advanced-speed-120sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-advanced-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-advanced-speed-120sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-men-open-speed-tripleUnder': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    tripleUnder: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-women-open-speed-tripleUnder': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    tripleUnder: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-men-erso-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-women-erso-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-menEU-erso-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-womenEU-erso-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-ü15-advanced-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-u15-advanced-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-u12-advanced-freestyle-singleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    presentation: 4,
    variation: 5,
    difficulty: 6,
    deductions: 7,
    categoryPoint: 8,
    categoryRank: 9
  },
  'single-ü15-beginner-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    beginner: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginner-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    beginner: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginner-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    beginner: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-intermediate-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    intermediate: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-intermediate-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    intermediate: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-intermediate-compulsory-compulsory': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    intermediate: -1,
    categoryPoint: 4,
    categoryRank: 5
  }
}

export const combinationOrder: ReportOrder = {
  'team-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-open-erso-speed-singleRopeRelay': 4,
    'team-open-erso-speed-doubleDutchRelay': 5,
    'team-open-erso-freestyle-singleRopePair': 6,
    'team-open-erso-freestyle-singleRopeTeam': 7,
    'team-open-erso-freestyle-doubleDutchSingle': 8,
    combinationRankPoints: 9,
    combinationRank: 10
  },
  'team-ersoEU': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-openEU-erso-speed-singleRopeRelay': 4,
    'team-openEU-erso-speed-doubleDutchRelay': 5,
    'team-openEU-erso-freestyle-singleRopePair': 6,
    'team-openEU-erso-freestyle-singleRopeTeam': 7,
    'team-openEU-erso-freestyle-doubleDutchSingle': 8,
    combinationRankPoints: 9,
    combinationRank: 10
  },
  'team-overall-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-overall-erso-speed-singleRopeRelay': 4,
    'team-overall-erso-speed-doubleDutchRelay': 5,
    'team-overall-erso-freestyle-singleRopePair': 6,
    'team-overall-erso-freestyle-singleRopeTeam': 7,
    'team-overall-erso-freestyle-doubleDutchSingle': 8,
    combinationRankPoints: 9,
    combinationRank: 10
  },
  'team-ü21-show': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-ü21-teamShow-speed-singleRopeRelay': 4,
    'team-ü21-teamShow-speed-doubleDutchRelay': 5,
    'team-ü21-teamShow-teamShow-teamShow': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'team-u21-show': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-u21-teamShow-speed-singleRopeRelay': 4,
    'team-u21-teamShow-speed-doubleDutchRelay': 5,
    'team-u21-teamShow-teamShow-teamShow': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'team-overall-show': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-overall-teamShow-speed-singleRopeRelay': 4,
    'team-overall-teamShow-speed-doubleDutchRelay': 5,
    'team-overall-teamShow-teamShow-teamShow': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'team-u15-show': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-u15-teamShow-speed-singleRopeRelay': 4,
    'team-u15-teamShow-speed-doubleDutchRelay': 5,
    'team-u15-teamShow-teamShow-teamShow': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'team-u12-show': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'team-u12-teamShow-speed-singleRopeRelay': 4,
    'team-u12-teamShow-speed-doubleDutchRelay': 5,
    'team-u12-teamShow-teamShow-teamShow': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-men-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-men-erso-speed-30sSingleRope': 4,
    'single-men-erso-speed-180sSingleRope': 5,
    'single-men-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-women-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-women-erso-speed-30sSingleRope': 4,
    'single-women-erso-speed-180sSingleRope': 5,
    'single-women-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-menEU-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-menEU-erso-speed-30sSingleRope': 4,
    'single-menEU-erso-speed-180sSingleRope': 5,
    'single-menEU-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-womenEU-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-womenEU-erso-speed-30sSingleRope': 4,
    'single-womenEU-erso-speed-180sSingleRope': 5,
    'single-womenEU-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-overallMen-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-overallMen-erso-speed-30sSingleRope': 4,
    'single-overallMen-erso-speed-180sSingleRope': 5,
    'single-overallMen-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-overallWomen-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-overallWomen-erso-speed-30sSingleRope': 4,
    'single-overallWomen-erso-speed-180sSingleRope': 5,
    'single-overallWomen-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-ü15-beginner': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-ü15-beginner-speed-30sSingleRope': 4,
    'single-ü15-beginner-speed-60sSingleRope': 5,
    'single-ü15-beginner-speed-30sCrissCross': 6,
    'single-ü15-beginner-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u15-beginner': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u15-beginner-speed-30sSingleRope': 4,
    'single-u15-beginner-speed-60sSingleRope': 5,
    'single-u15-beginner-speed-30sCrissCross': 6,
    'single-u15-beginner-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u12-beginner': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u12-beginner-speed-30sSingleRope': 4,
    'single-u12-beginner-speed-60sSingleRope': 5,
    'single-u12-beginner-speed-30sCrissCross': 6,
    'single-u12-beginner-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-ü15-intermediate': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-ü15-intermediate-speed-30sSingleRope': 4,
    'single-ü15-intermediate-speed-60sSingleRope': 5,
    'single-ü15-intermediate-speed-30sDoubleUnder': 6,
    'single-ü15-intermediate-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u15-intermediate': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u15-intermediate-speed-30sSingleRope': 4,
    'single-u15-intermediate-speed-60sSingleRope': 5,
    'single-u15-intermediate-speed-30sDoubleUnder': 6,
    'single-u15-intermediate-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u12-intermediate': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u12-intermediate-speed-30sSingleRope': 4,
    'single-u12-intermediate-speed-60sSingleRope': 5,
    'single-u12-intermediate-speed-30sDoubleUnder': 6,
    'single-u12-intermediate-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-ü15-advanced': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-ü15-advanced-speed-30sSingleRope': 4,
    'single-ü15-advanced-speed-120sSingleRope': 5,
    'single-ü15-advanced-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-u15-advanced': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u15-advanced-speed-30sSingleRope': 4,
    'single-u15-advanced-speed-120sSingleRope': 5,
    'single-u15-advanced-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-u12-advanced': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u12-advanced-speed-30sSingleRope': 4,
    'single-u12-advanced-speed-120sSingleRope': 5,
    'single-u12-advanced-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  }
}

export const combinationPriority: ReportOrder = {
  'team-erso': {
    'team-open-erso-freestyle-singleRopeTeam': 0,
    'team-open-erso-freestyle-doubleDutchSingle': 1
  },
  'team-ersoEU': {
    'team-openEU-erso-freestyle-singleRopeTeam': 0,
    'team-openEU-erso-freestyle-doubleDutchSingle': 1
  },
  'team-overall-erso': {
    'team-overall-erso-freestyle-singleRopeTeam': 0,
    'team-overall-erso-freestyle-doubleDutchSingle': 1
  },
  'team-ü21-show': {
    'team-ü21-teamShow-teamShow-teamShow': 0,
    'team-ü21-teamShow-speed-singleRopeRelay': 1
  },
  'team-u21-show': {
    'team-u21-teamShow-teamShow-teamShow': 0,
    'team-u21-teamShow-speed-singleRopeRelay': 1
  },
  'team-overall-show': {
    'team-overall-teamShow-teamShow-teamShow': 0,
    'team-overall-teamShow-speed-singleRopeRelay': 1
  },
  'team-u15-show': {
    'team-u15-teamShow-teamShow-teamShow': 0,
    'team-u15-teamShow-speed-singleRopeRelay': 1
  },
  'team-u12-show': {
    'team-u12-teamShow-teamShow-teamShow': 0,
    'team-u12-teamShow-speed-singleRopeRelay': 1
  },
  'single-men-erso': {
    'single-men-erso-freestyle-singleRope': 0,
    'single-men-erso-speed-30sSingleRope': 1
  },
  'single-women-erso': {
    'single-women-erso-freestyle-singleRope': 0,
    'single-women-erso-speed-30sSingleRope': 1
  },
  'single-menEU-erso': {
    'single-menEU-erso-freestyle-singleRope': 0,
    'single-menEU-erso-speed-30sSingleRope': 1
  },
  'single-womenEU-erso': {
    'single-womenEU-erso-freestyle-singleRope': 0,
    'single-womenEU-erso-speed-30sSingleRope': 1
  },
  'single-overallMen-erso': {
    'single-overallMen-erso-freestyle-singleRope': 0,
    'single-overallMen-erso-speed-30sSingleRope': 1
  },
  'single-overallWomen-erso': {
    'single-overallWomen-erso-freestyle-singleRope': 0,
    'single-overallWomen-erso-speed-30sSingleRope': 1
  },
  'single-ü15-beginner': {
    'single-ü15-beginner-compulsory-compulsory': 0,
    'single-ü15-beginner-speed-30sSingleRope': 1
  },
  'single-u15-beginner': {
    'single-u15-beginner-compulsory-compulsory': 0,
    'single-u15-beginner-speed-30sSingleRope': 1
  },
  'single-u12-beginner': {
    'single-u12-beginner-compulsory-compulsory': 0,
    'single-u12-beginner-speed-30sSingleRope': 1
  },
  'single-ü15-intermediate': {
    'single-ü15-intermediate-compulsory-compulsory': 0,
    'single-ü15-intermediate-speed-30sSingleRope': 1
  },
  'single-u15-intermediate': {
    'single-u15-intermediate-compulsory-compulsory': 0,
    'single-u15-intermediate-speed-30sSingleRope': 1
  },
  'single-u12-intermediate': {
    'single-u12-intermediate-compulsory-compulsory': 0,
    'single-u12-intermediate-speed-30sSingleRope': 1
  },
  'single-ü15-advanced': {
    'single-ü15-advanced-freestyle-singleRope': 0,
    'single-ü15-advanced-speed-30sSingleRope': 1
  },
  'single-u15-advanced': {
    'single-u15-advanced-freestyle-singleRope': 0,
    'single-u15-advanced-speed-30sSingleRope': 1
  },
  'single-u12-advanced': {
    'single-u12-advanced-freestyle-singleRope': 0,
    'single-u12-advanced-speed-30sSingleRope': 1
  }
}

export const combinationMixed: CombinationMixed = {
  'team-overall-show': {
    'team-overall-teamShow-speed-singleRopeRelay': [
      'team-ü21-teamShow-speed-singleRopeRelay',
      'team-u21-teamShow-speed-singleRopeRelay'
    ],
    'team-overall-teamShow-speed-doubleDutchRelay': [
      'team-ü21-teamShow-speed-doubleDutchRelay',
      'team-u21-teamShow-speed-doubleDutchRelay'
    ],
    'team-overall-teamShow-teamShow-teamShow': [
      'team-u21-teamShow-teamShow-teamShow',
      'team-ü21-teamShow-teamShow-teamShow'
    ],
    'team-overall-erso-speed-doubleDutchRelay': [
      'team-open-erso-speed-doubleDutchRelay',
      'team-openEU-erso-speed-doubleDutchRelay'
    ],
    'team-overall-erso-freestyle-singleRopePair': [
      'team-open-erso-freestyle-singleRopePair',
      'team-openEU-erso-freestyle-singleRopePair'
    ],
    'team-overall-erso-freestyle-singleRopeTeam': [
      'team-open-erso-freestyle-singleRopeTeam',
      'team-openEU-erso-freestyle-singleRopeTeam'
    ],
    'team-overall-erso-freestyle-doubleDutchSingle': [
      'team-open-erso-freestyle-doubleDutchSingle',
      'team-openEU-erso-freestyle-doubleDutchSingle'
    ]
  },
  'single-overallMen-erso': {
    'single-overallMen-erso-speed-30sSingleRope': [
      'single-men-erso-speed-30sSingleRope',
      'single-menEU-erso-speed-30sSingleRope'
    ],
    'single-overallMen-erso-speed-180sSingleRope': [
      'single-men-erso-speed-180sSingleRope',
      'single-menEU-erso-speed-180sSingleRope'
    ],
    'single-overallMen-erso-freestyle-singleRope': [
      'single-men-erso-freestyle-singleRope',
      'single-menEU-erso-freestyle-singleRope'
    ]
  },
  'single-overallWomen-erso': {
    'single-overallWomen-erso-speed-30sSingleRope': [
      'single-women-erso-speed-30sSingleRope',
      'single-womenEU-erso-speed-30sSingleRope'
    ],
    'single-overallWomen-erso-speed-180sSingleRope': [
      'single-women-erso-speed-180sSingleRope',
      'single-womenEU-erso-speed-180sSingleRope'
    ],
    'single-overallWomen-erso-freestyle-singleRope': [
      'single-women-erso-freestyle-singleRope',
      'single-womenEU-erso-freestyle-singleRope'
    ]
  }
}
