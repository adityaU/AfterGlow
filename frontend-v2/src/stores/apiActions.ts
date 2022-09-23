import { defineStore } from 'pinia';

export const apiActionStore = defineStore('apiActions', {
  state: () => ({
    apiActions: {}
  }),

  getters: {
  },

  actions: {
    push(apiActions, key) {
      this.apiActions[key] = apiActions;
    },

    get(key) {
      return this.apiActions[key];
    }
  }
});
