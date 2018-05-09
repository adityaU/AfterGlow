import Ember from 'ember';

export default Ember.Component.extend({
    tables: Ember.computed('database.tables', 'database.tables.isLoaded', 'query', function () {
        let tables = this.get('database.tables');
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
        return tables;
    }),
    actions: {
        toggleColumns(table) {
            table.toggleProperty('showColumnsInTree');
        }
    }
});
