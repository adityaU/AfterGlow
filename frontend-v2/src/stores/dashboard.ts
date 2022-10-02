
import { defineStore } from 'pinia';

export const dashboardsStore = defineStore('dashboards', {
  state: () => ({
    dashboards: {}
  }),

  getters: {
  },

  actions: {
    push(result, key) {
      this.dashboards[key] = result;
    },

    get(key) {
      return this.dashboards[key];
    }
  }
});
