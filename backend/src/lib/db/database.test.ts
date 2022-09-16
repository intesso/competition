
import dotenv from 'dotenv'
import { db, sql } from './database'
dotenv.config()

test('should read db columns', async () => {
  const result = await db.query(sql`
   SELECT 
  table_name, 
  column_name, 
  data_type 
FROM 
  information_schema.columns
`)
  expect(result).toBeDefined()
  expect(Object.keys(result[0])).toEqual(['table_name', 'column_name', 'data_type'])
})

afterAll(() => db.dispose())
