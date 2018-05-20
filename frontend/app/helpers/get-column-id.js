import Ember from 'ember';
export function getColumnId(params /*, hash*/ ) {
    if (params && (params[0] || params[0] == 0) && params[1]) {
        let column_name = params[1].columns[params[0]];
        return params[1].foreign_key_columns[column_name];
    }
}

export default Ember.Helper.helper(getColumnId);
