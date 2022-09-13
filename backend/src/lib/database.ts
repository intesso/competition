import createConnectionPool, { sql } from '@databases/pg'
const db = createConnectionPool(process.env.DB_CONNECTION)

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex)
  })
})

export { db, sql }
