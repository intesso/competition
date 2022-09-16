
import { insertAddress } from '../../points/repository'
import dotenv from 'dotenv'
import { omit } from 'lodash-es'
dotenv.config()

test('should work', async () => {
  const result = await insertAddress({
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
  })
  const resultWithoutId = omit(result[0], 'id')
  expect(resultWithoutId).toEqual({ city: 'Dachsen', country: 'Schweiz', houseNumber: '5', street: 'Bahnhofstrasse', zipCode: '8447' })
})
