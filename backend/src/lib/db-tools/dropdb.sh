#!/bin/bash 

# example usage:
# ./dropdb.sh competition_restore

DB_NAME=$1

docker exec -t competition-postgres dropdb -U competition $DB_NAME
