import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { Club, IPeopleContext, Person } from './interfaces'
import { insertAddress, insertAthlete, insertClub, insertJudge, insertPerson } from './repository'

export class PeopleService implements IPeopleContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async addClub (club: Club): Promise<Club & Id> {
    const address = await insertAddress({ street: club.street, houseNumber: club.houseNumber, zipCode: club.zipCode, city: club.city, country: club.country })
    const insertedClub = await insertClub({ addressId: address.id, clubName: club.clubName, associationId: club.associationId })
    return { ...club, id: insertedClub.id }
  }

  async addAthlete<P extends Person> (athlete: P): Promise<P & Id> {
    const person = await insertPerson(athlete)
    const insertedAthlete = await insertAthlete({ personId: person.id })
    return { ...athlete, id: insertedAthlete.id }
  }

  async addJudge<P extends Person> (judge: P): Promise<P & Id> {
    const person = await insertPerson(judge)
    const insertedJudge = await insertJudge({ personId: person.id })
    return { ...judge, id: insertedJudge.id }
  }
}
