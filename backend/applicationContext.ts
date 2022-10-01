import { ICalculationContext } from './src/calculation/interfaces'
import { CalculationService } from './src/calculation/service'
import { IJudgingRuleContext } from './src/judging/interfaces'
import { JudgingRuleService } from './src/judging/service'
import { IPeopleContext } from './src/people/interfaces'
import { PeopleService } from './src/people/service'
import { ITournamentContext } from './src/tournament/interfaces'
import { TournamentService } from './src/tournament/service'

export interface IGetApplicationContext {
  getApplicationContext : () => IApplicationContext
}

export interface IApplicationContext {
  judging: IJudgingRuleContext
  tournament: ITournamentContext
  people: IPeopleContext
  calculation: ICalculationContext
}

export const applicationContext: IApplicationContext = {
  judging: new JudgingRuleService(getApplicationContext),
  tournament: new TournamentService(getApplicationContext),
  people: new PeopleService(getApplicationContext),
  calculation: new CalculationService(getApplicationContext)
}

export function getApplicationContext () {
  return applicationContext
}
