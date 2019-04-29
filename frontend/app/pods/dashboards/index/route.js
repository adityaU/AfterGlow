import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';
import {
    CanMixin
} from 'ember-can';


import DynamicQueryParamsRoutesMixin from 'frontend/mixins/dynamic-query-params-routes-mixin';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';
export default Ember.Route.extend(CanMixin, KeyboardShortcuts, DynamicQueryParamsRoutesMixin, AuthenticationMixin, {
    toast: Ember.inject.service(),
    model(params) {
        return this.store.findAll('dashboard');

    },
    setupController(controller, model) {
        this._super(...arguments);
        this.set('currentController', controller);
    }

});
