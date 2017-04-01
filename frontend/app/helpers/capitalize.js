import Ember from 'ember';

export function capitalize(params/*, hash*/) {
    if (params && params.length > 0 && params[0]){
        params = params[0].replace(/_/g, ' ');
        return params.capitalize();
    }
}

export default Ember.Helper.helper(capitalize);
