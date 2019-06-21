import Ember from 'ember';

export default Ember.Component.extend({
  query: '',
  db: Ember.computed('database', function () {
    let database = this.get('database');
    return this.get('store').peekRecord('database', database.id) || this.get('store').findRecord('database', database.id);
  }),
  tableObserver: Ember.on('init',Ember.observer('db', 'db.isLoaded', 'db.tables', 'db.tables.isLoaded', 'query', function () {
    let query = this.get('query');
    query = query && query.trim();
    if (this.get('db.id') && (query || query == '')){
      Ember.run.debounce(this, ()=> {

        this.set('tables', this.get('store').query('search-table', {q: query || '', database_id: this.get('db.id')}));
      }, 300);
    }

  }))
});
