export interface CalculationInput {
  calculationType: string
  complete: boolean
  parameters: CalculationParameter[]
  judge: string
}

export interface CalculationParameter {
  type: string
  value: unknown
}

export interface CalculationOutput {
  calculationType: string
  result: unknown
  complete: boolean
}
