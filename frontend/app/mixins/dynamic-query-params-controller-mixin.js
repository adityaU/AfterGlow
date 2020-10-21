import Ember from 'ember';


export default Ember.Mixin.create({
  queryParams: Ember.computed('queryParamsVariables.@each.name', function () {
    let queryParams  = this.get('queryParamsVariables') && this.get('queryParamsVariables').map((variable) => {
      return 'q_' + variable.get('name');
    }) || [];
    queryParams.push("autoRefresh")
    return queryParams
  }),
  queryParamsObserver: Ember.on('init', Ember.observer('queryParamsVariables.@each.name', function () {
    this.get('queryParamsVariables') && this.get('queryParamsVariables').forEach((v) => {
      let var_name = v.get('name')
      if (var_name && var_name != undefined){
        let var_value = this.get(`q_${v.get('name')}`);
        let variableChanged = false;
        if (var_value && var_value != undefined && var_value != 'undefined') {
          v.set('value', var_value);
          variableChanged = true;
        }
        if (variableChanged) {
          this.set('reloadBasedOnQueryParams', true);
        }

      }
    });
  })),
  changeQueryParamsInUrl(variables, title) {
    variables && variables.forEach((variable) => {
      let var_name = (variable.get && variable.get('name') )|| variable.name
      let var_value = (variable.get && variable.get('value')) || variable.value
      if (var_name && var_value && var_name != 'undefined' && var_name != undefined && var_value != undefined   && var_value != 'undefined') {
        this.set(`q_${var_name}`, var_value);
      }
    });
    let newQueryParams = {};
    this.get('queryParams') && this.get('queryParams').forEach((qParam) => {
      newQueryParams[qParam] = this.get(qParam);
    });
    let searchParams = new window.URLSearchParams(newQueryParams).toString();
    if (searchParams.length > 0) {
      window.history.replaceState({}, title, `${window.location.pathname}?${searchParams}`);
    }

  }

});
