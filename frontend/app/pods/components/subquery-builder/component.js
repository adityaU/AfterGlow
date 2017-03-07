import Ember from 'ember';

export default Ember.Component.extend({

    selectedTable: null,
    tables: Ember.computed('queryObject.database', function(){
        return this.get("queryObject.database.tables")
    }),
    filters: [{column: "c1", operator: "Not In", value: 5}],
    selectViews: [{selected:{name: "Count", value: "count" }}],

    groupBys: [
        {selected: {name: "c1", id: 1}},
        {selected: {name: "c1", id: 1}},
        {selected: {name: "c1", id: 1}},
        {selected: {name: "c1", id: 1}},
        {selected: {name: "c1", id: 1}}
    ],
    columns: Ember.computed('queryObject.table', function(){
        return this.get("queryObject.table.columns")
    }),
    viewOptions: [
        {
            name: "Raw Data",
            value: "raw_data"
        },
        {
            name: "count",
            value: "count"
        }
    ],
    orders:[
        {
            
            name: "Asending",
            value: "ASC"
        },
        {
            
            name: "Desending",
            value: "DESC"
        },

    ],

    rawObject: Ember.computed(function(){
        return  Ember.Object.extend({
           selected: null,
            label: Ember.computed("selected", "selected.value", function(){
                if (this.get('selected.raw') == true){
                    this.set('selected.human_name', null)
                    this.set('selected.name', null)
                }
               return (this.get("selected.human_name") || this.get('selected.name') || this.get('selected.value'))
            })
       })
    }),
    rawObjectWithSelected(_this){
        let selected = _this.get('rawObject').create()
        selected.set("selected", Ember.Object.create({raw: false, value: null}))
        return selected;
    },

    filtersTagsShow: Ember.computed("queryObject.filters.@each.label", function(){
        let show = false
        let filters = this.get('queryObject.filters')
        filters.forEach((item) =>{
            if (item.label){
                show = true
            } 
        });
        return show;
    }),
    actions :{
        addFilter(){
            this.get("queryObject.filters").pushObject(Ember.Object.create({column: null, operator: null, value: null}))
        },

        addView(){
            this.get("queryObject.views").pushObject(this.get('rawObjectWithSelected')(this));
        },

        addGroupBy(){
            this.get("queryObject.groupBys").pushObject(this.get('rawObjectWithSelected')(this));
        },
        addOrderBy(){
            this.get("queryObject.orderBys").pushObject({});
        },
        switchToBuilder(type, el, handleSelected){
            var items = this.get('queryObject').get(type) 
            if (handleSelected){
                el.set('selected.raw', false)
            }else{
                el.set('raw', false)
            }
        },
        switchToRaw(type, el, handleSelected){
            var items = this.get('queryObject').get(type) 
            if (handleSelected){
                el.set('selected', Ember.Object.create({raw: true}))
            }else{
                el.set('raw', true)
            }
        }
    }
});
