import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["ui", "segments"],
    title: Ember.computed.alias('resultsViewSettings.title')
});
