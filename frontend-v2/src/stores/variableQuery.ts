

import { defineStore } from 'pinia';


export const variableQuery = defineStore('variableQuery', {
  state: () => ({
    vars: {},
  }),

  getters: {
  },

  actions: {
    push(vari, value) {
      vari = this.hashed(vari)
      this.vars[vari] = value;
    },

    get(vari) {
      return this.vars[vari];
    },
    getAll() {
      return this.vars
    },

    updateQuery(router) {
      router.push({ query: this.vars });
    },

    sync(query) {
      this.vars = {}
      Object.entries(query).forEach(q => {
        if (q[0].match(/^q_/)) {
          this.vars[q[0]] = q[1]
        }
      })
    },

    hashed(varName) {
      return 'q_' + varName.replace(/[^a-zA-Z0-9]/g, '_')
    }
  }
});
