import Ember from 'ember';

export default Ember.Component.extend({
    db: Ember.computed('database', function () {
        let database = this.get('database');
        return this.get('store').peekRecord('database', database.id) || this.get('store').findRecord('database', database.id);
    }),
    tables: Ember.computed('db', 'db.isLoaded', 'db.tables', 'db.tables.isLoaded', 'query', function () {
        let tables = this.get('db.tables');
        let query = this.get('query');
        query = query && query.trim();
        if (tables && query && query !== '') {
            return tables.filter((item) => {
                return item.get('readable_table_name') &&
                    item.get(
                        'readable_table_name'
                    ).toLowerCase().match(query.toLowerCase());
            });
        }
        return tables.slice(0, 10);
    }),
    actions: {
        toggleColumns(table) {
            table.toggleProperty('showColumnsInTree');
        }
    }
});
