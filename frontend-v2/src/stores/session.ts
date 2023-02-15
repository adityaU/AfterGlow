
import { defineStore } from 'pinia';

export const sessionStore = defineStore('session', {
  state: () => ({
    accessToken: ""
  }),

  getters: {
    token() {
      if (this.accessToken) { return this.accessToken }
      return localStorage.getItem('ag_access_token')
    }
  },

  actions: {
    setToken(token: string) {
      this.accessToken = token;
      localStorage.setItem('ag_access_token', token)
    },
    logout(){
      localStorage.setItem('ag_access_token', "")
    }

  }
});
