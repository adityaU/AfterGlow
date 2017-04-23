import Ember from 'ember';

export default Ember.Component.extend({
    variableTypes: ['String', "Integer", "Date"],
    showDatePicker: Ember.computed('variable.var_type', function(){
        if (this.get('variable.var_type') == "Date"){
            return true
        }else{
            return false
        }
    }),
    variableTypeObserver: Ember.observer('variable.var_type', function(){
        if (this.get('variable.var_type') == "Date"){
            this.set('default_date', new Date())
            this.set('variable.default', "current_date")
        }
    })
});
