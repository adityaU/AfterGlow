import Ember from 'ember';

import QuestionNewController from '../../../new/controller'
import ResultViewMixin from 'frontend/mixins/result-view-mixin'
export default QuestionNewController.extend(ResultViewMixin, {
    snapshot: Ember.computed.alias('model'),
    columns: Ember.computed.alias('snapshot.columns'),
    rows: Ember.computed.alias("snapshot.snapshotData"),

    results: Ember.computed('columns', 'rows', function(){
        return {
            columns: this.get('columns'),
            rows: this.get('rows').map(function(item){
               return  item.get('rowValues')
            })
        }
    }),
    actions: {

        downloadData(){
            let queryObject = {snapshot_id:  this.get('snapshot.id')}
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/create_csv',
                type: 'POST',
                data: queryObject
            },(response, status)=>{

                this.get('toast').success(
                    "Your CSV is getting uploaded to cloud. You'll get an email with download link shortly",
                    'YaY!',
                    {closeButton: true, timeout: 1500, progressBar:false}
                );
            },(error, status)=>{
                this.get('toast').success(
                    "Looks like CSV download process is not working as expected. Please try again. If problem persists, talk to your Admin",
                    'Sorry Mate!',
                    {closeButton: true, timeout: 1500, progressBar:false}
                );
            })
        },
    }
});
