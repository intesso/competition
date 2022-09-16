/* eslint-disable camelcase */
import { Address, Club, db } from '../lib/db/database'
import { v4 as uuidv4 } from 'uuid'
import { Address_InsertParameters, Club_InsertParameters } from '../lib/db/__generated__'

// Address
export async function insertAddress ({
  street,
  houseNumber,
  zipCode,
  city,
  country
} : Omit<Address_InsertParameters, 'id'>) {
  const [address] = await Address(db).insert({
    id: uuidv4(),
    street,
    houseNumber,
    zipCode,
    city,
    country,
    createdAt: new Date()
  })
  return address
}

export async function updateAddress ({
  id,
  street,
  houseNumber,
  zipCode,
  city,
  country
} : Partial<Address_InsertParameters>) {
  const [updatedAddress] = await Address(db).update({
    id
  }, {
    id,
    street,
    houseNumber,
    zipCode,
    city,
    country
  })
  return updatedAddress
}

export async function findAddress ({
  id,
  street,
  houseNumber,
  zipCode,
  city,
  country
} : Partial<Address_InsertParameters>) {
  return await Address(db).findOne({
    id,
    street,
    houseNumber,
    zipCode,
    city,
    country
  })
}

export async function insertOrUpdateAddress ({
  id,
  street,
  houseNumber,
  zipCode,
  city,
  country
} : Address_InsertParameters) {
  const address = await findAddress({
    id,
    street,
    houseNumber,
    zipCode,
    city,
    country
  })
  if (address) {
    return await updateAddress({
      id: address.id,
      street: address.street,
      houseNumber: address.houseNumber,
      zipCode: address.zipCode,
      city: address.city,
      country: address.country
    })
  } else {
    const insertedAddress = await insertAddress({
      street,
      houseNumber,
      zipCode,
      city,
      country
    })
    return insertedAddress
  }
}

type ClubInsert = Omit<Club_InsertParameters, 'id'>
export async function insertOrUpdateClub ({
  name,
  associationId,
  addressId
} : ClubInsert) {
  const [club] = await Club(db).insertOrUpdate(['name'], {
    id: uuidv4(),
    name,
    associationId,
    addressId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  return club
}
