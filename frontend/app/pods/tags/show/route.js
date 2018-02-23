import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin'

export default Ember.Route.extend(AuthenticationMixin, {
    model(params){
        this.set('tag_id', params.tag_id)
        return this.store.find('tag', params.tag_id)
    },

    templateName: "questions.all",

    setupController: function(controller, model) {
        this._super(...arguments);
        controller.set('tag_id', this.get('tag_id'));
    }
});
