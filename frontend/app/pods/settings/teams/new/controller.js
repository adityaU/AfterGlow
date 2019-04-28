import Ember from 'ember';

export default Ember.Controller.extend({
    team: {
        name: null,
        description: null,
    },


    actions: {
        saveTeam() {
            this.store.createRecord('team', this.get('team')).save()
                .then((response) => {
                    this.transitionToRoute('settings.teams.edit', response.id);
                });

        }
    }
});
