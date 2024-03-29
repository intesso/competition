/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import '../../../../dotenv'
import { promises as fs } from 'fs'
import { resolve } from 'path'
import { getApplicationContext } from '../../../../applicationContext'
import { RawPoint } from '../../db/__generated__'

// cd src/lib/db-migrations/restore
// ts-node restore-raw-points.ts ./backup

// it should reintroduce the rawpoints into the db

const backupDir = process.argv[2]

async function restore (backupDir: string) {
  const backupPath = resolve(process.cwd(), backupDir)
  console.log(`try restore backup from dir: ${backupPath}`)

  try {
    const files = await fs.readdir(backupPath)
    for (const fileName of files) {
      if (fileName.endsWith('.json')) {
        const filePath = resolve(backupPath, fileName)
        console.log(`  read file: ${filePath}`)
        const data: RawPoint = await readAndParseJsonFile(filePath)
        await getApplicationContext().judging.importRawPoints([data])
      }
    }
  } catch (error) {
    console.error(`ERROR: ${(error as any).message}`)
  }
}

async function readAndParseJsonFile (filePath: string) {
  const file = await fs.readFile(filePath, 'utf8')
  return JSON.parse(file)
}

restore(backupDir)
