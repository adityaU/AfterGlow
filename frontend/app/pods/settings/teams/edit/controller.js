import Ember from 'ember';

export default Ember.Controller.extend({
    team: Ember.computed.alias('model'),
    users: Ember.computed(function () {
        return this.store.findAll('user');
    }),
    databases: Ember.computed(function () {
        return this.store.findAll('database');
    }),
    selectedUsers: Ember.computed('team.users', function () {
        return this.get('team.users') && this.get('team.users').map((item) => {
            return this.get('store').peekRecord('user', item.get('id'));
        });
    }),
    selectedDatabases: Ember.computed('team.accessible_databases', function () {
        return this.get('team.accessible_databases') && this.get('team.accessible_databases').map((item) => {
            return this.get('store').peekRecord('database', item.get('id'));
        });
    }),


    actions: {
        mutDatabase(databases) {
            let alreadyAddedDatabaseIDs = this.get('team.accessible_databases').map((db) => {
                return db.id;
            });
            let databaseIds = databases && databases.map((db) => {
                return db.id;
            });
            let newDatabases = databaseIds && databaseIds.filter((dbid) => {
                return !alreadyAddedDatabaseIDs.contains(dbid);
            });
            let toBeRemovedDatabases = alreadyAddedDatabaseIDs && alreadyAddedDatabaseIDs.filter((dbid) => {
                return !databaseIds.contains(dbid);
            });
            if (newDatabases[0]) {
                this.get('team').addDatabase({
                    database_id: +newDatabases[0]
                });
            }
            if (toBeRemovedDatabases[0]) {
                this.get('team').removeDatabase({
                    database_id: +toBeRemovedDatabases[0]
                });
            }
            this.set('team.accessible_databases', databases);

        },
        mutUser(users) {
            let alreadyAddedUserIDs = this.get('team.users').map((user) => {
                return user.id;
            });
            let userIds = users && users.map((user) => {
                return user.id;
            });
            let newUsers = userIds && userIds.filter((userid) => {
                return !alreadyAddedUserIDs.contains(userid);
            });
            let toBeRemovedUsers = alreadyAddedUserIDs && alreadyAddedUserIDs.filter((userid) => {
                return !userIds.contains(userid);
            });
            if (newUsers[0]) {
                this.get('team').addUser({
                    user_id: +newUsers[0]
                });
            }
            if (toBeRemovedUsers[0]) {
                this.get('team').removeUser({
                    user_id: +toBeRemovedUsers[0]
                });
            }
            this.set('team.users', users);
        },
        saveDatabase() {
            this.get('team').save()
                .then((response) => {
                    this.transitionToRoute('settings.teams.index');
                });

        }
    }
});
