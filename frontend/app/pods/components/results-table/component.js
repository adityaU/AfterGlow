import Ember from 'ember';
import Table from 'ember-light-table';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

const {
    computed,
    observer
} = Ember;

export default Ember.Component.extend({
    classNames: ["h-100"],
    page: 1,
    perPage: 15,

    pagedRows: pagedArray('results.rows'),

    resetPageObserver: observer('results', function () {
        this.set('pagedRows.page', 1);
    }),
    showResults: computed('results', function () {
        return (this.get('results.rows').length > 0);
    }),

    page: Ember.computed.alias('pagedRows.page'),
    perPage: Ember.computed.alias('pagedRows.perPage'),
    totalPages: Ember.computed.oneWay('pagedRows.totalPages'),
    showPageNumbers: Ember.computed('totalPages', function () {
        return this.get('totalPages') - 1;
    }),
    actions: {
        editApiAction(apiAction) {
            this.set('editableApiAction', apiAction);
            this.set('toggleEditApiActionModal', true);
        },
        showDeleteApiActionModal(apiAction) {
            this.set('deletableApiAction', apiAction);
            this.set('toggleDeleteApiActionModal', true);
        },
        deleteApiAction(apiAction) {
            apiAction.destroyRecord();
        },
        apply(){
            this.sendAction('apply')
        },
        callApiAction(apiAction, row) {
            let variables = this.get('results.columns').map((item, index) => {
                return {
                    name: item,
                    value: row[index]
                };
            });
            apiAction.sendCall({
                variables: variables
            }).then((response) => {
                if (response.redirect_url) {
                    window.open(response.redirect_url, '_blank');
                } else {
                    this.set('apiActionResult', response);
                    this.set('toggleApiActionResult', true);

                }
            }).catch((error) => {
                this.set('apiActionResult', {
                    status_code: 0,
                    response_body: '{"error" : "Could not parse Response" }'
                });
                this.set('toggleApiActionResult', true);
            });
        }

    }
});
