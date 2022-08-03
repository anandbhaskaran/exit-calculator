<template>
  <div>
    <div class="pt-32 px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900 text-center">
            Exit Valuation Calculator
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Please enter the value of the company at the time of exit
          </p>
        </div>
      </div>
      <div class="pt-10 sm:col-span-4">
        <label for="exitValuation" class="block text-sm font-medium text-gray-700"> Exit Valuation </label>
        <div class="mt-1">
          <input
            id="exitValuation"
            v-model="exitValuation"
            name="exitValuation"
            type="text"
            autocomplete="email"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
        </div>
      </div>
      <div class="pt-5">
        <div class="flex">
          <button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="calculateExit(exitValuation)">
            Calculate
          </button>
        </div>
      </div>
    </div>

    <StackingTable />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'Vuex'

export default Vue.extend({
  name: 'IndexPage',
  methods: {
    ...mapActions('stacking', {
      calculateExit: 'calculateExit'
    })
  },
  data () {
    return {
      exitValuation: 60000000
    }
  },

  created () {
    this.calculateExit(this.exitValuation)
  }
})
</script>
