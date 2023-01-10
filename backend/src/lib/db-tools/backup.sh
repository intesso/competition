#!/bin/bash 

# docker exec -t your-db-container pg_dumpall -c -U your-db-username > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
docker exec -t competition-postgres pg_dumpall -c -U competition > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
