## postgres

```sh
docker volume create competition-postgres-data
docker run -itd -e POSTGRES_DB=competition -e POSTGRES_USER=competition -e POSTGRES_PASSWORD=comp1234 -p 5432:5432 -v competition-postgres-data:/var/lib/postgresql/data --name competition-postgres postgres
```