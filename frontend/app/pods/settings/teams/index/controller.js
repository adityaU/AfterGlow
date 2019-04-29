import Ember from 'ember';

export default Ember.Controller.extend({
    teams: Ember.computed.alias('model'),

    actions: {
        showDeleteDialogue(teamToBeDeleted) {
            this.set('teamToBeDeleted', teamToBeDeleted);
            this.set('toggleDeleteDialogue', true);
        },
        deleteTeam(team) {
            team.destroyRecord().then((team) => { })
        },
    }
});
