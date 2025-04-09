import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0,
    showcompareBtn:false,
    selectedVersionListforcomparision: [],
    Isversionseleceted: {
      id:null,
      toshow:false
    }

   }),
  getters: {
    double: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
