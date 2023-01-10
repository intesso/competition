# backup db

```sh
./backup.sh
```

-> creates dump_xxxxx.sql file


# restore db

depending on the use case, [./dropdb.sh](./dropdb.sh) or [./createdb.sh NEW_DB](./createdb.sh) first.

```sh
./restore.sh DUMP_FILE
```

Note: the db competition must already exist before running the restore command.


# restore raw points

raw points are stored in parallel (to the db) in json files, to have a second copy of the "real data" produced at a tournament. the results can always be recalculated based on the "master data" and the "raw points".

```sh
npm run restore
```