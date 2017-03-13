import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        createDashboard(){
            $('.ui.modal.create-dashboard').modal('show')
        },
        addToDashboard(dashboard){
            this.sendAction("addToDashboard" , dashboard)
        }
    }
});
