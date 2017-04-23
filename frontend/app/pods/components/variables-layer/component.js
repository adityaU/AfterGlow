import Ember from 'ember';

export default Ember.Component.extend({
    variableTypeObserver: Ember.observer('variables.@each.var_type', function(){
        this.get('variables').forEach((item)=>{
            if (item.get('var_type') == "Date"){
                item.set('showDatePicker', true)
            }else{
                item.set('showDatePicker', false)
            }
        })
    })
});
