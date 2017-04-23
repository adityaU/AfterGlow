import Ember from 'ember';

export default Ember.Component.extend({
    variablesSelected: Ember.computed.alias('dashboard.variables'),
    unique(arr){
        var uniqueObjects = [];

        return arr.filter(function(item){
            if(!uniqueObjects.isAny('name', item.get('name'))){
                uniqueObjects.push(item);
                return true;
            }

            return false;
        });
    },
    variablesRemaining: Ember.computed('variables', 'variablesSelected.@each', function(){
        let variablesSelected = this.get('variablesSelected')
        return this.unique(this.get('variables').filter((item)=>{
            return variablesSelected.map((variable)=>{return variable.get('name')}).indexOf(item.get('name')) < 0
        })) 
    }),
    variables: Ember.computed('dashboard.questions.@each.variables.@each.content.isLoaded', function(){
        let dashboardQuestions = this.get('dashboard.questions')
        return [].concat.apply([], dashboardQuestions.map((item)=>{
            return item.get('variables').toArray()
        }))
    }),
    actions:{
        selectVariable(variable){
            this.set('isEditing', true)
            let variablesSelected = this.get('variablesSelected');
            variable = this.get('store').createRecord('variable', {
                name: variable.get('name'),
                default: variable.get('default'),
                var_type: variable.get('var_type')
            })
            variablesSelected.pushObject(variable);
        },
        removeVariable(variable){
            this.set('isEditing', true)
            let variablesSelected = this.get('variablesSelected');
            variablesSelected.removeObject(variable);
            variable.destroyRecord()
        },
        saveUserPermissions(){
            this.sendAction('saveUserPermissions', this.get('user'))
        }
    }
});
