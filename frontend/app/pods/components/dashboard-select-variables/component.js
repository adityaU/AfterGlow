import Ember from 'ember';

import HelperMixin from 'frontend/mixins/helper-mixin';
export default Ember.Component.extend(HelperMixin, {
  varDefault: [],
  variablesSelected: Ember.computed('dashboard.variables.[]', function(){
    let variables = this.get('dashboard.variables') || [];
    let selectedVariables = [];
    variables.forEach((item)=> {
      selectedVariables.pushObject(item);
    });
    return selectedVariables;
  }),
  variablesRemaining: Ember.computed('variables', 'variablesSelected.@each', function(){
    let variablesSelected = this.get('variablesSelected');
    return this.uniqueByName(this.get('variables').filter((item)=>{
      return variablesSelected.map((variable)=>{return variable.get('name');}).indexOf(item.get('name')) < 0;
    }));
  }),
  variables: Ember.computed('dashboard.questions.@each.variables.@each.content.isLoaded', function(){
    let dashboardQuestions = this.get('dashboard.questions');
    return [].concat.apply([], dashboardQuestions.map((item)=>{
      return item.get('variables').toArray();
    }));
  }),

  createVariable(variable){
    this.set('isEditing', true);
    return this.get('store').createRecord('variable', {
      name: variable.get('name'),
      default: variable.get('default'),
      var_type: variable.get('var_type'),
      question_filter: variable.get('question_filter'),
      default_options: variable.get('default_options')
    });
  },
  deleteVariable(variable){
    this.set('isEditing', true);
    if (variable.get('dashboard.id') == this.get('dashboard.id')){
      variable.destroyRecord();
      this.get('dashboard').save();
    }
    return variable;
  },
  findDiff(arr1, arr2){
    let arr = [];
    var notFound = null;
    for (var i=0 ; i < arr1.length; i++){
      notFound = true;
      for (var j= 0; j < arr2.length; j++){
        if (arr1[i].get('name') == arr2[j].get('name')){
          notFound = false;
        }
      }
      if (notFound == true){
        arr.push(arr1[i]);
      }
    }
    return arr;
  },
  actions:{
    hide(){
      this.set('open', false);
    },
    mutateVariables(variables){
      let selectedVariables = this.get('variablesSelected');
      let toBeDeletedVariables = this.findDiff(selectedVariables, variables);
      let toBeCreatedVariables = this.findDiff(variables, selectedVariables);
      let createdVariables = toBeCreatedVariables.map((item)=> {
        return this.createVariable(item);
      });
      let deletedVariables = toBeDeletedVariables.map((item)=> {
        return this.deleteVariable(item);
      });
      this.get('dashboard.variables').pushObjects(createdVariables);
      this.get('dashboard.variables').removeObjects(deletedVariables);
    },
    saveUserPermissions(){
      this.sendAction('saveUserPermissions', this.get('user'));
    }
  }
});
