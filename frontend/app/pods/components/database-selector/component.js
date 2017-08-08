import Ember from 'ember';

export default Ember.Component.extend({
    showDropdown: Ember.computed('showTags', 'queryObject.database.name', 'forceShowDropdown',  function(){
        if (!this.get('queryObject.database.name')){
            return true
        }else if (this.get('forceShowDropdown')){
            return true
        }else{
            return false
        }
    }),
    databaseNameObserver: Ember.observer('queryObject.database.name', function(){
        this.set('forceShowDropdown', false);
        this.set('showTags', true);
    }),
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
        },
        toggleShowDropdown(){
            this.set('showTags', false);
            this.set('forceShowDropdown', true)
        }
    }


});

