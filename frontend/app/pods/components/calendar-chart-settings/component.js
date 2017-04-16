import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["ui", "segment"],
    date: Ember.computed.alias('resultsViewSettings.date'),
    dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
    actions: {
        addDataColumn(){
            this.get('dataColumns').pushObject({})
        },
        removeColumn(data){
            this.get('dataColumns').removeObject(data)
        }
    }
});
