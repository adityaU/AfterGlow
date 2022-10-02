import { defineStore } from 'pinia';

export const currentUserStore = defineStore('currentUser', {
  state: () => ({
    permissions: [],
    details: {}
  }),

  getters: {
    canSeeDashboard(){
      return (this.permissions.indexOf('Dashboard.show') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canCreateDashboard(){
      return (this.permissions.indexOf('Dashboard.create') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canEditDashboard(){
      return (this.permissions.indexOf('Dashboard.edit') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDeleteDashboard(){
      return (this.permissions.indexOf('Dashboard.delete') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canCreateQuestion(){
      return (this.permissions.indexOf('Question.create') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canSeeQuestion(){
      return (this.permissions.indexOf('Question.show') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canEditQuestion(){
      return (this.permissions.indexOf('Question.edit') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDeleteQuestion(){
      return (this.permissions.indexOf('Question.delete') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDownload(){
      return (this.permissions.indexOf('Download.enabled') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
  },

  actions: {
    set(det) {
      this.permissions = det.permissions;
      this.details = det.user
    },

    getDetails() {
      return this.details;
    }
  }
});
