import DS from 'ember-data';
const { String: { pluralize, underscore } } = Ember;
import ENV from "../../config/environment";

export default DS.JSONAPIAdapter.extend({
    namespace: '/api/v1',
    host: ENV.host,
    socketHost: ENV.socketHost,
    toast: Ember.inject.service(),
    sessionService: Ember.inject.service(),
    headers: Ember.computed('sessionService.token', function(){
        return {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Authorization": this.get('sessionService.token')
        }
    }).volatile(),
    pathForType: function(modelName) {
        return Ember.String.pluralize(Ember.String.underscore(modelName));
            
    },
    coalesceFindRequests: true,
    handleResponse(status, headers, payload) {
        status == 403 && this.get('toast').error("You are not authorized to perform this action", 'Sorry Mate!', {closeButton: true, timeout: 1500, progressBar:false});

        return this._super(status, headers, payload);
    }


});
