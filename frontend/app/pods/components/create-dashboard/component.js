import Ember from 'ember';

export default Ember.Component.extend({
    dashboard: {},
    actions:{
        createDashboard(){
            let dashboard = this.store.createRecord('dashboard', {
                title: this.get('dashboard.title'),
                description: this.get('dashboard.description')
            })
            dashboard.save().then((response)=> {

            })
        },
        createAndAddToDashboard(){
            dashboard.get('questions').addObject(this.get('question'))
            dashboard.save().then((response)=> {
                this.sendAction('transitionToDashBoard', response.id)
            })
        }
    }

});
