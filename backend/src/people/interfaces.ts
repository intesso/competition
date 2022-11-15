import { IGetApplicationContext } from '../../applicationContext'
import { Id } from '../lib/common'
import { Club as ClubDAO, Address as AddressDAO, Person as PersonDAO, ContactInformation as ContactInformationDAO } from '../lib/db/__generated__'

// Domain Types
export type AdressId = {addressId? : string | null}
export type Club = Omit<ClubDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'| 'addressId'> & AdressId
export type ClubWithAddress = Omit<ClubDAO & AddressDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy'>
export type Person = Omit<PersonDAO & AddressDAO & ContactInformationDAO, 'id'| 'updatedAt'| 'updatedBy'| 'createdAt'| 'createdBy' | 'addressId' | 'clubId'| 'contactInformationId'> & Pick<ClubWithAddress, 'clubName'>
export type Athlete = Person
export type Judge = Person

// Interfaces (Ports)
export interface IPeopleContext extends IGetApplicationContext {
  addClubWithAddress: (club: Omit<ClubWithAddress, 'id'>) => Promise<ClubWithAddress>
  addClub: (club: Club) => Promise<Club & Id>
  listClubs: () => Promise<(Club & Id)[]>
  getClubByName: (clubName: string) => Promise<(Club & Id) | null>
  getClubById: (id: string) => Promise<(Club & Id) | null>
  addAthlete: <P extends Person>(athlete: P) => Promise<P & Id>
  addJudge: <P extends Person>(judge: P) => Promise<P & Id>
}
