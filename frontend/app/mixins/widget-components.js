import Ember from 'ember';

export default Ember.Mixin.create({

    widgetItemKeyValuePairs: Ember.computed('widget.widget_items.@each', 'widget.widget_items.isFulfilled', function () {
        let widget_items = this.get('widget.widget_items');
        let obj = {};
        widget_items && widget_items.forEach((item) => {
            obj[item.get('value')] = item;
        });

        return obj;
    }),

    applicableWidgetItem: Ember.computed('widgetItemKeyValuePairs', 'el', function () {
        return this.get('widgetItemKeyValuePairs')[this.get('el')];
    }),

    widgetComponentNames: {
        progress_bar: 'progress-bar',
        direction: 'direction-widget',
        icon_and_text: 'icon-and-text',
        tag: 'tag-widget',
        row_color: 'row-color',
        row_border: 'row-border',
        prefix: 'prefix-widget',
        suffix: 'suffix-widget'
    },

});
