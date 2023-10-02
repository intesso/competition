# Data Management

> This is a quick overview of how to deal with data (input data, db, backup/restore)



## source files for definitions

- `google sheet` or `excel` files for definitions (example: https://docs.google.com/spreadsheets/d/1Ax-EIuKVjAHVa0QG8diFmNAYTSgnSU8DpqN1bcepXhg/edit?usp=sharing)

    rope-skipping Competition folder: https://drive.google.com/drive/folders/1nqsbfqPq71v_VZ8rc1NEBC53z-l4YrJj

- [./frontend/src/lib/reportDefinitions.ts](./frontend/src/lib/reportDefinitions.ts) (yes, that is ugly, but the pain to change it has not yet been high enough ;-) )


## data at runtime (input and output data)

- the data is stored in the postgresql database. you can use any postgres db tool e.g. dbeaver.
- the exception is [./frontend/src/lib/reportDefinitions.ts](./frontend/src/lib/reportDefinitions.ts) which is in the code.
- the RawPoints at runtime are additionally stored in json files in order to have a backup, if something would happen to the db. with the master-data and the RawPoints, all the Results can be recalculated.




# what to do when

**planning the tournament**

1. if master data has changed (change in categories etc.) -> follow: import master data
2. upload the new tournament -> follow: import tournament data


**just before the tournament**

1. update the current tournament: [backend/.env](backend/.env) 

    ```sh
    # get `tournamentName`s
    curl --location 'http://192.168.77.21:8080/api/tournaments' 
    CURRENT_TOURNAMENT=<name of the current tournament> # must correspond with one of the listed tournamentName
    ```

2. empty the backup folder (delete all json files, but leave the empty folder): [backend/backup](backend/backup)

**after the tournament**

1. copy the RawData backup data -> follow: backup RawPoints




# import process


## import master data

> NOTE: there is no update mechanism for masterdata yet, therefore you have to delete the db first!!! then you can start with the import again

0. DROP the whole schema (all data will be deleted!!!!): execute this script with the db tool e.g. dbeaver: backend/src/lib/db/reset.db.test.sql

1. export the excel sheets to csv (example: https://docs.google.com/spreadsheets/d/1Ax-EIuKVjAHVa0QG8diFmNAYTSgnSU8DpqN1bcepXhg/edit?usp=sharing)
2. copy the csv files to the master-data folder: [backend/src/lib/db-migrations/master-data/](backend/src/lib/db-migrations/master-data/)
    - [backend/src/lib/db-migrations/master-data/Category.csv](backend/src/lib/db-migrations/master-data/Category.csv)
    - [backend/src/lib/db-migrations/master-data/Combination.csv](backend/src/lib/db-migrations/master-data/Combination.csv)
    - [backend/src/lib/db-migrations/master-data/Criteria.csv](backend/src/lib/db-migrations/master-data/Criteria.csv)
    - [backend/src/lib/db-migrations/master-data/JudgingRule.csv](backend/src/lib/db-migrations/master-data/JudgingRule.csv)
3. update the reportDefinitions file: [./frontend/src/lib/reportDefinitions.ts](./frontend/src/lib/reportDefinitions.ts) 
4. if the reportsDefinitions have changed, run:

    ```sh
    cd backend
    npm run build
    cd ../frontend
    npm run build
    ```
5. generate the db schema/tables and data types:

    ```sh
    cd backend
    npm run generate
    ```



## import tournament data

> NOTE: tournament updates should be possible before the event without having to DROP the whole DB Schema


1. export the excel sheets to csv (example: https://docs.google.com/spreadsheets/d/1Ax-EIuKVjAHVa0QG8diFmNAYTSgnSU8DpqN1bcepXhg/edit?usp=sharing)
2. copy the Tournament.csv files to the dummy-data folder: [backend/src/lib/db-migrations/dummy-data/](backend/src/lib/db-migrations/dummy-data/)
    - [backend/src/lib/db-migrations/dummy-data/Tournament.csv](backend/src/lib/db-migrations/dummy-data/Tournament.csv)
3. to transform to json, run the script:

    ```sh
    cd backend/src/lib/db-migrations/dummy-data
    ts-node csv-to-json.ts Tournament.csv Tournament.json
    ```
4. upload the Tournament:

Note: the application must be running!

    ```sh
    # import Tournament.json data via postman test (-> POST body)
    # POST http://192.168.77.21:8080/api/tournaments/plan
    ```
5. upload other Tournament data e.g. for testing (repeat the previous step with other Tournament.json data)



## backup RawPoints

- the RawPoints at runtime are additionally automatically stored in json files (one for each RawPoint) in order to have a backup, if something would happen to the db. with the master-data and the RawPoints, all the Results can be recalculated.

Folder: [backend/backup](backend/backup)

1. zip the whole folder and rename it with the tournament name
2. copy the zip to a save location: e.g. https://drive.google.com/drive/folders/18_wugSlgD5wqF2gDvbTvUJ38ssNYPc9d




## restore RawPoints

> Precondition: master-data and tournament must be loaded.
> if the db is fresh, follow:
> - import master data
> - import tournament data

run this script:

```sh
cd backend
npm run restore
```