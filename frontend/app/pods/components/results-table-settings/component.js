import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['card-body'],
  columns: Ember.computed('results.columns', function(){
    return this.get('results.columns') && this.get('results.columns').map((item)=>{
      return {title: item};
    });
  }),
  selectedHiddenColumns:  Ember.computed('resultsViewSettings.hiddenColumns.[]', function(){
    return this.get('resultsViewSettings.hiddenColumns') && this.get('resultsViewSettings.hiddenColumns').map((item)=>{
      return {title: item};
    });
  }),

  actions: {
    mutateHiddenColumns(columns){
      this.set('resultsViewSettings.hiddenColumns', columns && columns.map((item)=>{
        return item.title;
      }));
    }
  }
});
