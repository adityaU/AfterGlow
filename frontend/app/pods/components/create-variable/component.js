import Ember from 'ember';

export default Ember.Component.extend({
    variableTypes: ['normal', 'filter'],
    variableSaved: Ember.computed('variable', function(){
        return this.get('variable.id') == null
    }),

    actions:{
        saveVariable(){
            // this.set('query', this.get('query').replace(`{{${this.get('variableName')}}}`, `{{${this.get('variable.name')}}}`))
            this.get('variable').save().then((response)=>{
                this.get('entity.variables').pushObject(response);
            })
        }
    }
});
