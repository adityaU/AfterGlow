import Ember from 'ember';

export default Ember.Component.extend({
  databasesLength:  Ember.computed("databases.@each", function(){
    if (this.get('databases.length')){
      return true
    }
  }),
    
    selectedDatabase: Ember.computed("queryObject.database","databases.@each", function(){
      return this.get('store').peekRecord('database', this.get('queryObject.database.id'))
    }),
    showTags: true,

    actions: {
        toggleSql(){
            this.sendAction('toggleSql');
        }
    }


});

