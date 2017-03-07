import Ember from 'ember';

export default Ember.Component.extend({
    actions:{
        saveQuestion(){
            this.sendAction('saveQuestion')
        }
    }

});
