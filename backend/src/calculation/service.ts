import { CalculationInput, CalculationOutput } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function calculate (_input: CalculationInput): CalculationOutput {
  return {
    complete: true,
    calculationType: 'FIXME',
    result: 123
  }
}
