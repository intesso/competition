import createConnectionPool, { sql, SQLQuery } from '@databases/pg'
import tables from '@databases/pg-typed'
import DatabaseSchema from '../../lib/db/__generated__'

let connectionsCount = 0
const startTimes = new Map<SQLQuery, number>()
const db = createConnectionPool({
  connectionString: process.env.DB_CONNECTION,
  bigIntMode: 'bigint',
  onConnectionOpened: () => {
    console.log(
      `Opened connection. Active connections = ${++connectionsCount}`
    )
  },
  onConnectionClosed: () => {
    console.log(
      `Closed connection. Active connections = ${--connectionsCount}`
    )
  },
  onQueryStart: (query) => {
    startTimes.set(query, Date.now())
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onQueryResults: (query, { text }, _result) => {
    const start = startTimes.get(query)
    startTimes.delete(query)

    if (start) {
      console.log(`${text} - ${Date.now() - start}ms`)
    } else {
      console.log(`${text} - uknown duration`)
    }
  },
  onQueryError: (query, { text }, err) => {
    startTimes.delete(query)
    console.log(`${text} - ${err.message}`)
  }

})

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex)
  })
})

export { db, sql }

// TODO when changing db tables, apply these changes here too.
const {
  Address,
  ContactInformation,
  Athlete,
  Judge,
  Person,
  Club,
  Tournament,
  TournamentAthlete,
  TournamentJudge,
  Slot,
  Location,
  Performance,
  Category,
  Combination,
  CategoryCombination,
  JudgingRule,
  Criteria,
  RawPoint
} = tables<DatabaseSchema>({
  databaseSchema: require('../../lib/db/__generated__/schema.json')
})
export {
  Address,
  ContactInformation,
  Athlete,
  Judge,
  Person,
  Club,
  Tournament,
  TournamentAthlete,
  TournamentJudge,
  Slot,
  Location,
  Performance,
  Category,
  Combination,
  CategoryCombination,
  JudgingRule,
  Criteria,
  RawPoint
}

// Utility functions
export function formatTimestamp (timestamp: Date) {
  return timestamp.toISOString()
}

export function parseTimestamp (timestamp: string) {
  return new Date(timestamp)
}
