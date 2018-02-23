import Ember from 'ember';

export default Ember.Mixin.create({
    suggestAutoCompletions(editor,session,  position, prefix, context, callback){
        if (context.get('id')){
            this.get('ajax').apiCall({
                url: this.get('ajax.apiPath') + '/sql_autocomplete' +
                    "?database_id=" + context.get('id') + "&prefix=" + prefix,
                type: 'GET',
            },(response, status)=>{
                callback(null, response)
            },(error, status)=>{
                callback(null, [])
            })
        }else{
            callback(null, [])
        }
    }
});
