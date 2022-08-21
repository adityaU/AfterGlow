import { defineStore } from 'pinia';

export const resultsStore = defineStore('queryData', {
  state: () => ({
    results: {}
  }),

  getters: {
  },

  actions: {
    pushResults(result, key) {
      this.results[key] = result;
    },

    getResults(key) {
      return this.results[key];
    }
  }
});
