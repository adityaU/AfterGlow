import Ember from 'ember';

export function localize(params/*, hash*/) {
    if (params && params.length > 0 && params[0]){
        return params[0].toLocaleString()
    }
}

export default Ember.Helper.helper(localize);
