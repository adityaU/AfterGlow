import Ember from 'ember';

import BaseChartSettings from '../base-chart-settings/component'

export default BaseChartSettings.extend({
    layoutName: 'components/base-chart-settings'
});
// export default Ember.Component.extend({
    // classNames: ["ui", "segment"],
    // date: Ember.computed.alias('resultsViewSettings.date'),
    // dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
    // actions: {
    //     addDataColumn(){
    //         if ( this.get('dataColumns')) {
    //             this.get('dataColumns').pushObject({})
    //         }else{
    //             this.set('dataColumns', [{}])
    //         }
    //     },
    //     removeColumn(data){
    //         this.get('dataColumns').removeObject(data)
    //     }
    // }
// });
