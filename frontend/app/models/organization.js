import DS from 'ember-data';


export default DS.Model.extend({
    name: DS.attr('string'),
    google_domain: DS.attr('string'),
    is_deactivated: DS.attr('boolean'),
    users: DS.hasMany('user'),
    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),

    autoSave() {
        Ember.run.debounce(this, () => {
            this.save()
        }, 2000)
    },

    autoSaveObserver: Ember.observer('name', 'google_domain', function () {
        if (this.get('id')) {
            this.autoSave()
        }
    }),

});
