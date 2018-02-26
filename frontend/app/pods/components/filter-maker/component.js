import Ember from 'ember';

export default Ember.Component.extend({
    filteredColumns: Ember.computed('columns', 'columnQuery', function(){
      let columns = this.get('columns')
      let columnQuery = this.get('columnQuery')
      if (columns && columnQuery){
        return columns.filter(function(item){
          return item.get('human_name') && item.get('human_name').toLowerCase().match(columnQuery.toLowerCase())
        })
      }else{
        return columns
      }
    }),
    filterObserver: Ember.observer('filter.column', 'filter.operator', 'filter.value','filter.valueDateObj.dtt',  'filter.valueDateObj.value', 'filter.valueDateObj.duration', function(){

        if (this.get('filter.raw') && this.get('filter.value')){
            this.set('filter.column', null)
            this.set('filter.operator', null)
            this.set("filter.label", this.get('filter.value'))
        }else if (this.get('filter.column') && this.get('filter.operator') && this.get('filter.valueDateObj') && !this.get('filter.value') ){
            let selectorsLabel = `${ this.get('filter.valueDateObj.value') || '30' } ${ this.get('filter.valueDateObj.duration.name') || 'Days'} ${ this.get('filter.valueDateObj.dtt.name') || 'Ago' }`
            this.set("filter.label", this.get('filter.column.human_name') + " " +  this.get('filter.operator.name') + " " + selectorsLabel)
        }else if (this.get('filter.column') && this.get('filter.operator') && this.get('filter.value')){
            this.set("filter.label", this.get('filter.column.human_name') + " " +  this.get('filter.operator.name') + " " +this.get('filter.value'))
        }else{
            this.set("filter.label", null)
        }
    }),

    operators: [
        {name: "is greater than" , value: ">" },
        {name: "is less than" , value: "<" },
        {name: "is greater than or equals to" , value: ">=" },
        {name: "is less than or equals to" , value: "<=" },
        {name: "is" , value: "=" },
        {name: "is not " , value: "!=" },
        {name: "contains" , value: "in" },
        {name: "does not contain" , value: "not in" }
    ],
    actions: {
        switchToBuilder(){
            this.sendAction('switchToBuilder', ...arguments)
        },

        switchToRaw(){
            this.sendAction('switchToRaw', ...arguments)
        },
    }
});
