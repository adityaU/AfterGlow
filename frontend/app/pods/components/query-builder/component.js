import Ember from 'ember';

export default Ember.Component.extend({

    databases: Ember.computed(function(){
        return this.get('store').findAll('database')
    }),
    actions: {
        getResults(){
            this.sendAction('getResults', this.get('queryObject'));
        },
        toggleSql(){
            this.sendAction('toggleSql');
        }
    }
});
