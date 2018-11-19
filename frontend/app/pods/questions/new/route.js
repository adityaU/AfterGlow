import Ember from 'ember';
import {
    CanMixin
} from 'ember-can';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';

export default Ember.Route.extend(CanMixin, KeyboardShortcuts, {
    toast: Ember.inject.service(),
    beforeModel() {
        this._super(...arguments);
    },
    setupController(controller, model) {
        this._super(...arguments);
        this.set('currentController', controller);
    },
    resetController() {
        this.controller.set('validQuestion', true);
        this.controller.set('queryObject.rawQuery', null);
        this.controller.set('isQueryLimited', false);
        this.controller.set('queryLimit', 0);
        this.controller.set('limitedQuery', null);
        this.controller.set('variablesReplacedQuery', null);
        this.controller.set('recalculate', new Date());
        this.controller.set('showSettings', false);
        this.controller.set('results', null);
        this.controller.set('errors', null);
    },
    afterModel() {
        if (!this.can('create question')) {
            this.transitionTo('questions.all');
        }
    },
    actions: {
        willTransition(transition) {
            this._super(...arguments);
            this.set('nextTransition', transition);
            if (this.can('create question') && !this.controller.get('retryingTransition')) {
                transition.abort();
                this.controller.set('showTransitionWarning', true);
            } else {
                this.resetController();
            }
            this.set('retryingTransition', false);
        },
        runQuery() {
            this.get('currentController').getResultsFunction();
        },
        runQueryWithSelectedText() {
            this.get('currentController').getResultsWithSelectedTextFunction();
        },
        goAheadWithNextTransition() {
            this.resetController();
            this.controller.set('retryingTransition', true);
            this.get('nextTransition').retry();
        }
    },

    keyboardShortcuts: {
        'ctrl+enter': 'runQuery',
        'ctrl+r': 'runQueryWithSelectedText'
    }

});
