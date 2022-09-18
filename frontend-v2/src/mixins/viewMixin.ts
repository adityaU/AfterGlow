const ViewMixin = {
   methods: {
                getDisplayValues(view) {
                        if (view.raw){
                          return [[view.value, 2]].filter((item) => item[0] != null)
                        }                        
                        if (view.isAggregation){
                          if (view.agg == 'percentile of'){
                            return [[view.value, 1], [view.agg, 0], [view.column, 1]].filter((item) => item[0] != null)
                          }
                          return [[view.agg, 0], [view.column, 1]].filter((item) => item[0] != null)
                        }
                        return view.columns.length ? [[view.columns.join(", "), 0]] : []
                          
                },
     
   }

}

export {ViewMixin}
