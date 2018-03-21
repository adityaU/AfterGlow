import Ember from 'ember';
import ChartSettings from '../../../mixins/chart-settings'
import ColorMixin from '../../../mixins/colors-mixin'

export default Ember.Component.extend(ChartSettings, ColorMixin,{
  colorway: Ember.computed(function(){
    return this.get('colors').join("")
  }),
  setState(s, context){
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

  componentContext: Ember.computed(function(){
    return this;
  }),

  actions: {
    toggleFullscreen(){
      if (this.get('fullscreenClass')){
        this.set("fullscreenClass", null)
      }else{
        this.set("fullscreenClass", 'fullscreen')
      }
    }
  }
});
