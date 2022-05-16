import { calculate } from './service'

test('should work', async () => {
  const result = calculate({
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
