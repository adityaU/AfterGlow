import Ember from 'ember';

export default Ember.Controller.extend({
    user: Ember.computed.alias('model'),
    permissionSets: Ember.computed(function () {
        return this.store.findAll('permission-set');
    }),
    teams: Ember.computed(function () {
        return this.store.findAll('team');
    }),
    selectedTeams: Ember.computed('user.teams', function () {
        return this.get('user.teams') && this.get('user.teams').map((item) => {
            return this.get('store').peekRecord('team', item.get('id'));
        });
    }),


    actions: {

        showChangePermissionDialogue(user) {
            this.set('toBeChangedUser', user);
            this.set('togglePermissionsModal', true);
        },
        saveUser(user) {
            user.save().then((user) => {});
        },
        mutTeams(teams) {
            let alreadyAddedTeamIDs = this.get('user.teams').map((team) => {
                return team.id;
            });
            let teamIds = teams && teams.map((team) => {
                return team.id;
            });
            let newTeams = teamIds && teamIds.filter((teamid) => {
                return !alreadyAddedTeamIDs.contains(teamid);
            });
            let toBeRemovedTeams = alreadyAddedTeamIDs && alreadyAddedTeamIDs.filter((teamid) => {
                return !teamIds.contains(teamid);
            });
            if (newTeams[0]) {
                this.store.peekRecord('team', newTeams[0]).addUser({
                    user_id: +this.get('user.id')
                });
            }
            if (toBeRemovedTeams[0]) {
                this.store.peekRecord('team', toBeRemovedTeams[0]).removeUser({
                    user_id: +this.get('user.id')
                });
            }
            this.set('user.teams', teams);

        }
    }
});
