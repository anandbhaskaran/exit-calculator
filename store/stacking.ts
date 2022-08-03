import webpack from 'webpack'
import { ActionTree, MutationTree } from 'vuex'
import { Calculated, Decision, InvestmentRound, Participation, ProfitCap, Round } from '~/models'
import Record = webpack.compilation.Record

export const state = () => ({
  investmentRounds: {
    [Round.SERIES_C]: {
      id: Round.SERIES_C,
      round: Round.SERIES_C,
      name: 'Preferred C',
      shares: 1500000,
      investment: 15000000,
      priority: 40,
      valuation: {
        preference: {
          participationValue: 0,
          profitValue: {
            profit: 0,
            capReached: false
          }
        },
        commonShareValue: 0
      },
      roundExitValuation: 0,
      decision: Decision.UNKNOWN,
      liquidationPreference: {
        participation: Participation.PARTICIPATING_1X,
        cap: ProfitCap.CAPPED_2X
      }
    },
    [Round.SERIES_B]: {
      id: Round.SERIES_B,
      round: Round.SERIES_B,
      name: 'Preferred B',
      shares: 300000,
      investment: 2100000,
      priority: 30,
      valuation: {
        preference: {
          participationValue: 0,
          profitValue: {
            profit: 0,
            capReached: false
          }
        },
        commonShareValue: 0
      },
      roundExitValuation: 0,
      decision: Decision.UNKNOWN,
      liquidationPreference: {
        participation: Participation.PARTICIPATING_1X,
        cap: ProfitCap.CAPPED_2X
      }
    },
    [Round.SERIES_A]: {
      id: Round.SERIES_A,
      round: Round.SERIES_A,
      name: 'Preferred A',
      shares: 200000,
      investment: 900000,
      priority: 20,
      valuation: {
        preference: {
          participationValue: 0,
          profitValue: {
            profit: 0,
            capReached: false
          }
        },
        commonShareValue: 0
      },
      roundExitValuation: 0,
      decision: Decision.UNKNOWN,
      liquidationPreference: {
        participation: Participation.PARTICIPATING_1X,
        cap: ProfitCap.CAPPED_2X
      }
    },
    [Round.COMMON]: {
      id: Round.COMMON,
      round: Round.COMMON,
      name: 'Common',
      shares: 1000000,
      investment: 0,
      priority: 10,
      valuation: {
        preference: {
          participationValue: 0,
          profitValue: {
            profit: 0,
            capReached: false
          }
        },
        commonShareValue: 0
      },
      roundExitValuation: 0,
      decision: Decision.UNKNOWN,
      liquidationPreference: {
        participation: Participation.DEFAULT,
        cap: ProfitCap.UNCAPPED
      }
    }
  } as Record,
  calculated: {
    totalShares: 0,
    totalInvested: 0
  } as Calculated
})

export type StackingState = ReturnType<typeof state>;

export const getters = {
  investmentRounds (state: StackingState) {
    return state.investmentRounds
  },
  roundsToBeComputed (state: StackingState) {
    return Object.values(state.investmentRounds).filter((round: InvestmentRound) => round.liquidationPreference.participation !== Participation.NON_PARTICIPATING_1X && !round.valuation.preference.profitValue.capReached)
  }
}
export const mutations: MutationTree<StackingState> = {
  computeCalculated (state:StackingState) {
    let totalShares = 0
    let totalInvested = 0
    // Count the total
    Object.entries(state.investmentRounds).forEach(([key, value]) => {
      // @ts-ignore
      Object.assign(state.investmentRounds[key], {
        valuation: {
          preference: {
            participationValue: 0,
            profitValue: {
              profit: 0,
              capReached: false
            }
          },
          commonShareValue: 0
        },
        roundExitValuation: 0,
        decision: Decision.UNKNOWN
      })
      totalInvested += value.investment
      totalShares += value.shares
    })

    state.calculated.totalShares = totalShares
    state.calculated.totalInvested = totalInvested
  },
  updateParticipationReturn (state: StackingState, participationReturn) {
    // @ts-ignore
    state.investmentRounds[participationReturn.roundId].valuation.preference.participationValue = participationReturn.valuation
  },
  updateProfitReturn (state: StackingState, profitReturn) {
    // @ts-ignore
    state.investmentRounds[profitReturn.roundId].valuation.preference.profitValue.profit = profitReturn.valuation
  },
  updateCommonShareReturn (state: StackingState, commonShareReturn) {
    // @ts-ignore
    state.investmentRounds[commonShareReturn.roundId].valuation.commonShareValue = commonShareReturn.valuation
  },
  updateFinalReturn (state: StackingState, finalShareReturn) {
    // @ts-ignore
    state.investmentRounds[finalShareReturn.roundId].roundExitValuation = finalShareReturn.valuation
    // @ts-ignore
    state.investmentRounds[finalShareReturn.roundId].decision = finalShareReturn.decision
  },
  updateCapReached (state: StackingState, capStatus) {
    // @ts-ignore
    state.investmentRounds[capStatus.roundId].valuation.preference.profitValue.capReached = capStatus.value
  }
}

