import Ember from 'ember';

export default Ember.Component.extend({
    
    selectedDatabase: null,
    showTags: true,
    databases: Ember.computed(function(){
        return this.get('store').findAll('database')
    }),

    actions: {
        toggleSql(){
            this.sendAction('toggleSql');
        }
    }


});

