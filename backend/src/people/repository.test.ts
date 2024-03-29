/* eslint-disable camelcase */

import { findAddress, getClubByName, insertAddress, insertClub, insertOrUpdateClub, insertPerson } from './repository'
import { omit } from 'lodash'
import { db } from '../lib/db/database'
import { Person_InsertParameters } from '../lib/db/__generated__'

test('should insert/find address & club', async () => {
  const address = await insertAddress({
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
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

  const foundAddress = await findAddress({
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen'
  })
  expect(omit(foundAddress, 'id', 'createdAt'))
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

  const clubName = 'SATUS Dachsen ' + Math.random().toString()
  const club = await insertOrUpdateClub({
    clubName,
    addressId: address.id,
    associationId: '887766'
  })
  expect(omit(club, 'id', 'createdAt', 'updatedAt'))
    .toEqual({
      clubName,
      addressId: address.id,
      associationId: '887766',
      createdBy: null,
      updatedBy: null
    })

  const foundClub = await getClubByName(clubName)
  expect(omit(foundClub, 'id', 'createdAt', 'updatedAt'))
    .toEqual({
      clubName,
      addressId: address.id,
      associationId: '887766',
      createdBy: null,
      updatedBy: null
    })
})

test('should insert/find person & contactInformation & address & club', async () => {
  // insert club with club address first
  const clubName = 'SATUS Dachsen ' + Math.random().toString()
  const clubAddress = await insertAddress({
    street: 'Dorfstrasse',
    houseNumber: '3',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
  })

  const club = await insertClub({
    clubName,
    addressId: clubAddress.id,
    associationId: '12345678'
  })

  expect(omit(club, 'id', 'createdAt', 'updatedAt'))
    .toEqual({
      clubName,
      addressId: clubAddress.id,
      associationId: '12345678',
      createdBy: null,
      updatedBy: null
    })

  // prepare person related information

  const addressInformation = {
    street: 'Bahnhofstrasse',
    houseNumber: '5',
    zipCode: '8447',
    city: 'Dachsen',
    country: 'Schweiz'
  }

  const contactInformation = {
    email: 'andi.neck@intesso.com',
    phone: '0796543210'
  }

  const personInformation: Omit<Person_InsertParameters, 'id'> = {
    clubHead: true,
    firstName: 'Iris',
    lastName: 'Neck',
    gender: 'female',
    birthDate: new Date(1980, 1, 1),
    licenseNumber: '1234'
  }

  const person = await insertPerson({
    clubName, ...addressInformation, ...contactInformation, ...personInformation
  })

  expect(person.clubId).toBeTruthy()
  expect(person.contactInformationId).toBeTruthy()
  expect(person.addressId).toBeTruthy()

  expect(omit(person, 'id', 'createdAt', 'updatedAt', 'clubId', 'contactInformationId', 'addressId'))
    .toEqual({
      ...personInformation,
      createdBy: null,
      updatedBy: null
    })
})

afterAll(() => db.dispose())
