# competition backend

## install

prerequisites: 

- install node.js LTS: https://nodejs.org/en/download/

open a terminal at this directory and run:

```sh
npm install
```


## start application

```sh
npm start
```

- https://nodejs.org/en/download/


## edit / test

- node-red (engine) is running at: http://localhost:8082/red
- backend at http://localhost:8081

(frontend runs at) http://localhost:8080

http://localhost:8080/admin/overview

expose for apps during testing:

```sh
npx localtunnel --subdomain intesso  --port 8080
https://intesso.loca.lt/admin/overview
```


## db setup

if needed first reset the existing db. check run the script: reset.db.test.sql

```sh
# generate db tables and master data
npm run generate:dbddl
# generate typescript db types
npm run generate:dbtypes
# insert dummy data manually:
npm start # in another terminal
ts-node src/lib/db-migrations/0003-insert-dummy-data.ts
```