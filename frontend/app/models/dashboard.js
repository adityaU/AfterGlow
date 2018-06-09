import DS from 'ember-data';
import Ember from 'ember';
export default DS.Model.extend({
    router: Ember.inject.service(),
    title: DS.attr('string'),
    description: DS.attr('string'),
    inserted_at: DS.attr('utc'),
    updated_at: DS.attr('utc'),
    shareable_link: DS.attr('string'),
    is_shareable_link_public: DS.attr('boolean'),
    has_permission: DS.attr('boolean'),
    settings: DS.attr('object'),
    question_count: DS.attr('string'),
    questions: DS.hasMany('questions'),
    shared_to: DS.attr(),
    variables: DS.hasMany('variables'),
    tags: DS.hasMany('tags'),

    isEditing: false,

    toggleGrid: Ember.on('init', Ember.observer('isEditing', function () {
        var grid = Ember.$('.grid-stack').data('gridstack');
        if (this.get('isEditing')) {
            grid && grid.enable();
        } else {
            grid && grid.disable();
        }

    })),

    gridSettings: Ember.computed('isEditing', 'settings.{}', function () {

        let settings = this.get('settings');
        // Object.keys(settings).forEach((key) => {
        //     var setting = settings.get(key);
        //     if (typeof (setting) === 'object') {
        //         setting['no-move'] = !this.get('isEditing');
        //         setting['no-resize'] = !this.get('isEditing');
        //         setting['resize-handles'] = this.get('isEditing');
        //         settings.set(key, setting);
        //     }
        // });
        return settings;
    }),

    shareable_url: Ember.computed('shareable_link', function () {
        return window.location.origin + this.get('router').urlFor('dashboards.show', {
            dashboard_id: this.get('id'),
            queryParams: {
                share_id: this.get('shareable_link')
            }
        });

    })
});
