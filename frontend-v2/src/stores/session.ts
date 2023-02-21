import { defineStore } from 'pinia';

export const sessionStore = defineStore('session', {
  state: () => ({
    accessToken: '',
    defaults: {},
  }),

  getters: {
    token() {
      if (this.accessToken) {
        return this.accessToken;
      }
      return localStorage.getItem('ag_access_token');
    },
  },

  actions: {
    setDefault(key, value) {
      this.defaults[key] = value;
      localStorage.setItem('ag_' + key.toLowerCase(), value);
    },

    getDefault(key) {
      return (
        this.defaults[key] || localStorage.getItem('ag_' + key.toLowerCase())
      );
    },
    setToken(token: string) {
      this.accessToken = token;
      localStorage.setItem('ag_access_token', token);
    },
    logout() {
      localStorage.setItem('ag_access_token', '');
    },
  },
});
