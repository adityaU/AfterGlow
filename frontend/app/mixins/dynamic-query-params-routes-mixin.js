import Ember from 'ember';


export default Ember.Mixin.create({
    beforeModel(transition) {
        this._super(...arguments);
        this.setupqueryParamsOnRoute(transition);
    },

    setupController(controller, model) {
        this._super(...arguments);
        this.set('currentController', controller);
    },

    setupqueryParamsOnRoute(transition) {
        this.set('variableQueryParams', transition.queryParams);
    },
    actions: {
        willTransition(transition) {
            this._super(...arguments);
            this.setupqueryParamsOnRoute(transition);
        },
        didTransition() {
            this._super(...arguments);
            let vqp = this.get('variableQueryParams');
            this.set('queryParams', Object.keys(vqp));
            Object.keys(vqp).forEach((item) => {
                this.get('currentController').set(item, vqp[item]);
            });
        },
    }
});
