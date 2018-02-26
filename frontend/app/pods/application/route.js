import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';

export default Ember.Route.extend(KeyboardShortcuts, {
    moment: Ember.inject.service(),
    beforeModel() {
        this._super(...arguments);
        this.get('moment').setTimeZone(moment.tz.guess());
    },

    setupController(controller, model){
        this._super(...arguments);
        this.set('controller', controller)
    },

    actions: {
        goToDashboard(dashboard){
            this.transitionTo('dashboards.show', dashboard)
        },
        goToNewQuestion(){
          this.transitionTo('questions.new')
        },
        goToAllQuestions(){
          this.transitionTo('questions.all')
        },
        goToDataReference(){
          this.transitionTo('data_references.databases.all')
        },
        openSelectDashboard(){
          this.set('controller.showQuestionSearch', false)
          this.set('controller.showDashboardSearch', true)
        },
        openSelectQuestion(){
            this.set('controller.showDashboardSearch', false)
            this.set('controller.showQuestionSearch', true)
        },
        hideSearchDialogues(){
          this.set('controller.showQuestionSearch', false)
          this.set('controller.showDashboardSearch', false)
        }

    },

    keyboardShortcuts: {
      'ctrl+n' : "goToNewQuestion",
      'ctrl+shift+q' : "goToAllQuestions",
      'ctrl+shift+r' : "goToDataReference",
      "ctrl+d" : "openSelectDashboard",
      "ctrl+q" : "openSelectQuestion",
      "esc" : {
        action: "hideSearchDialogues",
        preventDefault: false,
      }
    }
});
