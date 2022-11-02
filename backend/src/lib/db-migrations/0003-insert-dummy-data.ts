import '../../../dotenv'
import { spawnAsync } from '../common'
import { Category, db } from '../db/database'
import { join } from 'path'

// run postman collection with newman
// cli: https://learning.postman.com/docs/running-collections/using-newman-cli/newman-options/#request-options
// api: https://www.npmjs.com/package/newman#using-newman-as-a-library

const workingDir = join(__dirname, '/dummy-data')
console.log('newman workingDir', workingDir)

const insertTournamentStuffSingleCmd = `newman run ${workingDir}/competition-dummy-data.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --folder tournament-single --export-environment ${workingDir}/tmp.env.json`
const insertPerformanceSingleCmd = `newman run ${workingDir}/competition-dummy-data.postman_collection.json -e ${workingDir}/tmp.env.json --folder performances -d ${workingDir}/category-data-single.json`
const insertTournamentStuffTeamCmd = `newman run ${workingDir}/competition-dummy-data.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --folder tournament-team --export-environment ${workingDir}/tmp.env.json`
const insertPerformanceTeamCmd = `newman run ${workingDir}/competition-dummy-data.postman_collection.json -e ${workingDir}/tmp.env.json --folder performances -d ${workingDir}/category-data-team.json`

;(async function () {
  await Category(db).find().all()
  await spawnAsync(insertTournamentStuffSingleCmd)
  await spawnAsync(insertPerformanceSingleCmd)
  await spawnAsync(insertTournamentStuffTeamCmd)
  await spawnAsync(insertPerformanceTeamCmd)
  await db.dispose()
})()
