export enum ProfitCap {
  NONE,
  UNCAPPED,
  CAPPED_2X
}

export enum Participation {
  DEFAULT,
  NON_PARTICIPATING_1X,
  PARTICIPATING_1X
}

export interface LiquidationPreference {
  participation: Participation
  cap: ProfitCap
}

export enum Decision {
  UNKNOWN,
  COMMON_SHARE,
  EXIT
}

export enum Round {
  SERIES_C,
  SERIES_B,
  SERIES_A,
  COMMON
}

export interface InvestmentRound {
  id: string,
  round: Round,
  name: string,
  shares: number,
  investment: number,
  priority: number,
  liquidationPreference: LiquidationPreference,
  valuation: {
    preference: {
      participationValue: number,
       profitValue: {
         profit: number,
         capReached: false
       }
    },
    commonShareValue: number
  },
  roundExitValuation: number,
  decision: Decision
}

export interface Calculated{
  totalShares: number,
  totalInvested: number
}
