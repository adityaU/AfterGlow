import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ["h-100"],
    numbers: Ember.computed("results", "displayName", function () {
        let row = this.get('results.rows')[0]
        return row && row.map((item, i) => {
            let obj = Ember.Object.create({
                value: item,
                title: this.get('results.columns')[i]
            })
            return obj
        })
    }),

    displayName: Ember.computed("questionName", "resultsViewSettings.title", "results", function () {
        return this.get('resultsViewSettings.title') || this.get('results.columns')[0];
    }),

    onlyOne: Ember.computed('numbers', function () {
        let numbers = this.get('numbers')
        if (numbers && numbers.length == 1) {
            numbers.objectAt(0).set('title', this.get('displayName'))
            return true
        } else {
            return false
        }
    })


});
