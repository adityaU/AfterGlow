import Ember from 'ember';

export default Ember.Component.extend({
    values: Ember.computed.alias('resultsViewSettings.x1'),
    labels: Ember.computed.alias('resultsViewSettings.y'),
    title: Ember.computed.alias('resultsViewSettings.title')
});
