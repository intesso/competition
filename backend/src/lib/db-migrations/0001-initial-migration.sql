-----------------------------------
-- People Contect -----------------
-----------------------------------
CREATE TABLE "Address" (
  id uuid NOT NULL,
  street text NOT NULL,
  "houseNumber" text NULL,
  "zipCode" text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "AddressPK" PRIMARY KEY (id)
);
CREATE TABLE "ContactInformation" (
  id uuid NOT NULL,
  "email" text NULL,
  "phone" text NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "ContactInformationPK" PRIMARY KEY (id)
);
CREATE TABLE "Club" (
  id uuid NOT NULL,
  "addressId" uuid NOT NULL,
  "name" text NOT NULL,
  "associationId" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "ClubPK" PRIMARY KEY (id),
  CONSTRAINT "ClubNameUnique" UNIQUE (name),
);
ALTER TABLE "Club"
ADD CONSTRAINT "ClubAddressFK" FOREIGN KEY ("addressId") REFERENCES "Address"(id);
CREATE TABLE "Person" (
  id uuid NOT NULL,
  "contactInformationId" uuid NULL,
  "clubId" uuid NULL,
  "clubHead" bool NULL,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  "gender" text NOT NULL,
  "birthDate" text NOT NULL,
  "licenseNumber" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "PersonPK" PRIMARY KEY (id)
);
ALTER TABLE "Person"
ADD CONSTRAINT "PersonContactInformationFK" FOREIGN KEY ("contactInformationId") REFERENCES "ContactInformation"(id);
ALTER TABLE "Person"
ADD CONSTRAINT "PersonClubFK" FOREIGN KEY ("clubId") REFERENCES "Club"(id);
CREATE TABLE "Athlete" (
  id uuid NOT NULL,
  "personId" uuid NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "AthletePK" PRIMARY KEY (id)
);
ALTER TABLE "Athlete"
ADD CONSTRAINT "AthletePersonFK" FOREIGN KEY ("personId") REFERENCES "Person"(id);
CREATE TABLE "Judge" (
  id uuid NOT NULL,
  "personId" uuid NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "JudgePK" PRIMARY KEY (id)
);
ALTER TABLE "Judge"
ADD CONSTRAINT "JudgePersonFK" FOREIGN KEY ("personId") REFERENCES "Person"(id);