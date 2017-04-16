import Ember from 'ember';
import ColorMixin from "frontend/mixins/colors-mixin"

export default Ember.Component.extend(ColorMixin, {
    date: Ember.computed.alias('resultsViewSettings.date'),
    dataColumns: Ember.computed.alias('resultsViewSettings.dataColumns'),
    header: {
        left:   'title',
        center: '',
        right:  'prev,next'

    },


    events: Ember.computed('results', 'date', 'dataColumns.@each.columnName', function(){ 
        let data =  this.get('results');
        let dateIndex = data && data.columns &&  data.columns.indexOf(this.get('date'))
        let dataColumnIndices = data && data.columns && this.get('dataColumns') &&  
                this.get('dataColumns').map((item)=> {
                    return data.columns.indexOf(item.columnName)
                }).filter((item)=>{
                    return (item >= 0)
                })
        if (dateIndex >= 0 && data && data.rows && data.rows.length > 0 && this.get('dataColumns')  ){
            return [].concat.apply([], dataColumnIndices.map((index, i)=>{
                return data.rows.map((item)=> {
                    return {
                        title: item[index],
                        start: item[dateIndex],
                        end: item[dateIndex],
                        backgroundColor: this.get('colors')[i],
                        className: "calander-data"
                    }
                })
            }))
        }else{
            return {};
        }
    }),
    dataColors: Ember.computed('results', 'dataColumns.@each.columnName', 'date', function(){
        let data =  this.get('results');
        return data && data.columns && this.get('dataColumns') &&
            this.get('dataColumns').map((item, i)=> {
                return {name: item.columnName, color: this.get('colors')[i]}
                }).filter((item)=>{
                    return (item.name)
                })
    })
});
