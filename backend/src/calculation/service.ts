import axios from 'axios'
import { CalculationInput, CalculationOutput } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function calculate (input: CalculationInput): Promise<CalculationOutput> {
  const { data } = await axios.post('http://localhost:8000/api/engine/calculations', input)
  return data
}
