import DS from 'ember-data';
import { memberAction, collectionAction } from 'ember-api-actions';

export default DS.Model.extend({
  name: DS.attr('string'),
  readable_table_name: DS.attr('string'),
  database: DS.belongsTo('database'),
  human_name: DS.attr('string'),
  columns: DS.hasMany('column', {async: true}),
  inserted_at: DS.attr('utc'),
  updated_at: DS.attr('utc'),
  open: DS.attr('boolean'),
  expandable: DS.attr('boolean'),


  toJSON: function() {
    return this._super({ includeId: true });
  },
  foreignTablesObserver:  Ember.observer('id', 'open', function(){
    if(this.get('open') && !this.get('expandable'))
      this.foreignTableCall().then((response)=> {
        this.store.pushPayload('search_table', response);
        this.set('foreign_tables',this.store.push(response) );
      });
  }),

  foreignTableCall: memberAction({
    path: 'foreign_tables',
    type: 'GET',
    urlType: 'findRecord'
  }),
});
