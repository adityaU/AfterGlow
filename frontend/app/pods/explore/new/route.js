import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
  ajax: Ember.inject.service(),
  model(params) {
    this.set('params', params)

    return new Ember.RSVP.Promise((resolve, reject) => {

      this.get('ajax').apiCall({
        url: this.get('ajax.apiPath') + '/explore' +
        '?column_id=' + params.column_id + '&value=' + params.column_value,
        type: 'GET'
      }, (response, status) => {
        resolve(response);
      }, (error, status) => {
        reject(error);
      });
    });
  },

  setupController: function (controller, model) {
    this._super(...arguments);
    controller.set('params', this.get('params'));
  }
});
