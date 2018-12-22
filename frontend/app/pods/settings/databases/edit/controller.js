import Ember from 'ember';

export default Ember.Controller.extend({
    db: Ember.computed.alias('model'),

    dbTypes: [
        'postgres',
        'influxdb',
        'mysql',
        'redshift'
    ],

    actions: {
        selectDbType(value) {
            this.set('db.db_type', value);
        },
        saveDatabase() {
            this.get('db').save()
                .then((response) => {
                    this.transitionToRoute('settings.databases.index');
                });

        }
    }
});
