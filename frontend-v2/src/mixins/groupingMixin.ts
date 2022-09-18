import { findDataType } from 'src/helpers/dataTypes';
const GroupingMixin = {
   methods: {
                getDisplayValues(grouping, colDetails) {
                        if (grouping.raw){
                          return [[grouping.value, 2]].filter((item) => item[0] != null)
                        }                        
                        if (this.getColumnDataType(grouping, colDetails) === 'datetime') {
                                        return [[grouping.column, 0], [grouping.duration, 1]].filter((item) => item[0] != null)
                        }

                        return [[grouping.column, 0]].filter((item) => item[0] != null)

                },
                getColumnDataType(grouping, colDetails) {
                        if (!grouping.column) {
                                return null
                        }

                        return findDataType(colDetails, grouping.column) || 'text'

                },
     
   }

}

export {GroupingMixin}
