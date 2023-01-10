#!/bin/bash 

# example usage:
# ./restore.sh dump_10-01-2023_09_40_30.sql

DUMP_FILE=$1
NEW_DB_NAME=competition

# cat your_dump.sql | docker exec -i your-db-container psql -U your-db-username -d dbname
cat $DUMP_FILE | docker exec -i competition-postgres psql -U competition -d $NEW_DB_NAME