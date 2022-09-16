
import { insertAddress, insertOrUpdateClub } from './repository'
import dotenv from 'dotenv'
import { omit } from 'lodash-es'
import { db } from '../lib/db/database'
dotenv.config()

test('should read db columns', async () => {
  const address = await insertAddress({
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz',
    createdAt: new Date()
  })
  expect(omit(address, 'id', 'createdAt'))
    .toEqual({
      city: 'Dachsen',
      country: 'Schweiz',
      houseNumber: '5',
      street: 'Bahnhofstrasse',
      zipCode: '8447',
      createdBy: null,
      updatedAt: null,
      updatedBy: null
    })
  const club = await insertOrUpdateClub({
    name: 'SATUS Dachsen',
    addressId: address.id
  })
  expect(omit(club, 'id', 'createdAt', 'updatedAt'))
    .toEqual({
      name: 'SATUS Dachsen',
      addressId: address.id,
      associationId: null,
      createdBy: null,
      updatedBy: null
    })
})

afterAll(() => db.dispose())
