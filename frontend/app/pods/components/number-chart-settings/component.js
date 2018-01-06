import Ember from 'ember';

export default Ember.Component.extend({
    title: Ember.computed.alias('resultsViewSettings.title')
});
