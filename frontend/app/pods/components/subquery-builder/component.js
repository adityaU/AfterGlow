import Ember from 'ember';

export default Ember.Component.extend({

    selectedTable: null,
    unsortedTables: Ember.computed('queryObject.database','databases.content.isLoaded', 'queryObject.database.id', 'database.tables.content.isLoaded',  function(){
        if (this.get('queryObject.database') && this.get('databases.length') &&  this.get('queryObject.database.id')){
          let store = this.get('store')
          let database = store.peekRecord('database', this.get('queryObject.database.id')) ||  store.findRecord('database', this.get('queryObject.database.id'))
            return database && database.get('tables')
        }
    }),

    tables: Ember.computed("unsortedTables", "unsortedTables.content.isLoaded", function(){
        return this.get("unsortedTables") && this.get("unsortedTables").sortBy('human_name')
    }),
    databaseObserver:  Ember.observer('queryObject.database', function(){
        this.set('queryObject.table', null); 
        this.set('queryObject.filters', []); 
        this.set('queryObject.groupBys', []); 
        this.set('queryObject.orderBys', []); 
        this.set('queryObject.rawQuery', null); 
        
    }),
    tableObserver:  Ember.observer('queryObject.table', function(){
        this.set('queryObject.filters', []); 
        this.set('queryObject.groupBys', []); 
        this.set('queryObject.orderBys', []); 
    }),
    filters: [{column: "c1", operator: "Not In", value: 5}],
    selectViews: [{selected:{name: "Count", value: "count" }}],
    unsortedColumns: Ember.computed('queryObject.table','tables.content.isLoaded', function(){
        if (this.get('queryObject.table') && this.get('tables.length') && this.get('queryObject.table.id')){
          let store = this.get('store')
          let table = this.get('tables').findBy('id', this.get('queryObject.table.id'))
            return table && table.get('columns')
        }
    }),

    columns: Ember.computed("unsortedColumns", "unsortedColumns.content.isLoaded", function(){
        return this.get("unsortedColumns") && this.get("unsortedColumns").sortBy('name')
    }),
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
        selected.set("castType", Ember.Object.create({}))
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
            this.get("queryObject.filters").pushObject(Ember.Object.create({column: null, operator: null, value: null, valueDateObj: {}}))
        },

        addView(){
            this.get("queryObject.views").pushObject(this.get('rawObjectWithSelected')(this));
        },

        addGroupBy(){
            this.get("queryObject.groupBys").pushObject(this.get('rawObjectWithSelected')(this));
        },
        addOrderBy(){
            this.get("queryObject.orderBys").pushObject(Ember.Object.create({}));
        },
        switchToBuilder(type, el, handleSelected){
            var items = this.get('queryObject').get(type) 
            if (handleSelected){
                el.set('selected', Ember.Object.create({}))
                el.set('castType', null)
            }else{
                el.set('raw', false)
            }
        },
        switchToRaw(type, el, handleSelected){
            var items = this.get('queryObject').get(type) 
            if (handleSelected){
                el.set('selected', Ember.Object.create({raw: true}))
                el.set('castType', null)
            }else{
                el.set('raw', true)
            }
        },
        remove(type, el){
            let arr = this.get("queryObject").get(type);
            arr.removeObject(el)
        }
    }
});
