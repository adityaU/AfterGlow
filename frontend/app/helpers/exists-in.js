import Ember from 'ember';

export function existsIn(params /*, hash*/ ) {
    if (params && (params[0] || params[0] === 0) && params[1]) {
        return (params[1].foreign_key_columns &&
            Object.keys(params[1].foreign_key_columns).indexOf(params[1].columns[params[0]]) > -1);
    }
}

export default Ember.Helper.helper(existsIn);
