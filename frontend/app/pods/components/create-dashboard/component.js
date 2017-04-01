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
            let object = {}
            object[this.get('question.id')] = {width:6, height: 6}
            let dashboard = this.store.createRecord('dashboard', {
                title: this.get('dashboard.title'),
                description: this.get('dashboard.description'),
                settings: object
            })
            dashboard.get('questions').addObject(this.get('question'))
            dashboard.save().then((response)=> {
                this.sendAction('transitionToDashBoard', response.id)
            })
        }
    }

});
