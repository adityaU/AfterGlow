import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    toast: Ember.inject.service(),
    db: {
        name: null,
        db_url: null,
    },

    dbTypes: [
        'postgres',
        'influxdb',
        'mongo'
    ],

    actions:{
        saveDatabase(){
            this.store.createRecord('database',this.get('db')).save()
                .then((response)=>{
                    this.transitionToRoute('settings.databases.index');
                })
            
        },
        testConnection(){
            this.get('ajax').apiCall({
                url: this.get('ajax.apiHost') + this.get('ajax.apiNamespace') + '/databases/test_connection',
                type: 'POST',
                data: {db_url: this.get('db.db_url')}
            },(response, status)=>{
                this.get('toast').success("YaY", "Connection successful", {closeButton: true, timeout: 150000000, progressBar:false});
            },(error, status)=>{
                this.get('toast').error(error.error, "Connection Failed", {closeButton: true, timeout: 1500, progressBar:false});
            })
        }
    }
});
