import axios from 'axios'
import { IGetApplicationContext } from '../../applicationContext'
import { CalculationInput, CalculationOutput, ICalculationContext } from './interfaces'

export class CalculationService implements ICalculationContext {
  getApplicationContext
  constructor (getApplicationContext : IGetApplicationContext['getApplicationContext']) {
    this.getApplicationContext = getApplicationContext
  }

  async calculate (input: CalculationInput): Promise<CalculationOutput> {
    const { data } = await axios.post(`${process.env.CALCULATION_ENGINE_URL}/api/engine/calculations`, input)
    return data
  }
}
