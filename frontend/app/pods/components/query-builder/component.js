import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        getResults(){
            this.sendAction('getResults', this.get('queryObject'));
        },
        toggleSql(){
            this.sendAction('toggleSql');
        }
    }
});
