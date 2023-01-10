#!/bin/bash 

DB_NAME=competition

docker exec -t competition-postgres createdb -U competition $DB_NAME
