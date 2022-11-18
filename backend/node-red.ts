import './dotenv'
import { createServer } from 'http'
import express from 'express'
import { init, httpAdmin, httpNode, start } from 'node-red'

// Create an Express app
const app = express()

// Add a simple route for static content served from 'public'
app.use('/', express.static('public'))

// Create a server
const server = createServer(app)

// Create the settings object - see default settings.js file for other options
const settings = {
  uiPort: parseInt(process.env.CALCULATION_ENGINE_UI_PORT || '1880'),
  uiHost: '0.0.0.0',
  httpAdminRoot: '/red',
  httpNodeRoot: '/api',
  userDir: 'engine/',
  nodesDir: 'nodes',
  flowFile: 'flows_competition.json',
  flowFilePretty: true,
  functionGlobalContext: {}, // enables global context
  credentialSecret: 'dunno-why'
}

// Initialise the runtime with a server and settings
init(server, settings)

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, httpAdmin)

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, httpNode)

server.listen(process.env.CALCULATION_ENGINE_PORT)

// Start the runtime
start()
