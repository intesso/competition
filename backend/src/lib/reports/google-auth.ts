/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { promises as fs } from 'fs'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// credentials input file
const CREDENTIALS_PATH = join(__dirname, 'credentials.json')
// The output file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = join(__dirname, 'token.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist () {
  try {
    const content = await fs.readFile(TOKEN_PATH) as unknown as string
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials (client: any) {
  const content = await fs.readFile(CREDENTIALS_PATH) as unknown as string
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize () {
  const storedToken = await loadSavedCredentialsIfExist()
  if (storedToken) {
    return storedToken
  }
  const newToken = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  })
  if (newToken.credentials) {
    await saveCredentials(newToken)
  }
  return newToken
}

if (require.main === module) {
  authorize()
}
