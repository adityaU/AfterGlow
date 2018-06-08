import Ember from 'ember';
import DS from 'ember-data';
export default DS.Model.extend({
    name: DS.attr('string'),
    renderer: DS.attr('string'),
    column_name: DS.attr('string'),
    widget_items: DS.hasMany('widget_item'),

    displayName: Ember.computed('name', 'column_name', function () {
        if (this.get('name') && this.get('column_name')) {
            return `${this.get('name')} on ${this.get('column_name')}`;
        }
    }),

    shouldShowJson: Ember.computed('widget_items.[]', function () {
        return !(this.get('widget_items').objectAt(0));
    }),

    canSave: Ember.computed('name', 'column_name', 'renderer', 'widget_items.@each', function () {
        return (this.get('name') && this.get('column_name') && this.get('renderer') && this.get('widget_items').objectAt(0));
    }),

    // saveAutomatically: Ember.observer('name', 'column_name', 'renderer', function () {
    //     if (this.get('name') && this.get('column_name') && this.get('renderer')) {
    //         Ember.debounce(this, function () {
    //             this.invoke('save');
    //         }, 300);
    //     }
    // })
});
