import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const currentUserStore = defineStore('currentUser', {
  state: () => ({
    permissions: reactive([]),
    details: reactive({}),
    viewerMode: false,
  }),

  getters: {
    isAdmin() {
      return (this.permissions.indexOf('Settings.all') >= 0)
    },
    canSeeDashboard() {
      return (this.permissions.indexOf('Dashboard.show') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canCreateDashboard() {
      return (!this.viewerMode) && (this.permissions.indexOf('Dashboard.create') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canEditDashboard() {
      return (!this.viewerMode) && (this.permissions.indexOf('Dashboard.edit') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDeleteDashboard() {
      return (!this.viewerMode) && (this.permissions.indexOf('Dashboard.delete') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canCreateQuestion() {
      return (!this.viewerMode) && (this.permissions.indexOf('Question.create') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canSeeQuestion() {
      return (this.permissions.indexOf('Question.show') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canEditQuestion() {
      return (!this.viewerMode) && (this.permissions.indexOf('Question.edit') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDeleteQuestion() {
      return (!this.viewerMode) && (this.permissions.indexOf('Question.delete') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    canDownload() {
      return (this.permissions.indexOf('Download.enabled') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    isEditor() {
      return (this.permissions.indexOf('Question.edit') >= 0) || (this.permissions.indexOf('Settings.all') >= 0)
    },
    getDetails() {
      return this.details;
    }
  },

  actions: {
    toggleViewerMode() {
      const viewerMode = !localStorage.getItem('ag_viewer_mode')
      localStorage.setItem('ag_viewer_mode', viewerMode)
      this.viewerMode = viewerMode
    },
    set(det) {
      this.permissions = det.permissions
      this.details = det.user
    },

  }
});
