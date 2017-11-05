import PhoenixSocket from 'phoenix/services/phoenix-socket';

export default PhoenixSocket.extend({
    store: Ember.inject.service(),
    init() {
        // You may listen to open, "close" and "error" 
        this.on('open', () => {
            console.log('Socket was opened!');
        })
    },
    connect(query_result_id) {
        // connect the socket 
        this._super(this.get('store').adapterFor('application').socketHost + "/socket", {
            params: {}
        });
        // join a channel 
        let channel = this.joinChannel("query_result:" + query_result_id, {});
        // add message handlers
        this.set('channel', channel)
        this.set('query_key', query_result_id)
        channel.on("notification", () => this._onNotification(...arguments));
        channel.on("completed_query", (payload) => { this._onCompletedQuery(payload)});
        channel.on("get_results", (payload) => { this._onGetResults(payload)});
    },
    _onNotification(message) {
        alert(`Notification: ${message}`);
    },
    _onCompletedQuery(payload){
        this.getQueryResults({query_key: payload.query_key, page: 1})
    },
    _onGetResults(payload){
        this.set('loading', false)
        this.set('results', payload)
    },

    getQueryResults(payload){
        let channel = this.get('channel')
        this.set('loading', true)
        channel.push("get_results", payload)
    }

});
