import '../../../dotenv'
import { spawnAsync } from '../src/lib/common'
import { db } from '../src/lib/db/database'

// run postman collection with newman
// cli: https://learning.postman.com/docs/running-collections/using-newman-cli/newman-options/#request-options
// api: https://www.npmjs.com/package/newman#using-newman-as-a-library

const workingDir = __dirname
console.log('newman workingDir', workingDir)

const copyEnv = `cp ${workingDir}/competition-local.postman_environment.json ${workingDir}/tmp.env.json`
const test1 = `newman run ${workingDir}/competition.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --folder "Speed SR U15 A" --export-environment ${workingDir}/tmp.env.json`
const test2 = `newman run ${workingDir}/competition.postman_collection.json -e ${workingDir}/tmp.env.json --folder performances -d ${workingDir}/category-data-single.json`
const test3 = `newman run ${workingDir}/competition.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --folder tournament-team --export-environment ${workingDir}/tmp.env.json`
const test4 = `newman run ${workingDir}/competition.postman_collection.json -e ${workingDir}/tmp.env.json --folder performances -d ${workingDir}/category-data-team.json`

;(async function () {
  await spawnAsync(copyEnv)
  await spawnAsync(test1)
  await spawnAsync(test2)
  await spawnAsync(test3)
  await spawnAsync(test4)
  await db.dispose()
})()
