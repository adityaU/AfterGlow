import Ember from 'ember';

export default Ember.Component.extend({
    showDatePicker: Ember.computed('variable.var_type', function(){
        if (this.get('variable.var_type') == "Date"){
            return true
        }else{
            return false
        }
    }),
});
