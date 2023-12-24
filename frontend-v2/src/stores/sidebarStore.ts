import { defineStore } from 'pinia';

import { reactive } from 'vue';

export const sidebarState = defineStore('sidebarState', {
  state: () => ({
    _expanded: false,
  }),

  getters: {
    expanded() {
      return this._expanded;
    },
  },

  actions: {
    setExpanded(value: boolean) {
      this._expanded = value;
      return true;
    },
  },
});
