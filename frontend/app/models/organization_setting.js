import DS from 'ember-data';


export default DS.Model.extend({
    name: DS.attr('string'),
    value: DS.attr('string'),
    setting_type: DS.attr('string'),
    is_secret: DS.attr('boolean'),
    user: DS.belongsTo('user'),
    api_action: DS.belongsTo('api_action'),
    inserted_at: DS.attr('date'),
    updated_at: DS.attr('date'),

    autoSave() {
        Ember.run.debounce(this, () => {
            this.save()
        }, 2000)
    },

    autoSaveObserver: Ember.observer('name', 'value', function () {
        if (this.get('id')) {
            this.autoSave()
        }
    }),
});
