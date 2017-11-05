import Ember from 'ember';
import Table from 'ember-light-table';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

const { computed, observer } = Ember;

export default Ember.Component.extend({
    socket: Ember.inject.service(),
    page: 1,
    perPage: 10,
    dummyContent: Ember.computed("results", "results.total_results", function(){
        return Array.apply(null, Array(+this.get('results.total_results'))).map(function () {})
    }),

    dummyRows: pagedArray('dummyContent'),
    pagedRows: Ember.computed("results", "results.rows", "page", function(){
        let currentAvailablePageStart = this.get('currentAvailablePageStart')
        let currentAvailablePageEnd = this.get('currentAvailablePageEnd')
        let currentPage = this.get('page')
        let perPage = this.get('perPage')
        let rows = this.get('results.rows')
        if (rows){
            if ((currentAvailablePageStart <= currentPage) && (currentAvailablePageEnd >= currentPage)){
                return rows.slice((currentPage - currentAvailablePageStart)*perPage, (currentPage - currentAvailablePageStart + 1)*perPage)
            }else{
                debugger
                this.get('socket').getQueryResults({query_key: this.get('socket.query_key'), page: currentPage}) 
            }
        }
    }),

    resetPageObserver: observer("results", function(){
        this.set('pagedRows.page', 1)
    }),
    currentAvailablePageStart: Ember.computed.alias("results.pages_start"),
    currentAvailablePageEnd: Ember.computed.alias("results.pages_end"),
    showResults: computed('results', function(){
        return (this.get('results.rows').length > 0)
    }),

    page: Ember.computed.alias("dummyRows.page"),
    perPage: Ember.computed.alias("dummyRows.perPage"),
    totalPages: Ember.computed("results.total_results", function(){
        return Math.ceil(this.get('results.total_results')/ this.get('perPage')) 
    }),
    showPageNumbers: Ember.computed('totalPages', function(){
        return this.get('totalPages') - 1
    })
});

// import Ember from 'ember';
// import Table from 'ember-light-table';

// const { computed } = Ember

// export default Ember.Component.extend({
//     classNames: ["full"],
//     model: null,

//     tableRows: computed('results', function(){

//         let columns = this.get('results.columns');
//         return this.get('results.rows').map((row)=>{
//             var r = {};
//             row.map((item, i)=>{
//                 r[columns[i]] = r[columns[i]] ? r[columns[i]].push(item) : [item];
//             })
//             return r;
//         })
//     }),
//     columns: computed('results', function() {
//         return this.get('results.columns').map((item)=>{
//             return {label: item, valuePath: item, width: '150px'}
//         }) 
//     }),

//     table: computed('results', function() {
//         return new Table(this.get('columns'), this.get('tableRows'), {responsive: true});
//     })

// });
