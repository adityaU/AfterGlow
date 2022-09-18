
import { findDataType } from 'src/helpers/dataTypes';
import {date} from 'quasar';
const datetimeFormat = "MMM DD, YYYY hh:mm A Z"
const FilterMixin = {
   methods: {
                getDisplayValues(filter, colDetails) {
                        if (filter.raw){
                            return [[filter.value, 3]].filter((item) => item[0])
                        }
                        if (this.getColumnDataType(filter, colDetails) === 'datetime') {
                                let valDisp = null
                                if (filter.value && filter.value.type === 'duration') {
                                        valDisp = filter.value.value.durationValue + " " + filter.value.value.durationType + " " + filter.value.value.durationTense

                                } else {
                                        valDisp = filter.value && filter.value.value &&  date.formatDate(new Date(filter.value.value), datetimeFormat) 
                                }
                        if (['is not NULL', 'is NULL'].indexOf(filter.operator) >=0){
                          return [[filter.column, 0], [filter.operator, 1]].filter((item) => item[0])
                        }
                                return [[filter.column, 0], [filter.operator, 1], [valDisp, 2]].filter((item) => item[0])
                        }

                        return [[filter.column, 0], [filter.operator, 1], [filter.value, 2]].filter((item) => item[0])
                },
                getColumnDataType(filter, colDetails) {
                        if (!filter.column) {
                                return null
                        }

                        return findDataType(colDetails, filter.column) || 'text'

                },
     
   }

}

export {FilterMixin, datetimeFormat}
