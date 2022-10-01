import { getApplicationContext } from '../../applicationContext'
import { CalculationService } from './service'

// import childProcess from 'child_process'
// import { delay } from '../lib/common'

// let engine: childProcess.ChildProcessWithoutNullStreams
// beforeAll(async () => {
//   try {
//     engine = childProcess.spawn('npm run start:nodered', { detached: true })
//   } catch (e) {
//     console.error(e) // should contain code (exit code) and signal (that caused the termination).
//   }
//   return delay(3000)
// })

// afterAll(async () => {
//   if (engine && engine.pid) {
//     process.kill(-engine.pid)
//     return delay(1000)
//   }
// })

test('should work', async () => {
  const calculation = new CalculationService(getApplicationContext)
  const result = calculation.calculate({
    calculationType: 'U15 single speed',
    complete: true,
    parameters: [{
      type: 'faults',
      value: 3
    },
    {
      type: 'count',
      value: 3
    }],
    judge: 'Voll Schnell'
  })
  expect(result).toEqual({
    calculationType: 'U15 single speed',
    result: 0,
    complete: true
  })
})
