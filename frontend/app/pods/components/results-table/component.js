import Ember from 'ember';
import Table from 'ember-light-table';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

const {
    computed,
    observer
} = Ember;

export default Ember.Component.extend({
    page: 1,
    perPage: 15,

    pagedRows: pagedArray('results.rows'),

    resetPageObserver: observer("results", function () {
        this.set('pagedRows.page', 1)
    }),
    showResults: computed('results', function () {
        return (this.get('results.rows').length > 0)
    }),

    page: Ember.computed.alias("pagedRows.page"),
    perPage: Ember.computed.alias("pagedRows.perPage"),
    totalPages: Ember.computed.oneWay("pagedRows.totalPages"),
    showPageNumbers: Ember.computed('totalPages', function () {
        return this.get('totalPages') - 1
    })
});
