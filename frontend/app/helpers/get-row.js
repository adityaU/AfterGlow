
import Ember from 'ember';




export default Ember.Helper.extend({

    compute([rows, page, perPage, col_index]) {
        return rows && rows[(page - 1) * perPage + col_index - 1]
    }
})
