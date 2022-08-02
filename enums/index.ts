enum ProfitCap {
  NONE,
  UNCAPPED,
  CAPPED_2X
}

enum Participation {
  NON_PARTICIPATING_1X,
  PARTICIPATING_1X
}

export interface LiquidationPreference {
  participation: Participation
  cap: ProfitCap
}

export interface InvestmentRound {
  name: string,
  shares: number,
  investment: number,
  priority: number
}
