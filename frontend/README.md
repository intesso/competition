# Competition Frontend

built with the main frameworks: react & MUI

# Build & Run

## Development

- in development mode, auto refresh of pages on changes and source-maps are enabled.
- backend api calls are forwarded to the backend via proxy configuration [vite.config.ts](./vite.config.ts)

run:

```
npm run dev
```

- it starts the vite application at the port 8081
- `server` -> http://localhost:8081

## Production

run:

```sh
npm run build
```

- it builds the single page application (dist folder)
- it will be served by the backend, therefore no need to start the frontend separately for production
- `server` -> started via backend: http://localhost:8080

# Pages

**Admin Section Overview** 

<server>/admin/overview

e.g. http://


**Judging Section**

<server>/admin/select-raw-point

or :

http://localhost:8080/judging/start?tournamentName=Team%20SM%202022&id=J1

**Tournament Admin**

<server>/admin/tournament?admin=true