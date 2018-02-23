import Ember from 'ember';

export default Ember.Controller.extend({
    database: Ember.computed.alias('model')
});
