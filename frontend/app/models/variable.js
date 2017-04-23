
import DS from 'ember-data';
import ResultViewMixin from 'frontend/mixins/result-view-mixin'
export default DS.Model.extend( ResultViewMixin, {
    name: DS.attr('string'),
    default: DS.attr('string'),
    var_type: DS.attr('string'),
    column: DS.belongsTo('column'),
    default_operator: DS.attr('string'),
    question: DS.belongsTo('question'),
    dashboard: DS.belongsTo('dashboard'),
    setDate: Ember.observer("default_date", function(){
        this.set('default', moment(this.get('default_date')).toISOString())
    }),
    setDateValue: Ember.observer("date_value", function(){
        this.set('value', moment(this.get('date_value')).toISOString())
    }),

    setQuestionVariables: Ember.observer('dashboard', 'value', function(){
        let dashboard = this.get('dashboard')
        if (dashboard.get('content')){
            dashboard.get('questions').forEach((item)=>{
               let variable = item.get('variables').findBy('name', this.get('name'))
               variable && variable.set('value', this.get('value'))
            })
        }
    })

    // valueUnformattedObserver: Ember.observer('valueUnformated', 'var_type', function(){
    //     let var_type = this.get('var_type')
    //     let valueUnformatted = this.get('valueUnformatted')
    //     if (var_type == 'Date'){
    //         if (this.findIfDate(valueUnformatted)){
    //             this.set('value', `'${valueUnformatted}'`)
    //         }else{
    //             this.set('value', valueUnformatted)
    //         }
    //     }else if (var_type == "String"){
    //         this.set('value', `'${valueUnformatted}'`)
    //     }else{
    //         this.set('value', valueUnformatted)
    //     }
    // }),

    // defaultUnformattedObserver: Ember.observer('defaultUnformated', 'var_type', function(){
    //     let var_type = this.get('var_type')
    //     let defaultUnformatted = this.get('defaultUnformatted')
    //     if (var_type == 'Date'){
    //         if (this.findIfDate(defaultUnformatted)){
    //             this.set('value', `'${defaultUnformatted}'`)
    //         }else{
    //             this.set('value', defaultUnformatted)
    //         }
    //     }else if (var_type == "String"){
    //         this.set('value', `'${defaultUnformatted}'`)
    //     }else{
    //         this.set('value', defaultUnformatted)
    //     }
    // })

})
