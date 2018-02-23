import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin,{

    renderTemplate(controller, model) {

        this.render('data_references.databases.show.tables.all', {
            into: 'application',
            controller: controller
        });
    },

    setupController: function(controller, model) {
        this._super(...arguments);
        controller.set('database', this.controllerFor('data_references.databases.show').get('database'));
    }
});
