import Ember from 'ember';
import UtilsFunctions from 'frontend/mixins/utils-functions';

export default Ember.Component.extend(UtilsFunctions, {
    // date: Ember.computed.alias('resultsViewSettings.date'),
    // dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
    // header: {
    //     left:   'title',
    //     center: '',
    //     right:  'prev,next'

    // },

    // groupByValues: Ember.computed('jsonData', function(){
    //     let data =  this.get('jsonData');
    //     return data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
    //         return [].concat.apply([], series.map((item, j)=>{
    //             return item.get('type')
    //         }))
    //     }))

    // }),


    // events: Ember.computed('jsonData', function(){
    //     let data =  this.get('jsonData');
    //     data =  data && data.length > 0 && [].concat.apply([], data.map((series, i)=>{
    //         return [].concat.apply([], series.map((item, j)=>{
    //             return item.get('contents').map((el)=>{
    //                 return {
    //                     title: el.get('y'),
    //                     start: el.get('x1'),
    //                     end: el.get('x1'),
    //                     backgroundColor: this.get('colors')[i + j],
    //                     className: "calander-data"
    //                 }
    //             })
    //         }))
    //     }));
    //     return data
    // }),
    // dataColors: Ember.computed('multipleYs.@each.columnName' , 'groupByValues', function(){
    //     let groupByValues = this.get('groupByValues')
    //     groupByValues = groupByValues  && groupByValues.filter((item)=>{return item})
    //     groupByValues = groupByValues && groupByValues.length != 0 && this.get('groupByValues') &&
    //             this.get('groupByValues').map((item, i)=> {
    //                 return {name: item, color: this.get('colors')[i]}
    //             })
    //     if (groupByValues){
    //         return groupByValues
    //     }else{
    //         return this.get('multipleYs') &&
    //                 this.get('multipleYs').map((item, i)=> {
    //                     return {name: item.columnName, color: this.get('colors')[i]}
    //                 })
    //     }
    // })
});
