// import request from 'supertest'
import { app } from './app'

const mockListen = jest.fn()
app.listen = mockListen

afterEach(() => {
  mockListen.mockReset()
})

test('Server works', async () => {
  require('./server')
  expect(mockListen.mock.calls).toHaveLength(1)
  expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT)
})
