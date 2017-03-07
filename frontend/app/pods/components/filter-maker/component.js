import Ember from 'ember';

export default Ember.Component.extend({
    filterObserver: Ember.observer('filter.column', 'filter.operator', 'filter.value', function(){

        if (this.get('filter.raw') && this.get('filter.value')){
            this.set('filter.column', null)
            this.set('filter.operator', null)
            this.set("filter.label", this.get('filter.value'))
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
