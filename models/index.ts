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

export enum Round {
  SERIES_C,
  SERIES_B,
  SERIES_A,
  COMMON
}

export interface InvestmentRound {
  id: string,
  name: string,
  shares: number,
  investment: number,
  priority: number,
  liquidationPreference: LiquidationPreference,
  valuation: {
    preference: {
      participationValue: number,
      profitValue: number,
      capReached: boolean
    },
    commonShareValue: number
  },
  roundExitValuation: number
}

export interface Calculated{
  totalShares: number,
  totalInvested: number
}
