import { Id } from '../lib/common'
import { Club as ClubDAO, Address as AddressDAO, Person as PersonDAO, ContactInformation as ContactInformationDAO } from '../lib/db/__generated__'

// Domain Types
export type Club = Omit<ClubDAO & AddressDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId'>
export type Person = Omit<PersonDAO & AddressDAO & ContactInformationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId' | 'clubId'| 'contactInformationId'> & Pick<Club, 'clubName'>
export type Athlete = Person
export type Judge = Person

// Interfaces (Ports)
export interface IPeopleContext {
  addClub: (club: Club) => Promise<Club & Id>
  addAthlete: <P extends Person>(athlete: P) => Promise<P & Id>
  addJudge: <P extends Person>(judge: P) => Promise<P & Id>
}
