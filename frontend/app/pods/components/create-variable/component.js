import Ember from 'ember';

export default Ember.Component.extend({
    variableTypes: [ 'String', 'Integer', 'Date', 'Dynamic'].map(function(item){
        return Ember.Object.create({title: item})
    }),
    showDatePicker: Ember.computed('variable.var_type', function(){
        if (this.get('variable.var_type') == "Date"){
            return true
        }else{
            return false
        }
    }),
    varTypeHash: Ember.computed("variable.var_type", function(){
       return Ember.Object.create({title : this.get("variable.var_type")})
    }),
    varTypeHash: Ember.computed("variable.var_type", function(){
       return Ember.Object.create({title : this.get("variable.var_type")})
    }),
    variableTypeObserver: Ember.observer('variable.var_type', function(){
        if (this.get('variable.var_type') == "Date"){
            this.set('default_date', new Date())
            this.set('variable.default', "current_date")
        }
    }),

    dynamic: Ember.computed('variable.var_type',function(){
        return this.get('variable.var_type') == "Dynamic"
    }),

    questions: Ember.computed('questionQuery', function(){
        return this.store.query('question', {for_variable: true, query: (this.get('questionQuery') || "")})
    }),

    actions: {
        updateVarType(selection){
          this.set('variable.var_type', selection.get('title'))
            this.set('variable.default', null)
            this.set('variable.default_options', [])
            this.set('variable.question_filter', null)

        },
        updateQuestionSearch(text){
           this.set('questionQuery', text)
        }
    }

});
