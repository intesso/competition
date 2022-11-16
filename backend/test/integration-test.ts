import '../dotenv'
import { spawnAsync } from '../src/lib/common'
import { db } from '../src/lib/db/database'

// run postman collection with newman
// cli: https://learning.postman.com/docs/running-collections/using-newman-cli/newman-options/#request-options
// api: https://www.npmjs.com/package/newman#using-newman-as-a-library

const workingDir = __dirname
console.log('newman workingDir', workingDir)

const copyEnv = `cp ${workingDir}/competition-local.postman_environment.json ${workingDir}/tmp.env.json`
const integrationTests = `newman run ${workingDir}/competition-tests.postman_collection.json -e ${workingDir}/competition-local.postman_environment.json --export-environment ${workingDir}/tmp.env.json`

;(async function () {
  await spawnAsync(copyEnv)
  await spawnAsync(integrationTests)
  await db.dispose()
})()
