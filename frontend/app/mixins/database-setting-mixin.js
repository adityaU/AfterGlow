import Ember from 'ember';

export default Ember.Mixin.create({
    aceModes: {
        postgres: "ace/mode/sql",
        influxdb: "ace/mode/sql",
        mongo: "ace/mode/javascript"
    },

    showTableInSqlModeSetting: {
        postgres: false,
        influxdb: false,
        mongo: true
    }
});
