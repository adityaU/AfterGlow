import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        toggleSql() {
            this.sendAction('toggleSql');
        }
    }


});
