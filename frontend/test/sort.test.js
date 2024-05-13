import { compareNatural } from '../src/lib/common'

it('should sort with natural order', () => {
  const judges = ['J 8', 'J 9', 'J 10', 'J 20', 'J 1', 'J 2', 'J 3', 'J 4', 'J 5', 'J 6', 'J 7']
  const sortedJudges = judges.sort(compareNatural)
  expect(sortedJudges).toEqual(['J 1', 'J 2', 'J 3', 'J 4', 'J 5', 'J 6', 'J 7', 'J 8', 'J 9', 'J 10', 'J 20'])
})
