import Ember from 'ember';


export default Ember.Mixin.create({
    queryParams: Ember.computed('queryParamsVariables.@each.name', function () {
        return this.get('queryParamsVariables') && this.get('queryParamsVariables').map((variable) => {
            return 'q_' + variable.get('name');
        }) || [];
    }),
    queryParamsObserver: Ember.on('init', Ember.observer('queryParamsVariables.@each.name', function () {
        this.get('queryParamsVariables') && this.get('queryParamsVariables').forEach((v) => {
            let var_value = this.get(`q_${v.get('name')}`);
            let variableChanged = false;
            if (var_value) {
                v.set('value', var_value);
                variableChanged = true;
            }
            if (variableChanged) {
                this.set('reloadBasedOnQueryParams', true);
            }
        });
    })),
    changeQueryParamsInUrl(variables, title) {
        variables && variables.forEach((variable) => {
            this.set(`q_${(variable.get && variable.get('name') )|| variable.name}`, (variable.get && variable.get('value')) || variable.value);
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
