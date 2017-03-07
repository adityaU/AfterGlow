import DS from 'ember-data';
const { String: { pluralize, underscore } } = Ember;

export default DS.JSONAPIAdapter.extend({
    namespace: '/api/v1',
    host: 'http://localhost:4000',
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
          
    },
    coalesceFindRequests: true


});
