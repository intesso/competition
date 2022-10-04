import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { Club as ClubDAO, Address as AddressDAO, Person as PersonDAO, ContactInformation as ContactInformationDAO } from '../lib/db/__generated__'

// Domain Types
export type Club = ClubDAO
export type ClubWithAddress = Omit<ClubDAO & AddressDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type Person = Omit<PersonDAO & AddressDAO & ContactInformationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId' | 'clubId'| 'contactInformationId'> & Pick<ClubWithAddress, 'clubName'>
export type Athlete = Person
export type Judge = Person

// Interfaces (Ports)
export interface IPeopleContext extends IGetApplicationContext {
  addClub: (club: Omit<ClubWithAddress, 'id'>) => Promise<ClubWithAddress>
  listClubs: () => Promise<Club[]>
  addAthlete: <P extends Person>(athlete: P) => Promise<P & Id>
  addJudge: <P extends Person>(judge: P) => Promise<P & Id>
}
