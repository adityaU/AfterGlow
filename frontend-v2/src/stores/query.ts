
import { defineStore } from 'pinia';

export const queryStore = defineStore('query', {
  state: () => ({
    queries: {}
  }),

  getters: {
  },

  actions: {
    push(query, key) {
      this.queries[key] = query;
    },

    get(key) {
      return this.queries[key];
    }
  }
});
