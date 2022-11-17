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

export function beautifyReportItems (name: string, items: ReportItemFormat[], orderLookup: ReportOrder, itemKeyLookup: ReportLookup) {
  const foundOrderLookup = orderLookup[name]
  if (!foundOrderLookup) { return items }

  return items.map(item => {
    const orderedRankEntries: [string, string | number][] = []
    const entries = Object.entries(item)
    entries.forEach(([key, value]) => {
      const index = foundOrderLookup[key]
      let beautifiedKey = itemKeyLookup[key] || key
      beautifiedKey = (reportAttributes as any)[beautifiedKey] || beautifiedKey
      beautifiedKey = (criteriaNames as any)[beautifiedKey] || beautifiedKey
      beautifiedKey = categoryNames[beautifiedKey] || beautifiedKey
      if (index >= 0) {
        orderedRankEntries[index] = [beautifiedKey, beautifyValue(key, value)]
      }
    })
    console.log('orderedRankEntries', orderedRankEntries)
    return Object.fromEntries(orderedRankEntries.filter(it => it))
  })
}

export function beautifyAttribute (key: string | number, attributeLookup: ReportLookup) {
  return attributeLookup[key] || key
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

export const criteriaNames = {
  speed: 'Speed',
  difficulty: 'Level',
  variation: 'Variation',
  presentation: 'Präsentation',
  deductions: 'Abzüge',
  difficultyAdvanced: 'Level',
  intermediate: 'Compulsory',
  beginners: 'Compulsory',
  tripleUnders: 'Triple Unders',
  presentationMusic: 'Präs. Musik',
  presentationCreativity: 'Präs. Kreativität'
}

export const categoryTitles: ReportLookup = {
  'single-ü15-erso-speed-30sSingleRope': 'ERSO Speed 30s',
  'single-ü15-erso-speed-180sSingleRope': 'ERSO Speed 180s',
  'single-ü15-erso-freestyle-singleRope': 'ERSO Freestyle',
  'single-ü15-beginners-speed-30sSingleRope': 'Beginners Ü15 Speed 30s',
  'single-ü15-beginners-speed-60sSingleRope': 'Beginners Ü15 Speed 60s',
  'single-ü15-beginners-speed-30sCrissCross': 'Beginners CrissCross 30s',
  'single-ü15-beginners-compulsory-compulsory': 'Beginners Compulsory',
  'single-ü15-intermediate-speed-30sSingleRope': 'Intermediate Ü15 Speed 30s',
  'single-ü15-intermediate-speed-60sSingleRope': 'Intermediate Ü15 Speed 60s',
  'single-ü15-intermediate-speed-30sCrissCross': 'Intermediate Ü15 CrissCross 30s',
  'single-ü15-intermediate-compulsory-compulsory': 'Intermediate Ü15 Compulsory',
  'single-ü15-advanced-speed-30sSingleRope': 'Advanced Ü15 Speed 30s',
  'single-ü15-advanced-speed-120sSingleRope': 'Advanced Ü15 Speed 120s',
  'single-ü15-advanced-freestyle-singleRope': 'Advanced Ü15 Freestyle',
  'single-u15-beginners-speed-30sSingleRope': 'Beginners U15 Speed 30s',
  'single-u15-beginners-speed-60sSingleRope': 'Beginners U15 Speed 60s',
  'single-u15-beginners-speed-30sCrissCross': 'Beginners U15 CrissCross 30s',
  'single-u15-beginners-compulsory-compulsory': 'Beginners U15 Compulsory',
  'single-u15-intermediate-speed-30sSingleRope': 'Intermediate U15 Speed 30s',
  'single-u15-intermediate-speed-60sSingleRope': 'Intermediate U15 Speed 60s',
  'single-u15-intermediate-speed-30sCrissCross': 'Intermediate U15 CrissCross 30s',
  'single-u15-intermediate-compulsory-compulsory': 'Intermediate U15 Compulsory',
  'single-u15-advanced-speed-30sSingleRope': 'Advanced U15 Speed 30s',
  'single-u15-advanced-speed-120sSingleRope': 'Advanced U15 Speed 120s',
  'single-u15-advanced-freestyle-singleRope': 'Advanced U15 Freestyle',
  'single-u12-beginners-speed-30sSingleRope': 'Beginners U12 Speed 30s',
  'single-u12-beginners-speed-60sSingleRope': 'Beginners U12 Speed 60s',
  'single-u12-beginners-speed-30sCrissCross': 'Beginners U12 CrissCross 30s',
  'single-u12-beginners-compulsory-compulsory': 'Beginners U12 Compulsory',
  'single-u12-intermediate-speed-30sSingleRope': 'Intermediate U12 Speed 30s',
  'single-u12-intermediate-speed-60sSingleRope': 'Intermediate U12 Speed 60s',
  'single-u12-intermediate-speed-30sCrissCross': 'Intermediate U12 CrissCross 30s',
  'single-u12-intermediate-compulsory-compulsory': 'Intermediate U12 Compulsory',
  'single-u12-advanced-speed-30sSingleRope': 'Advanced U12 Speed 30s',
  'single-u12-advanced-speed-120sSingleRope': 'Advanced U12 Speed 120s',
  'single-u12-advanced-freestyle-singleRope': 'Advanced U12 Freestyle',
  'single-noAgeLimit-any-speed-tripleUnder': 'Triple Unders',
  'team-noAgeLimit-erso-speed-doubleDutchRelay': 'ERSO DD Relay',
  'team-noAgeLimit-erso-speed-singleRopeRelay': 'ERSO SR Relay',
  'team-noAgeLimit-erso-freestyle-singleRopePair': 'ERSO SR Pair',
  'team-noAgeLimit-erso-freestyle-singleRopeTeam': 'ERSO SR Team',
  'team-noAgeLimit-erso-freestyle-doubleDutchSingle': 'ERSO DD Single',
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
  'team-u12-teamShow-teamShow-teamShow': 'SHOW U12 Show'
}

export function getCategoryName (key: string) {
  return categoryNames[key] || key
}

export const categoryNames: ReportLookup = {
  'single-ü15-erso-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-erso-speed-180sSingleRope': 'Speed 180s',
  'single-ü15-erso-freestyle-singleRope': 'Freestyle',
  'single-ü15-beginners-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-beginners-speed-60sSingleRope': 'Speed 60s',
  'single-ü15-beginners-speed-30sCrissCross': 'CrissCross 30s',
  'single-ü15-beginners-compulsory-compulsory': 'Compulsory',
  'single-ü15-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-ü15-intermediate-speed-30sCrissCross': 'CrissCross 30s',
  'single-ü15-intermediate-compulsory-compulsory': 'Compulsory',
  'single-ü15-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-ü15-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-ü15-advanced-freestyle-singleRope': 'Freestyle',
  'single-u15-beginners-speed-30sSingleRope': 'Speed 30s',
  'single-u15-beginners-speed-60sSingleRope': 'Speed 60s',
  'single-u15-beginners-speed-30sCrissCross': 'CrissCross 30s',
  'single-u15-beginners-compulsory-compulsory': 'Compulsory',
  'single-u15-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-u15-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-u15-intermediate-speed-30sCrissCross': 'CrissCross 30s',
  'single-u15-intermediate-compulsory-compulsory': 'Compulsory',
  'single-u15-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-u15-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-u15-advanced-freestyle-singleRope': 'Freestyle',
  'single-u12-beginners-speed-30sSingleRope': 'Speed 30s',
  'single-u12-beginners-speed-60sSingleRope': 'Speed 60s',
  'single-u12-beginners-speed-30sCrissCross': 'CrissCross 30s',
  'single-u12-beginners-compulsory-compulsory': 'Compulsory',
  'single-u12-intermediate-speed-30sSingleRope': 'Speed 30s',
  'single-u12-intermediate-speed-60sSingleRope': 'Speed 60s',
  'single-u12-intermediate-speed-30sCrissCross': 'CrissCross 30s',
  'single-u12-intermediate-compulsory-compulsory': 'Compulsory',
  'single-u12-advanced-speed-30sSingleRope': 'Speed 30s',
  'single-u12-advanced-speed-120sSingleRope': 'Speed 120s',
  'single-u12-advanced-freestyle-singleRope': 'Freestyle',
  'single-noAgeLimit-any-speed-tripleUnder': 'Triple Unders',
  'team-noAgeLimit-erso-speed-doubleDutchRelay': 'DD Relay',
  'team-noAgeLimit-erso-speed-singleRopeRelay': 'SR Relay',
  'team-noAgeLimit-erso-freestyle-singleRopePair': 'SR Pair',
  'team-noAgeLimit-erso-freestyle-singleRopeTeam': 'SR Team',
  'team-noAgeLimit-erso-freestyle-doubleDutchSingle': 'DD Single',
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
  'team-u12-teamShow-teamShow-teamShow': 'Show'
}

export function getCombinationName (key: string) {
  return combinationNames[key] || key
}

export const combinationNames: ReportLookup = {
  'single-ü15-erso': 'ERSO',
  'single-ü15-beginners': 'Beginners Ü15',
  'single-ü15-intermediate': 'Intermediate Ü15',
  'single-ü15-advanced': 'Advanced Ü15',
  'single-u15-beginners': 'Beginners U15',
  'single-u15-intermediate': 'Intermediate U15',
  'single-u15-advanced': 'Advanced U15',
  'single-u12-beginners': 'Beginners U12',
  'single-u12-intermediate': 'Intermediate U12',
  'single-u12-advanced': 'Advanced U12',
  'single-tripleUnder': 'Triple Unders',
  'team-erso': 'ERSO',
  'team-ü21-show': 'SHOW Ü21',
  'team-u21-show': 'SHOW U21',
  'team-u15-show': 'SHOW U15',
  'team-u12-show': 'SHOW U12'
}

export const categoryOrder: ReportOrder = {
  'team-noAgeLimit-erso-speed-singleRopeRelay': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'team-noAgeLimit-erso-speed-doubleDutchRelay': {
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
  'team-noAgeLimit-erso-freestyle-singleRopePair': {
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
  'team-noAgeLimit-erso-freestyle-singleRopeTeam': {
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
  'team-noAgeLimit-erso-freestyle-doubleDutchSingle': {
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
  'single-ü15-erso-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-erso-speed-180sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginners-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginners-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-ü15-beginners-speed-30sCrissCross': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginners-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginners-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u15-beginners-speed-30sCrissCross': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginners-speed-30sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-U12-beginners-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-beginners-speed-30sCrissCross': {
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
  'single-ü15-intermediate-speed-30sCrissCross': {
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
  'single-u15-intermediate-speed-30sCrissCross': {
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
  'single-U12-intermediate-speed-60sSingleRope': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
    categoryPoint: 4,
    categoryRank: 5
  },
  'single-u12-intermediate-speed-30sCrissCross': {
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
  'single-U12-advanced-speed-30sSingleRope': {
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
  'single-ü15-erso-freestyle-singleRope': {
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
  'single-ü15-beginners-compulsory-compulsory': {
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
  'End DUMMY': {
    categoryName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    speed: -1,
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
    'team-noAgeLimit-erso-speed-singleRopeRelay': 4,
    'team-noAgeLimit-erso-speed-doubleDutchRelay': 5,
    'team-noAgeLimit-erso-freestyle-singleRopePair': 6,
    'team-noAgeLimit-erso-freestyle-singleRopeTeam': 7,
    'team-noAgeLimit-erso-freestyle-doubleDutchSingle': 8,
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

  'single-ü15-erso': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-ü15-erso-speed-30sSingleRope': 4,
    'single-ü15-erso-speed-180sSingleRope': 5,
    'single-ü15-erso-freestyle-singleRope': 6,
    combinationRankPoints: 7,
    combinationRank: 8
  },
  'single-ü15-beginners': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-ü15-beginners-speed-30sSingleRope': 4,
    'single-ü15-beginners-speed-60sSingleRope': 5,
    'single-ü15-beginners-speed-30sCrissCross': 6,
    'single-ü15-beginners-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u15-beginners': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u15-beginners-speed-30sSingleRope': 4,
    'single-u15-beginners-speed-60sSingleRope': 5,
    'single-u15-beginners-speed-30sCrissCross': 6,
    'single-u15-beginners-compulsory-compulsory': 7,
    combinationRankPoints: 8,
    combinationRank: 9
  },
  'single-u12-beginners': {
    combinationName: 0,
    performerNumber: 1,
    performerName: 2,
    clubName: 3,
    'single-u12-beginners-speed-30sSingleRope': 4,
    'single-u12-beginners-speed-60sSingleRope': 5,
    'single-u12-beginners-speed-30sCrissCross': 6,
    'single-u12-beginners-compulsory-compulsory': 7,
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
    'single-ü15-intermediate-speed-30sCrissCross': 6,
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
    'single-u15-intermediate-speed-30sCrissCross': 6,
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
    'single-u12-intermediate-speed-30sCrissCross': 6,
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
    'team-noAgeLimit-erso-freestyle-singleRopeTeam': 0,
    'team-noAgeLimit-erso-freestyle-doubleDutchSingle': 1
  },
  'team-ü21-show': {
    'team-ü21-teamShow-teamShow-teamShow': 0,
    'team-ü21-teamShow-speed-singleRopeRelay': 1
  },
  'team-u21-show': {
    'team-u21-teamShow-teamShow-teamShow': 0,
    'team-u21-teamShow-speed-singleRopeRelay': 1
  },
  'team-u15-show': {
    'team-u15-teamShow-teamShow-teamShow': 0,
    'team-u15-teamShow-speed-singleRopeRelay': 1
  },
  'team-u12-show': {
    'team-u12-teamShow-teamShow-teamShow': 0,
    'team-u12-teamShow-speed-singleRopeRelay': 1
  },
  'single-ü15-erso': {
    'single-ü15-erso-freestyle-singleRope': 0,
    'single-ü15-erso-speed-30sSingleRope': 1
  },
  'single-ü15-beginners': {
    'single-ü15-beginners-compulsory-compulsory': 0,
    'single-ü15-beginners-speed-30sSingleRope': 1
  },
  'single-u15-beginners': {
    'single-u15-beginners-compulsory-compulsory': 0,
    'single-u15-beginners-speed-30sSingleRope': 1
  },
  'single-u12-beginners': {
    'single-u12-beginners-compulsory-compulsory': 0,
    'single-u12-beginners-speed-30sSingleRope': 1
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
  'Overall-winner-team-ü21-show-and-team-u21-show': {
    'teamShow-speed-singleRopeRelay': [
      'team-ü21-teamShow-speed-singleRopeRelay',
      'team-u21-teamShow-speed-singleRopeRelay'
    ],
    'teamShow-speed-doubleDutchRelay': [
      'team-ü21-teamShow-speed-doubleDutchRelay',
      'team-u21-teamShow-speed-doubleDutchRelay'
    ],
    'teamShow-teamShow-teamShow': ['team-ü21-teamShow-teamShow-teamShow', 'team-u21-teamShow-teamShow-teamShow']
  }
}