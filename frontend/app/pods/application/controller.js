import Ember from 'ember';

export default Ember.Controller.extend({
    sessionService: Ember.inject.service(),
    actions: {
        invalidateSession() {
            this.get('sessionService').invalidate();
            this.transitionToRoute('login')
        },
        goToDashboard(dashboard){
          this.transitionToRoute('dashboards.show', dashboard.get('id'))
          this.set('showDashboardSearch', false)
        },

        goToQuestion(question){
          this.transitionToRoute('questions.show', question.get('id'))
          this.set('showQuestionSearch', false)
        }
    },
});
