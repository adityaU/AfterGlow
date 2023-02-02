
import { defineStore } from 'pinia';
import { sessionStore } from 'stores/session'

const session = sessionStore()

export const queryStore = defineStore('query', {
  state: () => ({
    queries: {}
  }),

  getters: {
  },

  actions: {
    push(query, key) {
      this.queries[key] = { ...query, ...{ token: session.token } };
    },

    get(key) {
      return this.queries[key];
    }
  }
});
