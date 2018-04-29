import Ember from 'ember';

export default Ember.Component.extend({
    dashboards: Ember.computed(function () {
        return this.get('store').peekAll('dashboard');
    }),
    dashboard: {},

    actions: {
        createDashboard(){
            Ember.$('.ui.modal.create-dashboard').modal('show');
        },
        createAndAddToDashboard() {
            let object = {}
            object[this.get('question.id')] = {width:6, height: 6}
            let dashboard = this.store.createRecord('dashboard', {
                title: this.get('dashboard.title'),
                description: this.get('dashboard.description'),
                settings: object
            })
            dashboard.save().then((response) => {
              this.sendAction('addToDashboard' , dashboard);
            })

        },
        addToDashboard(dashboard){
            this.sendAction('addToDashboard' , dashboard);
        },
        clear() {
            this.set('open', false);
        }
    }
});
