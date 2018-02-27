import Ember from 'ember';
import { CanMixin } from 'ember-can';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';

export default Ember.Route.extend(CanMixin, KeyboardShortcuts, {
    toast: Ember.inject.service(),
    beforeModel(){
      this._super(...arguments);
    },
    setupController(controller, model){
        this._super(...arguments);
        this.set('currentController', controller)
    },
    afterModel(){
        if (!this.can('create question')) {
            this.transitionTo('questions.all');
        }
    },
    actions:{
        willTransition(transition){
            this._super(...arguments);
            this.controller.set('validQuestion', true)
            this.controller.set("queryObject.rawQuery", null)
            this.controller.set("isQueryLimited", false)
            this.controller.set("queryLimit", 0)
            this.controller.set("limitedQuery", null)
            this.controller.set("variablesReplacedQuery", null)
            this.controller.set('recalculate', new Date())
            this.controller.set('showSettings', false)
            this.controller.set('results', null)
            this.controller.set('errors', null)

        },
        runQuery(){
          this.get('currentController').getResultsFunction()
        }
    },

    keyboardShortcuts: {
      "ctrl+enter": "runQuery"
    }

});
