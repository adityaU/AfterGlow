import Ember from 'ember';

export default Ember.Controller.extend({
  sessionService: Ember.inject.service(),
  actions: {
    invalidateSession() {
      this.get('sessionService').invalidate();
      this.transitionToRoute('login')
    },

    openSearch() {
      this.set('showSearch', true)
    },
    goToDashboard(dashboard) {
      this.transitionToRoute('dashboards.show', dashboard.get('type_id') || dashboard.get('id'))
      this.set('showSearch', false)
    },

    goToQuestion(question) {
      this.transitionToRoute('questions.show', question.get('type_id'))
      this.set('showSearch', false)
    },
    goToTag(tag) {
      this.transitionToRoute('tags.show', tag.get('type_id'))
      this.set('showSearch', false)
    }
  },
});
