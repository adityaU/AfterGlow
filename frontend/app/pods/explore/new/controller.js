import Ember from 'ember';

export default Ember.Controller.extend({
  value: Ember.computed.alias('model.value'),
  dependencies: Ember.computed('model', function () {
    return this.get('model.dependencies') && this.get('model.dependencies').map((item) => {
      return Ember.Object.create(item);
    });
  }),

  getDependencyResults(dependency) {
    dependency.set('loading', true);
    this.get('ajax').apiCall({
      url: this.get('ajax.apiPath') + '/explore/dependency' +
      '?table_id=' + dependency.get('id') + '&value=' + this.get('model.value') +
      '&column_id=' + dependency.get('column_id') +
      '&foreign_column_id=' + dependency.get('foreign_column_id') +
      '&value_column_id=' + this.get('model.column_id'),
      type: 'GET'
    }, (response, status) => {
      dependency.set('loading', false);
      dependency.set('results', response.results);
      dependency.set('errors', null);

    }, (error, status) => {
      dependency.set('loading', false);
      dependency.set('errors', 'We are not able to fetch the results at the moment. Please try after some time.');
      dependency.set('results', null);

    });
  },
  actions: {
    showDependencyResults(newDependency, oldDependency) {
      oldDependency && oldDependency.set('showDependencyWidgetOnListPage', false);
      newDependency && newDependency.set('showDependencyWidgetOnListPage', true);
      if (newDependency && !newDependency.get('results')) {
        this.getDependencyResults(newDependency);
      }
    },

    createDashboard(){

      this.get('ajax').apiCall({
        method: 'POST',
        url: this.get('ajax.apiPath') + '/explore/create_dashboard' +
        '?column_id=' + this.get('params.column_id') + '&value=' + this.get('params.column_value'),
        type: 'GET'
      }, (response, status) => {
        this.transitionToRoute('dashboards.show', response.data.id, {queryParams: {"autoRefresh" : true}})
      }, (error, status) => {
        reject(error);
      });
    }
  }
});
