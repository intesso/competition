/* eslint-disable camelcase */
import { address, db } from '../lib/db/database'
import { v4 as uuidv4 } from 'uuid'
import { Address_InsertParameters } from '../lib/db/__generated__/address'

type AddressInsert = Omit<Address_InsertParameters, 'id'>

export async function insertAddress ({
  street,
  houseNumber,
  zipCode,
  city,
  country
} : AddressInsert) {
  return await address(db).insert({
    id: uuidv4(),
    street,
    houseNumber,
    zipCode,
    city,
    country
  })
}
