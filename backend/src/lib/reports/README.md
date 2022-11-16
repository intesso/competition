# google sheet api reporting

  // the problem with this approach is, that google has rate limits
  // the google library has wrong typescript typings, which is annoying
  // the library: google-spreadsheet works for writing rows, loading Cells leads to error,
  // therefore formatting does not work with this library
  // -> output generation is rubbish

## google sheet api

used for reports:

- how to: https://developers.google.com/sheets/api/quickstart/nodejs
- create project: https://console.cloud.google.com/apis/dashboard?creatingProject=true&project=rope-skipping-swiss&supportedpurview=project
- enable api: https://console.cloud.google.com/apis/enableflow?apiid=sheets.googleapis.com&project=rope-skipping-swiss

if you run the application the first time, run this command to get a token:

```
ts-node src/lib/reports/google-auth.ts
```

## remove the following dependencies

> when not using google api

        "@google-cloud/local-auth": "^2.1.0",
        "google-spreadsheet": "^3.3.0",
        "googleapis": "^105.0.0",
        "@types/google-spreadsheet": "^3.3.0",
