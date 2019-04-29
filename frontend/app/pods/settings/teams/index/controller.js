import Ember from 'ember';

export default Ember.Controller.extend({
    teams: Ember.computed.sort('model', function (a, b) {
        if (a.get('name').toLowerCase() <= b.get('name').toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    }),

    actions: {
        showDeleteDialogue(teamToBeDeleted) {
            this.set('teamToBeDeleted', teamToBeDeleted);
            this.set('toggleDeleteDialogue', true);
        },
        deleteTeam(team) {
            team.destroyRecord().then((team) => {});
        },
    }
});
