import Ember from 'ember';

import FormatObject from 'frontend/helpers/format-object';
import Capitalize from 'frontend/helpers/capitalize';
function isGroupByDateType(obj) {

    let dataType = obj.get('selected.data_type');
    if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone') || dataType == 'timestamp') {
        return true;
    } else {
        return false;
    }

}




export default Ember.Helper.extend({

    compute([obj, prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop7]) {
        let formatObject = new FormatObject()
        let capitalize = new Capitalize()

        let label = (obj.get('selected.human_name') || obj.get('selected.name') || obj.get('selected.value') || (obj.get('selected.raw') && obj.get('selected.raw').toString()));

        if (isGroupByDateType(obj)) {
            label = label + ': ' + obj.get('castType.name');
        }
        if (obj.get('column')) {
            label = capitalize.compute([obj.get('column.human_name') || obj.get('column.name')]);
        }

        if (obj.get('order')) {
            label = label + ': ' + obj.get('order.name');
        }
        if (obj.get('raw')){
            label = obj.get('value')
        }
        if (obj.get('operator') && obj.get('column') && (obj.get('value') || obj.get('valueDateObj.value') )){
            label = `${capitalize.compute([obj.get('column.human_name')])} ${obj.get('operator.value')}`
            if (obj.get('valueDateObj.value')) {
                 label = label + ` ${obj.get('valueDateObj.value')} ${obj.get('valueDateObj.duration.name') || "Days"} ${obj.get('valueDateObj.dtt.name') || 'Ago'}`
            }else{
                if (obj.get('value').constructor.name == 'Date'){

                  label = label + ` ${formatObject.compute([obj.get('value').toISOString()])}`
                }else{

                  label = label + ` ${formatObject.compute([obj.get('value')])}`
                }
            }
        }
        return label

    }
});
