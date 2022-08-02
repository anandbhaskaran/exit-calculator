export const state = () => ({
  investmentRounds: [
    {
      name: 'Preferred C',
      shares: 1500000,
      investment: 15000000,
      priority: 4
    },
    {
      name: 'Preferred B',
      shares: 300000,
      investment: 2100000,
      priority: 3
    },
    {
      name: 'Preferred A',
      shares: 200000,
      investment: 900000,
      priority: 2
    },
    {
      name: 'Common',
      shares: 1000000,
      investment: 0,
      priority: 1
    }
  ]
})

export const mutations = {
  add (state, text) {
    state.list.push({
      text,
      done: false
    })
  },
  remove (state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
