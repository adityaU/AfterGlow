import Ember from 'ember';

import DynamicQueryParamsControllerMixin from 'frontend/mixins/dynamic-query-params-controller-mixin';
export default Ember.Controller.extend(DynamicQueryParamsControllerMixin, {
    dashboards: Ember.computed.alias('model'),
});
