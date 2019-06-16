import Ember from 'ember';

function isGroupByDateType(obj) {

    let dataType = obj.get('selected.data_type');
    if ((dataType == 'date') || (dataType == 'datetime') || (dataType == 'timestamp without time zone') || dataType == 'timestamp') {
        return true;
    } else {
        return false;
    }

}




export default Ember.Helper.extend({

    compute([obj, prop1, prop2, prop3, prop4]) {


        let label = (obj.get('selected.human_name') || obj.get('selected.name') || obj.get('selected.value') || (obj.get('selected.raw') && obj.get('selected.raw').toString()));

        if (isGroupByDateType(obj)) {
            label = label + ': ' + obj.get('castType.name');
        }
        if (obj.get('column')) {
            label = obj.get('column.human_name') || obj.get('column.name');
        }

        if (obj.get('order')) {
            label = label + ': ' + obj.get('order.name');
        }
        return label

    }
});
