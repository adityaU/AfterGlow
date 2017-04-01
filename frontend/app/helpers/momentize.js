import Ember from 'ember';

export function momentize(params/*, hash*/) {
    if (params && params.length > 0 && params[0]){
        return moment(params[0]).fromNow()
    }
}

export default Ember.Helper.helper(momentize);
