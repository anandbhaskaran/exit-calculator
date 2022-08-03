<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="pt-20 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">
          Capitalization (Cap) Table
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the users in your account including their name, title, email and role.
        </p>
      </div>
    </div>
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Share Class
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Number of Shares
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Invested
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Preference
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Common share
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    Return on Exit
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(investmentRound,investmentRoundKey, investmentRoundIdx) in investmentRounds" :key="investmentRoundKey" :class="investmentRoundIdx % 2 === 0 ? undefined : 'bg-gray-50'">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ investmentRound.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ investmentRound.shares }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ getInEuro(investmentRound.investment) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" :class="investmentRound.decision === 2 ? 'bg-blue-100' : undefined">
                    {{ getInEuro(investmentRound.valuation.preference.participationValue) }} + {{ getInEuro(investmentRound.valuation.preference.profitValue.profit) }} ({{ investmentRound.valuation.preference.profitValue.capReached?"2X":"" }}) =
                    {{ getInEuro(investmentRound.valuation.preference.participationValue + investmentRound.valuation.preference.profitValue.profit) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" :class="investmentRound.decision === 1 ? 'bg-blue-100' : undefined">
                    {{ getInEuro(investmentRound.valuation.commonShareValue) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {{ getInEuro(investmentRound.roundExitValuation) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'Vuex'
export default {
  computed: {
    ...mapGetters('stacking', ['investmentRounds'])
  },
  methods: {
    getInEuro (value: number) {
      value /= 1000000
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      })
      return formatter.format(value) + 'm'
    }
  }
}
</script>
