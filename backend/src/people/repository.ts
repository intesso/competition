/* eslint-disable camelcase */
import { Address, Athlete, Club, ContactInformation, db, Judge, Person } from '../lib/db/database'
import { v4 as uuidv4 } from 'uuid'
import { Address_InsertParameters, Athlete_InsertParameters, Club_InsertParameters, ContactInformation_InsertParameters, Judge_InsertParameters, Person_InsertParameters } from '../lib/db/__generated__'
import { newRecordAttributes } from '../lib/common'

// Address
export async function insertAddress ({
  street,
  houseNumber,
  zipCode,
  city,
  country
} : Omit<Address_InsertParameters, 'id'>) {
  const [address] = await Address(db).insert({
    street,
    houseNumber,
    zipCode,
    city,
    country,
    ...newRecordAttributes()
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

export async function findAddress (address : Partial<Address_InsertParameters>) {
  return (await Address(db).find(address).all())[0]
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

// Club
type ClubInsert = Omit<Club_InsertParameters, 'id'>

export async function insertClub ({
  addressId,
  clubName,
  associationId
} : ClubInsert) {
  const [club] = await Club(db).insert({
    clubName,
    associationId,
    addressId,
    ...newRecordAttributes()
  })
  return club
}

export async function insertOrUpdateClub ({
  clubName,
  associationId,
  addressId
} : ClubInsert) {
  const [club] = await Club(db).insertOrUpdate(['clubName'], {
    clubName,
    associationId,
    addressId,
    ...newRecordAttributes(),
    updatedAt: new Date()
  })
  return club
}

export async function findClubByName (clubName: string) {
  return await Club(db).findOne({ clubName })
}

export async function findClubs () {
  return await Club(db).find().all()
}

// ContactInformation
export async function insertContactInformation (contactInformation: Omit<ContactInformation_InsertParameters, 'id'>) {
  const [createdContactInformation] = await ContactInformation(db).insert({ ...contactInformation, ...newRecordAttributes() })
  return createdContactInformation
}

export async function findContactInformation (contactInformation: Omit<ContactInformation_InsertParameters, 'id'>) {
  return await (await ContactInformation(db).find(contactInformation).all()).at(0)
}

// Person
type PersonCombinedInsert = Omit<Person_InsertParameters & Partial<ContactInformation_InsertParameters> & Partial<Address_InsertParameters>, 'id' | 'contactInformationId' | 'clubId' | 'addressId'> & {clubName?: string}

export async function insertPerson (p: PersonCombinedInsert) {
  let club
  if (p.clubName) {
    club = await findClubByName(p.clubName)
  }
  const contactInformationParameters = { email: p.email, phone: p.phone }
  let contactInformation = await findContactInformation(contactInformationParameters)
  if (!contactInformation && (p.email || p.phone)) {
    contactInformation = await insertContactInformation(contactInformationParameters)
  }
  const addressParameters = { street: p.street, houseNumber: p.houseNumber, zipCode: p.zipCode, city: p.city, country: p.country }
  let address = await findAddress(addressParameters)

  if (!address && (Object.values(addressParameters).filter(it => it)).length) {
    if (addressParameters.street && addressParameters.zipCode && addressParameters.city && addressParameters.country) {
      address = await insertAddress(addressParameters as Address_InsertParameters)
    }
  }
  const person : Person_InsertParameters = {
    id: uuidv4(),
    clubId: club ? club?.id : null,
    clubHead: p.clubHead,
    contactInformationId: contactInformation ? contactInformation?.id : null,
    addressId: address ? address.id : null,
    birthDate: p.birthDate,
    firstName: p.firstName,
    gender: p.gender,
    lastName: p.lastName,
    licenseNumber: p.licenseNumber,
    createdAt: new Date()
  }
  const [insertedPerson] = await Person(db).insert(person)
  return insertedPerson
}

export async function insertAthlete (athlete: Omit<Athlete_InsertParameters, 'id'>) {
  const [insertedAthlete] = await Athlete(db).insert({ ...athlete, ...newRecordAttributes() })
  return insertedAthlete
}

export async function insertJudge (judge: Omit<Judge_InsertParameters, 'id'>) {
  const [insertedAthlete] = await Judge(db).insert({ ...judge, ...newRecordAttributes() })
  return insertedAthlete
}
