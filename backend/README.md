# competition backend

## install


- install node.js LTS: https://nodejs.org/en/download/
- tested with: v16

open a terminal at this directory and run:

```sh
npm install
```


## start application

```sh
npm start
```

## setup system


```sh
# creates database schema, inserts masterdata, updates db
npm run generate:dbddl
# creates typescript types generated from db schema
npm run generate:dbtypes
# inserts test data (postman collection)
npm run test:data
# runs integration tests (postman collection)
npm run test:integration
```

## edit / test

- node-red (engine) is running at: http://localhost:8082/red
- backend at http://localhost:8080
- frontend (see: frontend [README.md](../frontend/README.md) )
- frontend in production modus: at http://localhost:8080/admin/overview
- frontend in dev modus: at http://localhost:8081/admin/overview


expose for apps during testing:

```sh
npx localtunnel --subdomain intesso  --port 8080
https://intesso.loca.lt/admin/overview
```

# docker setup

```sh
# https://docs.docker.com/engine/install/ubuntu/
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```



## db setup

install postgres (docker) with mounted volume

```sh
docker run -dit --restart unless-stopped -e POSTGRES_DB=competition -e POSTGRES_USER=competition -e POSTGRES_PASSWORD=comp1234 -p 5432:5432 -v competition-postgres-data:/var/lib/postgresql/data --name competition-postgres postgres

# set db connection
export DB_CONNECTION="postgres://competition:comp1234@localhost:5432/competition"
```

if needed first reset the existing db. check run the script: reset.db.test.sql

```sh
# generate db tables and master data
npm run generate:dbddl
# generate typescript db types
npm run generate:dbtypes
# start the application
npm start 

# insert dummy data manually (if needed) in another terminal:
ts-node src/lib/db-migrations/0003-insert-dummy-data.ts
```

## google sheet api

(reporting test, currently not in use)

- how to: https://developers.google.com/sheets/api/quickstart/nodejs
- create project: https://console.cloud.google.com/apis/dashboard?creatingProject=true&project=rope-skipping-swiss&supportedpurview=project
- enable api: https://console.cloud.google.com/apis/enableflow?apiid=sheets.googleapis.com&project=rope-skipping-swiss

if you run the application the first time, run this command to get a token:

```
ts-node src/lib/reports/google-auth.ts
```