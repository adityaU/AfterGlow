import Ember from 'ember';
import {
    CanMixin
} from 'ember-can';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';
export default Ember.Route.extend(CanMixin, KeyboardShortcuts, {
    toast: Ember.inject.service(),
    afterModel() {
        if (!this.can('show question')) {
            this.get('toast').error(
                'You are not authorized to perform this action',
                'Sorry Mate!', {
                    closeButton: true,
                    timeout: 1500,
                    progressBar: false
                }
            );

            this.transitionTo('index');
        }
    },
    queryParams: {
        share_id: {
            refreshModel: true
        }
    },
    model(params) {
        return this.store.queryRecord('question', {
            id: params.question_id,
            share_id: params.share_id
        });
    },
    resetController() {
        this.controller.get('question').reload();

        this.set('retryingTransition', false);
    },
    setupController(controller, model) {
        this._super(...arguments);
        this.set('currentController', controller);
    },
    templateName: 'questions/new',
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
        goAheadWithNextTransition() {
            this.resetController();
            this.controller.set('retryingTransition', true);
            this.get('nextTransition').retry();
        }
    },

    keyboardShortcuts: {
        'ctrl+enter': 'runQuery'
    }
});
