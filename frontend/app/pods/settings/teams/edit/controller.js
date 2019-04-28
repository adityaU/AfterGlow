import Ember from 'ember';

export default Ember.Controller.extend({
    team: Ember.computed.alias('model'),


    actions: {
        saveDatabase() {
            this.get('team').save()
                .then((response) => {
                    this.transitionToRoute('settings.teams.index');
                });

        }
    }
});
