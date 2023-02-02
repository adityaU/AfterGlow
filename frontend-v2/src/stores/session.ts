
import { defineStore } from 'pinia';

export const sessionStore = defineStore('session', {
  state: () => ({
    token: ""
  }),

  getters: {
    token() {
      if (this.token) { return this.token }
      return localStorage.getItem('ag_access_token')
    }
  },

  actions: {
    set(token: string) {
      this.token = token;
      localStorage.setItem('ag_access_token', token)
    },

  }
});
