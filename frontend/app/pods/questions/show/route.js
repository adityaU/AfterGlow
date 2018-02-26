import Ember from 'ember';
import { CanMixin } from 'ember-can';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';
export default Ember.Route.extend(CanMixin, KeyboardShortcuts, {
    toast: Ember.inject.service(),
    afterModel(){
        if (!this.can('show question')) {
            this.get('toast').error(
                "You are not authorized to perform this action",
                'Sorry Mate!',
                {closeButton: true, timeout: 1500, progressBar:false}
            );

            this.transitionTo('index');
        }
    },
    model(params){
        return this.store.findRecord('question', params.question_id)
    },
    setupController(controller, model){
        this._super(...arguments);
        this.set('currentController', controller)
    },
    templateName: 'questions/new',
    actions:{
        willTransition(transition){
            this._super(...arguments);
            this.controller.get('question').reload()
        },
        runQuery(){
          this.get('currentController').getResultsFunction()
        }
    },

    keyboardShortcuts: {
      "ctrl+enter": "runQuery"
    }
});
