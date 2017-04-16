import Ember from 'ember';


export default Ember.Mixin.create({

    resultsWidgets: {
        "Calendar": "calendar-chart",
        "Number": "number-chart",
        "Table" : 'results-table',
        "Line" : 'line-chart',
        "Pie" : 'pie-chart',
        "Bars" : 'bar-chart',
        "Area" : 'area-chart',
        "Bubble": 'bubble-chart'
    },
    resultsWidgetComponent:  Ember.computed('resultsViewType', function() {
        return this.get('resultsWidgets')[this.get('resultsViewType')]
    })
})
