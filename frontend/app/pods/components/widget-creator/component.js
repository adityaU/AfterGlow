import Ember from 'ember';
import WidgetComponents from 'frontend/mixins/widget-components';


export default Ember.Component.extend(WidgetComponents, {
    widget: Ember.computed('', function () {
        return this.get('store').createRecord('widget', {
            renderer: 'icon_and_text',
            question: this.get('question')
        });
    }),

    widgetRenderer: Ember.computed('widget.renderer', function () {
        let widgetRenderer = this.get('widget.renderer');
        if (widgetRenderer) {
            widgetRenderer = this.get('widgetRenderers').filter((item) => {
                return item['value'] === widgetRenderer;
            })[0];
            return widgetRenderer;
        }
    }),

    selectedColumn: Ember.computed('widget.column_name', function () {
        let selectedColumn = this.get('widget.column_name');
        if (selectedColumn) {
            selectedColumn = this.get('columns').filter((item) => {
                return item['human_name'] === selectedColumn;
            })[0];
            return selectedColumn;
        }
    }),

    columns: Ember.computed(function () {
        return this.get('question.cached_results.columns').map((item, index) => {
            return {
                name: item,
                human_name: item,
            };
        });
    }),



    editableWidgetComponent: Ember.computed('widget.renderer', function () {
        let renderer = this.get('widget.renderer');
        if (renderer) {
            return `widgets/editable/${this.get('widgetComponentNames')[renderer]}`;
        }
        return 'widgets/editable/icon-and-text';
    }),

    widgets: Ember.computed('widgetQuery', function () {
        return this.store.query('widget', {
            query: (this.get('widgetQuery') || '')
        });
    }),

    selectedWidgets: Ember.computed('question.widgets.@each', 'question.widgets.isFulfilled', function () {
        return this.get('question.widgets').map((item) => {
            return this.get('store').peekRecord('widget', item.get('id'));

        }).filter((item) => {
            return item;
        });
    }),

    widgetRenderers: [

        // {
        //     title: 'Progress Bar',
        //     value: 'progress_bar'
        // },

        {
            title: 'Icon and Text',
            value: 'icon_and_text'
        },


        {
            title: 'Tag',
            value: 'tag'
        },

        // {
        //     title: 'Row Color',
        //     value: 'row_color'
        // },
        // {
        //     title: 'Row Border',
        //     value: 'row_border'
        // },


        {
            title: 'Prefix',
            value: 'prefix'
        },
        {
            title: 'suffix',
            value: 'suffix'
        }
    ],

    widgetItemsObserver: Ember.observer('widget.widget_items.[]', function () {
        if (this.get('afterSave')) {
            return;
        }
        this.set('allWidgetItems', this.get('widget.widget_items'));
    }),
    actions: {
        clear() {
            this.set('open', false);
        },
        save() {
            this.set('afterSave', true);

            this.get('widget.widget_items').forEach((item) => {
                if (item.get('id')) {
                    item.save();
                }
            });
            this.get('widget').save().then((resp) => {
                this.get('allWidgetItems').forEach((item) => {
                    if (!item.get('id')) {
                        item.set('widget', this.get('widget'));
                        item.save();
                    }
                });

                this.set('afterSave', false);

            });
        },
        convertToWidgetItems() {
            try {
                var items = JSON.parse(this.get('widget.itemsJson'));
                this.set('invalidJsonError', false);
            } catch (e) {
                this.set('invalidJsonError', true);
                return;
            }
            Object.keys(items).forEach((key) => {
                this.get('store').createRecord('widget_item', {
                    widget: this.get('widget'),
                    value: key,
                    text: items[key],
                    config: {}
                });
            });
        },
        toggleWidgetItemJson() {
            this.set('widget.showItemsJson', false);
        },
        removeWidgetItem(widgetItem) {
            widgetItem.destroyRecord();
        },
        addWidgetItem() {
            this.get('store').createRecord('widget_item', {
                widget: this.get('widget'),
                value: 'Key',
                text: 'value',
                config: {}
            });

        },
        updateWidgetSearch(text) {
            this.set('widgetQuery', text);
        },
        setWidgetRenderer(item) {
            if (item && item.value) {
                this.set('widget.renderer', item.value);
            }
        },
        selectColumn(item) {
            if (item && item.human_name) {
                this.set('widget.column_name', item.human_name);
            }
        },
        saveQuestion() {
            this.get('question').save();
            this.set('open', false);
        }
    }
});
