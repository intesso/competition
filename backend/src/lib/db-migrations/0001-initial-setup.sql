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
  "phone" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "ContactInformationPK" PRIMARY KEY (id)
);
CREATE TABLE "Club" (
  id uuid NOT NULL,
  "addressId" uuid NOT NULL,
  "clubName" text NOT NULL,
  "associationId" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "ClubPK" PRIMARY KEY (id),
  CONSTRAINT "ClubNameUnique" UNIQUE ("clubName"),
  FOREIGN KEY ("addressId") REFERENCES "Address"(id)
);
CREATE TABLE "Person" (
  id uuid NOT NULL,
  "contactInformationId" uuid NULL,
  "addressId" uuid NULL,
  "clubId" uuid NULL,
  "clubHead" boolean NULL,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  "gender" text NOT NULL,
  "birthDate" timestamp NOT NULL,
  "licenseNumber" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "PersonPK" PRIMARY KEY (id),
  FOREIGN KEY ("contactInformationId") REFERENCES "ContactInformation"(id),
  FOREIGN KEY ("clubId") REFERENCES "Club"(id)
);
CREATE TABLE "Athlete" (
  id uuid NOT NULL,
  "personId" uuid NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "AthletePK" PRIMARY KEY (id),
  FOREIGN KEY ("personId") REFERENCES "Person"(id)
);
CREATE TABLE "Judge" (
  id uuid NOT NULL,
  "personId" uuid NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "JudgePK" PRIMARY KEY (id),
  FOREIGN KEY ("personId") REFERENCES "Person"(id)
);
-----------------------------------
-- Tournament Contect -------------
-----------------------------------
CREATE TABLE "TournamentAthlete" (
  id uuid NOT NULL,
  "athleteId" uuid NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "TournamentAthletePK" PRIMARY KEY (id),
  FOREIGN KEY ("athleteId") REFERENCES "Athlete"(id)
);
CREATE TABLE "TournamentJudge" (
  id uuid NOT NULL,
  "judgeId" uuid NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "TournamentJudgePK" PRIMARY KEY (id),
  FOREIGN KEY ("judgeId") REFERENCES "Judge"(id)
);
CREATE TABLE "Tournament" (
  id uuid NOT NULL,
  "addressId" uuid NULL,
  "tournamentName" text NOT NULL,
  "competition" text NULL,
  "tournamentStartTime" timestamp NOT NULL,
  "tournamentEndTime" timestamp NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "TournamentPK" PRIMARY KEY (id),
  CONSTRAINT "TournamentNameUnique" UNIQUE ("tournamentName"),
  FOREIGN KEY ("addressId") REFERENCES "Address"(id)
);
CREATE TABLE "Location" (
  id uuid NOT NULL,
  "tournamentId" uuid NOT NULL,
  "locationName" text NOT NULL,
  "locationCoordinates" jsonb NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "LocationPK" PRIMARY KEY (id),
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"(id),
  CONSTRAINT "LocationTournamentNameUnique" UNIQUE ("tournamentId", "locationName")
);
CREATE TABLE "Slot" (
  "slotNumber" int NOT NULL,
  "tournamentId" uuid NOT NULL,
  "slotName" text NULL,
  "slotStartTime" timestamp NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "SlotPK" PRIMARY KEY ("slotNumber", "tournamentId"),
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"(id)
);
CREATE TABLE "Performance" (
  id uuid NOT NULL,
  "tournamentId" uuid NOT NULL,
  "locationId" uuid NOT NULL,
  "clubId" uuid NOT NULL,
  "categoryId" uuid NOT NULL,
  "slotNumber" int NULL,
  "athletes" jsonb NOT NULL,
  "performanceName" text NOT NULL,
  "performanceNumber" int NULL,
  "performanceStartTime" timestamp NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "PerformancePK" PRIMARY KEY (id),
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"(id),
  FOREIGN KEY ("locationId") REFERENCES "Location"(id),
  FOREIGN KEY ("clubId") REFERENCES "Club"(id),
  -- Category is not yet created, therefore add the CONSTRAINT after Category is created
  -- FOREIGN KEY ("categoryId") REFERENCES "Category"(id),
  FOREIGN KEY ("slotNumber", "tournamentId") REFERENCES "Slot"("slotNumber", "tournamentId")
);
-----------------------------------
-- Judging Contect ----------------
-----------------------------------
CREATE TABLE "JudgingRule" (
  id uuid NOT NULL,
  "judgingRuleName" text NOT NULL,
  "judgingRuleDescription" text NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "JudgingRulePK" PRIMARY KEY (id),
  CONSTRAINT "JudgingRuleNameUnique" UNIQUE ("judgingRuleName")
);
CREATE TABLE "Category" (
  id uuid NOT NULL,
  "judgingRuleId" uuid NOT NULL,
  -- categoryName is the combination of the properties: competition-group-level-type-discipline
  "categoryName" text NOT NULL,
  "competition" text NOT NULL,
  "group" text NOT NULL,
  "level" text NOT NULL,
  "type" text NOT NULL,
  "discipline" text NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CategoryPK" PRIMARY KEY (id),
  CONSTRAINT "CategoryNameUnique" UNIQUE ("categoryName"),
  FOREIGN KEY ("judgingRuleId") REFERENCES "JudgingRule"(id)
);
-- add the yet missing categoryId Foreign key to Performance, because now it's there
ALTER TABLE "Performance"
ADD CONSTRAINT "PerformanceCategoryFK" FOREIGN KEY ("categoryId") REFERENCES "Category"(id);
-- end constraint
CREATE TABLE "Combination" (
  id uuid NOT NULL,
  "combinationName" text NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CombinationPK" PRIMARY KEY (id),
  CONSTRAINT "CombinationNameUnique" UNIQUE ("combinationName")
);
CREATE TABLE "CategoryCombination" (
  "categoryId" uuid NOT NULL,
  "combinationId" uuid NOT NULL,
  "categoryWeight" int NOT NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CategoryCombinationPK" PRIMARY KEY ("categoryId", "combinationId"),
  FOREIGN KEY ("categoryId") REFERENCES "Category"(id),
  FOREIGN KEY ("combinationId") REFERENCES "Combination"(id)
);
CREATE TABLE "Criteria" (
  id uuid NOT NULL,
  "judgingRuleId" uuid NOT NULL,
  "criteriaName" text NOT NULL,
  "subCriteriaDefinition" jsonb NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CriteriaPK" PRIMARY KEY (id),
  CONSTRAINT "CriteriaNameJudgingRuleUnique" UNIQUE ("criteriaName", "judgingRuleId"),
  FOREIGN KEY ("judgingRuleId") REFERENCES "JudgingRule"(id)
);
CREATE TABLE "RawPoint" (
  id uuid NOT NULL,
  "performanceId" uuid NOT NULL,
  "tournamentJudgeId" uuid NOT NULL,
  "criteriaId" uuid NOT NULL,
  "subCriteriaPoints" jsonb NULL,
  "timestamp" timestamp NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "RawPointPK" PRIMARY KEY (id),
  CONSTRAINT "RawPointPerformanceTournamentJudgeIdCriteriaUnique" UNIQUE (
    "performanceId",
    "tournamentJudgeId",
    "criteriaId"
  ),
  FOREIGN KEY ("performanceId") REFERENCES "Performance"(id),
  FOREIGN KEY ("tournamentJudgeId") REFERENCES "TournamentJudge"(id),
  FOREIGN KEY ("criteriaId") REFERENCES "Criteria"(id)
);
-----------------------------------
-- Rank Contect -------------------
-----------------------------------
CREATE TABLE "CategoryPoint" (
  id uuid NOT NULL,
  "performanceId" uuid NOT NULL,
  "categoryPoint" int NULL,
  "criteriaPoints" jsonb NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CategoryPointPK" PRIMARY KEY (id),
  FOREIGN KEY ("performanceId") REFERENCES "Performance"(id)
);
CREATE TABLE "CategoryRank" (
  id uuid NOT NULL,
  "categoryPointId" uuid NOT NULL,
  "categoryId" uuid NOT NULL,
  "rank" int NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CategoryRankPK" PRIMARY KEY (id),
  FOREIGN KEY ("categoryPointId") REFERENCES "CategoryPoint"(id),
  FOREIGN KEY ("categoryId") REFERENCES "Category"(id)
);
CREATE TABLE "CombinationRank" (
  id uuid NOT NULL,
  "categoryPointId" uuid NOT NULL,
  "combinationId" uuid NOT NULL,
  "rank" int NULL,
  "createdAt" timestamp NULL,
  "createdBy" text NULL,
  "updatedAt" timestamp NULL,
  "updatedBy" text NULL,
  CONSTRAINT "CombinationRankPK" PRIMARY KEY (id),
  FOREIGN KEY ("categoryPointId") REFERENCES "CategoryPoint"(id),
  FOREIGN KEY ("combinationId") REFERENCES "Combination"(id)
);