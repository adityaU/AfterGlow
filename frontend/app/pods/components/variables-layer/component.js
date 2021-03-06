import Ember from 'ember';

export default Ember.Component.extend({
    variableTypeObserver: Ember.on('init', Ember.observer('variables.@each.var_type', function(){
        this.get('variables') && this.get('variables').forEach((item)=>{
            if ( item && item.get('var_type') == "Date"){
                item.set('showDatePicker', true)
                item.set('showMultiSelect', false)
            }else if(item && item.get('var_type') == "Dynamic"){
                item.set('showMultiSelect', true)
                item.set('showDatePicker', false)
            }else{
                item.set('showMultiSelect', false)
                item.set('showDatePicker', false)
            }
        })
    }))
});
