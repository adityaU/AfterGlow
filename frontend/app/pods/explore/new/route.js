import Ember from 'ember';
import AuthenticationMixin from 'frontend/mixins/authentication-mixin';

export default Ember.Route.extend(AuthenticationMixin, {
    ajax: Ember.inject.service(),
    model(params) {

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
    }
});
