import Ember from 'ember';

import formatObject from 'frontend/helpers/format-object';

export default Ember.Helper.extend({
    compute(params/*, hash*/) {
    if (params && params.length > 0 && params[0]){
        let number = +params[0]
        if (number.toString() != 'NaN'){
            return number.toLocaleString()
        }else{
            return new formatObject().compute(params)
        }
    }
}
})

