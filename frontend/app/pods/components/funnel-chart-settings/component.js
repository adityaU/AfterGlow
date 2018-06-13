import Ember from 'ember';

export default Ember.Component.extend({
    values: Ember.computed.alias('resultsViewSettings.x1'),
    labels: Ember.computed.alias('resultsViewSettings.multipleYs'),
    multipleYs: Ember.computed.alias('resultsViewSettings.multipleYs'),
    title: Ember.computed.alias('resultsViewSettings.title')
});
