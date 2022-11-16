/* eslint-disable @typescript-eslint/no-explicit-any */
export const reportAttributes = {
  clubName: '',
  performerName: '',
  combinationName: '',
  performerNumber: 'Start Nummer',
  combinationRankPoints: '',
  combinationRank: 'Gesamtrangliste',
  categoryRank: ''
}

export const categoryNames = {
  'single-ü15-erso-speed-30sSingleRope': 'Ü15 Erso Single Rope 30s',
  'single-ü15-erso-speed-180sSingleRope': '',
  'single-ü15-erso-freestyle-singleRope': '',
  'single-ü15-beginners-speed-30sSingleRope': '',
  'single-ü15-beginners-speed-60sSingleRope': '',
  'single-ü15-beginners-speed-30sCrissCross': '',
  'single-ü15-beginners-compulsory-compulsory': '',
  'single-ü15-intermediate-speed-30sSingleRope': '',
  'single-ü15-intermediate-speed-60sSingleRope': '',
  'single-ü15-intermediate-speed-30sCrissCross': '',
  'single-ü15-intermediate-compulsory-compulsory': '',
  'single-ü15-advanced-speed-30sSingleRope': '',
  'single-ü15-advanced-speed-120sSingleRope': '',
  'single-ü15-advanced-freestyle-singleRope': '',
  'single-u15-beginners-speed-30sSingleRope': '',
  'single-u15-beginners-speed-60sSingleRope': '',
  'single-u15-beginners-speed-30sCrissCross': '',
  'single-u15-beginners-compulsory-compulsory': '',
  'single-u15-intermediate-speed-30sSingleRope': '',
  'single-u15-intermediate-speed-60sSingleRope': '',
  'single-u15-intermediate-speed-30sCrissCross': '',
  'single-u15-intermediate-compulsory-compulsory': '',
  'single-u15-advanced-speed-30sSingleRope': '',
  'single-u15-advanced-speed-120sSingleRope': '',
  'single-u15-advanced-freestyle-singleRope': '',
  'single-u12-beginners-speed-30sSingleRope': '',
  'single-u12-beginners-speed-60sSingleRope': '',
  'single-u12-beginners-speed-30sCrissCross': '',
  'single-u12-beginners-compulsory-compulsory': '',
  'single-u12-intermediate-speed-30sSingleRope': '',
  'single-u12-intermediate-speed-60sSingleRope': '',
  'single-u12-intermediate-speed-30sCrissCross': '',
  'single-u12-intermediate-compulsory-compulsory': '',
  'single-u12-advanced-speed-30sSingleRope': '',
  'single-u12-advanced-speed-120sSingleRope': '',
  'single-u12-advanced-freestyle-singleRope': '',
  'single-noAgeLimit-any-speed-tripleUnder': '',
  'team-noAgeLimit-erso-speed-doubleDutchRelay': '',
  'team-noAgeLimit-erso-speed-singleRopeRelay': '',
  'team-noAgeLimit-erso-freestyle-singleRopePair': '',
  'team-noAgeLimit-erso-freestyle-singleRopeTeam': '',
  'team-noAgeLimit-erso-freestyle-doubleDutchSingle': '',
  'team-ü21-teamShow-speed-doubleDutchRelay': '',
  'team-ü21-teamShow-speed-singleRopeRelay': '',
  'team-ü21-teamShow-teamShow-teamShow': '',
  'team-u21-teamShow-speed-doubleDutchRelay': '',
  'team-u21-teamShow-speed-singleRopeRelay': '',
  'team-u21-teamShow-teamShow-teamShow': '',
  'team-u15-teamShow-speed-doubleDutchRelay': '',
  'team-u15-teamShow-speed-singleRopeRelay': '',
  'team-u15-teamShow-teamShow-teamShow': '',
  'team-u12-teamShow-speed-doubleDutchRelay': '',
  'team-u12-teamShow-speed-singleRopeRelay': '',
  'team-u12-teamShow-teamShow-teamShow': ''
} as {[key: string]: string}

export const combinationNames = {
  'single-ü15-erso': 'Ü15 ERSO',
  'single-ü15-beginners': 'Ü15 Beginners',
  'single-ü15-intermediate': 'Ü15 Intermediate',
  'single-ü15-advanced': 'Ü15 Advanced',
  'single-u15-beginners': 'U15 Beginners',
  'single-u15-intermediate': 'U15 Intermediate',
  'single-u15-advanced': 'U15 Advanced',
  'single-u12-beginners': 'U12 Beginners',
  'single-u12-intermediate': 'U12 Intermediate',
  'single-u12-advanced': 'U12 Advanced',
  'single-tripleUnder': 'Triple Under',
  'team-erso': 'ERSO',
  'team-ü21-show': 'Ü21 Show',
  'team-u21-show': 'U21 Show',
  'team-u15-show': 'U15 Show',
  'team-u12-show': 'U12 Show'
} as {[key: string]: string}

export const combinationOrder = {
  'team-u15-show': {
    combinationName: 0,
    clubName: 1,
    performerNumber: 2,
    performerName: 3,
    'team-u15-teamShow-speed-singleRopeRelay': 4,
    'team-u15-teamShow-speed-doubleDutchRelay': 5,
    'team-u15-teamShow-teamShow-teamShow': 6,
    combinationRank: 7,
    combinationRankPoints: -1
  },
  'single-ü15-erso': {
    combinationName: 0,
    clubName: 1,
    performerNumber: 2,
    performerName: 3,
    'single-ü15-erso-speed-30sSingleRope': 4,
    'team-u15-teamShow-speed-doubleDutchRelay': 5,
    'team-u15-teamShow-teamShow-teamShow': 6,
    combinationRank: 7,
    combinationRankPoints: -1
  }
} as {[key: string]: {
  [key: string]: any
}}
