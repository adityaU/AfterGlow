import Ember from 'ember';
import WidgetComponents from 'frontend/mixins/widget-components';

export default Ember.Component.extend(WidgetComponents, {

    widget: Ember.computed('el', 'index', 'question.cached_results', 'results', 'question.widgets.@each', 'question.widgets.isFulfilled', function () {
        let columns = this.get('results.columns') || this.get('question.cached_results.columns');
        if (columns) {
            let columnName = columns[this.get('index')];

            return this.get('question.widgets') && this.get('question.widgets').findBy('column_name', columnName);

        }
    }),

    rendererComponent: Ember.computed('widget', function () {
        let renderer = this.get('widget') && this.get('widget.renderer');
        if (renderer) {
            return `widgets/renderer/${this.get('widgetComponentNames')[renderer]}`;
        }
    }),

});