export const actions: ActionTree<StackingState, any> = {
  calculateExit ({
    commit,
    state
  }, exitValuationString: string) {
    commit('computeCalculated')
    commit('reset')

    let remainingShares = state.calculated.totalShares
    const exitValuation = parseFloat(exitValuationString)
    let remainingValuation = exitValuation
    function getBaseReturn (investmentRound: InvestmentRound, remainingValuation: number) {
      let baseValue: number = 0
      if (investmentRound.liquidationPreference.participation === Participation.NON_PARTICIPATING_1X ||
        investmentRound.liquidationPreference.participation === Participation.PARTICIPATING_1X) {
        if (remainingValuation > investmentRound.investment) {
          baseValue = investmentRound.investment
        } else {
          baseValue = remainingValuation
        }
      }
      // Add again for profit
      return baseValue
    }

    // Assuming state.investmentRounds is sorted based on the priority
    Object.entries(state.investmentRounds).forEach(([roundId, value]) => {
      const baseExitValuation = getBaseReturn(value, remainingValuation)
      remainingValuation -= baseExitValuation
      commit('updateParticipationReturn', {
        roundId,
        valuation: baseExitValuation
      })
    })

    function getProfitExitValuation (investmentRound: InvestmentRound, remainingValuation: number, remainingShares: number) {
      let profit = remainingValuation * (investmentRound.shares / remainingShares)
      // No return for non participating members
      if (investmentRound.liquidationPreference.participation === Participation.NON_PARTICIPATING_1X) {
        profit = 0
      }

      let capReached = false
      // Cap the return
      if (investmentRound.liquidationPreference.cap === ProfitCap.CAPPED_2X &&
        investmentRound.valuation.preference.participationValue + profit > investmentRound.investment * 2) {
        capReached = true
        commit('updateCapReached', {
          roundId: investmentRound.id,
          value: capReached
        })
        profit = investmentRound.investment * 2 - investmentRound.valuation.preference.participationValue
      }
      return {
        profit,
        capReached
      }
    }

    function getRoundsToBeComputed (rounds: InvestmentRound) {
      return Object.values(rounds).filter((round: InvestmentRound) => round.liquidationPreference.participation !== Participation.NON_PARTICIPATING_1X && !round.valuation.preference.profitValue.capReached)
    }

    let anyRoundReachedCap = false

    function getComputedRounds (rounds: InvestmentRound) {
      return Object.values(rounds).filter((round: InvestmentRound) => round.liquidationPreference.participation === Participation.NON_PARTICIPATING_1X || round.valuation.preference.profitValue.capReached)
    }

    function getRemainingValuation (exitValue: number, rounds: InvestmentRound) {
      return exitValue -
          getComputedRounds(rounds).reduce((acc, obj) => {
            return acc + obj.valuation.preference.participationValue + obj.valuation.preference.profitValue.profit
          }, 0) -
          getRoundsToBeComputed(rounds).reduce((acc, obj) => {
            return acc + obj.valuation.preference.participationValue
          }, 0)
    }

    function getRemainingShares (rounds: InvestmentRound) {
      return getRoundsToBeComputed(rounds).reduce((acc, obj) => {
        return acc + obj.shares
      }, 0)
    }

    do {
      anyRoundReachedCap = false
      const calculateProfit: InvestmentRound[] = []
      // @ts-ignore
      remainingValuation = getRemainingValuation(exitValuation, state.investmentRounds)
      // @ts-ignore
      remainingShares = getRemainingShares(state.investmentRounds)
      // @ts-ignore
      calculateProfit.push(...getRoundsToBeComputed(state.investmentRounds))
      calculateProfit.forEach((investmentRound) => {
        const profitExitValuation = getProfitExitValuation(investmentRound, remainingValuation, remainingShares)
        remainingValuation -= profitExitValuation.profit
        remainingShares -= investmentRound.shares
        commit('updateProfitReturn', {
          roundId: investmentRound.id,
          valuation: profitExitValuation.profit
        })

        anyRoundReachedCap = anyRoundReachedCap || profitExitValuation.capReached
      })
    } while (anyRoundReachedCap)

    let commonShareRemainingValuation = exitValuation
    let commonShareRemainingShares = state.calculated.totalShares

    function getCommonShareReturn (investmentRound: InvestmentRound, commonShareRemainingValuation: number, commonShareRemainingShares: number) {
      return commonShareRemainingValuation * (investmentRound.shares / commonShareRemainingShares)
    }

    let anyRoundExited = false

    function getProspectiveTotalCommonRounds (rounds: InvestmentRound) {
      return Object.values(rounds).filter((round: InvestmentRound) => round.decision === Decision.UNKNOWN || round.decision === Decision.COMMON_SHARE)
    }

    function getExitedRounds (rounds: InvestmentRound) {
      return Object.values(rounds).filter((round: InvestmentRound) => round.decision === Decision.EXIT)
    }

    function getUncomputedCommonRounds (rounds: InvestmentRound) : InvestmentRound[] {
      return Object.values(rounds).filter((round: InvestmentRound) => round.decision === Decision.UNKNOWN)
    }

    function getProspectiveTotalCommonShares (investmentRounds: webpack.compilation.Record) {
      // @ts-ignore
      return getProspectiveTotalCommonRounds(investmentRounds).reduce((acc, obj) => {
        return acc + obj.shares
      }, 0)
    }

    function getProspectiveTotalValuvation (exitValuation: number, investmentRounds: webpack.compilation.Record) {
      // @ts-ignore
      return exitValuation - getExitedRounds(investmentRounds).reduce((acc, obj) => {
        return acc + obj.valuation.preference.profitValue.profit + obj.valuation.preference.participationValue
      }, 0)
    }

    do {
      // debugger
      anyRoundExited = false
      commonShareRemainingShares = getProspectiveTotalCommonShares(state.investmentRounds)
      commonShareRemainingValuation = getProspectiveTotalValuvation(exitValuation, state.investmentRounds)
      // Assuming state.investmentRounds is sorted based on the priority
      // Calculate the common share return and choose the best one
      // @ts-ignore
      for (const investmentRound of getUncomputedCommonRounds(state.investmentRounds)) {
        const commonShareExitValuation = getCommonShareReturn(investmentRound, commonShareRemainingValuation, commonShareRemainingShares)
        const preferredExitValuation = investmentRound.valuation.preference.participationValue + investmentRound.valuation.preference.profitValue.profit
        commit('updateCommonShareReturn', {
          roundId: investmentRound.id,
          valuation: commonShareExitValuation
        })

        let finalReturn: number
        let decision: Decision
        if (commonShareExitValuation >= preferredExitValuation || investmentRound.round === Round.COMMON) {
          commonShareRemainingShares -= investmentRound.shares
          finalReturn = commonShareExitValuation
          decision = Decision.COMMON_SHARE
        } else {
          finalReturn = preferredExitValuation
          anyRoundExited = true
          decision = Decision.EXIT
          commit('updateFinalReturn', {
            roundId: investmentRound.id,
            valuation: finalReturn,
            decision
          })
          break
        }
        commonShareRemainingValuation -= finalReturn
        commit('updateFinalReturn', {
          roundId: investmentRound.id,
          valuation: finalReturn,
          decision
        })
      }
    } while (anyRoundExited)
  }
}
