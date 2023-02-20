import '../dotenv'
import { spawnAsync } from '../src/lib/common'
import { db } from '../src/lib/db/database'

// run postman collection with newman
// cli: https://learning.postman.com/docs/running-collections/using-newman-cli/newman-options/#request-options
// api: https://www.npmjs.com/package/newman#using-newman-as-a-library

const workingDir = __dirname
console.log('newman workingDir', workingDir)

const copyEnv = `cp ${workingDir}/competition-local.postman_environment.json ${workingDir}/tmp.env.json`
const integrationTests1 = `newman run ${workingDir}/competition-tests-single_Adv&ERSO.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --export-environment ${workingDir}/tmp.env.json`
const integrationTests2 = `newman run ${workingDir}/competition-tests-single_Beg&Interm.postman_collection.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --export-environment ${workingDir}/tmp.env.json`
const integrationTests3 = `newman run ${workingDir}/competition-tests-single_TripleUnder.postman_collection.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --export-environment ${workingDir}/tmp.env.json`
const integrationTests4 = `newman run ${workingDir}/competition-tests-team.postman_collection.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --export-environment ${workingDir}/tmp.env.json`

;(async function () {
  await spawnAsync(copyEnv)
  await spawnAsync(integrationTests1)
  await spawnAsync(integrationTests2)
  await spawnAsync(integrationTests3)
  await spawnAsync(integrationTests4)
  await db.dispose()
})()
