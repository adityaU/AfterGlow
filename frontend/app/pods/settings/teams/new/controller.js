import Ember from 'ember';

export default Ember.Controller.extend({
    team: Ember.computed(function () {
        return this.store.createRecord('team', {})
    }),


    actions: {
        saveTeam() {

            this.get('team').save().then((response) => {
                this.transitionToRoute('settings.teams.edit', response.id);
            })

        }
    }
});
