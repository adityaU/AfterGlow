import Ember from 'ember';
import ChartSettings from '../../../mixins/chart-settings'
import ColorMixin from '../../../mixins/colors-mixin'

export default Ember.Component.extend(ChartSettings, ColorMixin, {
  classNames: ["h-100"],
  colorway: Ember.computed(function () {
    return this.get('colors').join("")
  }),
  setState(s, context) {
    let resultsViewSettings = {
      aggregatorName: s.aggregatorName,
      colOrder: s.colOrder,
      cols: s.cols,
      derivedAttributes: s.derivedAttributes,
      hiddenAttributes: s.hiddenAttributes,
      hiddenFromAggregators: s.hiddenFromAggregators,
      hiddenFromDragDrop: s.hiddenFromDragDrop,
      menuLimit: s.menuLimit,
      rendererName: s.rendererName,
      rowOrder: s.rowOrder,
      rows: s.rows,
      sorters: s.sorters,
      unusedOrientationCutoff: s.unusedOrientationCutoff,
      vals: s.vals,
      valueFilter: s.valueFilter,
      resultsViewType: "Pivot Table"
    }
    context.set('resultsViewSettings', resultsViewSettings)
  },

  componentContext: Ember.computed(function () {
    return this;
  }),

  actions: {
    remove() {
      this.sendAction('remove', this.get('question'))
    },

    refresh() {
      this.sendAction('refresh', this.get('question'))
    },
    apply(){
      this.sendAction('apply')
    }
  }
});
