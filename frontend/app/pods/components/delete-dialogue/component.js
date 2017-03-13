import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        delete(entity){
            this.sendAction('delete', entity)
        }
    }
});
