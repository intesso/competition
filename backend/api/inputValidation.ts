import inputValidation from 'openapi-validator-middleware'

inputValidation.init('api/openapi.json', { framework: 'koa' })

export { inputValidation }
