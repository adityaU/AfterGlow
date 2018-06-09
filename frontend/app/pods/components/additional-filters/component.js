import Ember from 'ember';

export default Ember.Component.extend({
    watchAdditionalFilters: Ember.on('init', Ember.observer('queryObject.additionalFilters', function () {
        if (!this.get('queryObject.additionalFilters')) {
            this.set('queryObject.additionalFilters', Ember.Object.create());
        } else {
            this.set('queryObject.additionalFilters.filters', this.get('queryObject.additionalFilters.filters') && this.get('queryObject.additionalFilters.filters').map((item) => {
                return Ember.Object.create(item);
            }));
            this.set('queryObject.additionalFilters.views', this.get('queryObject.additionalFilters.views') && this.get('queryObject.additionalFilters.views').map((item) => {
                return Ember.Object.create(item);
            }));
            this.set('queryObject.additionalFilters.groupBys', this.get('queryObject.additionalFilters.groupBys') && this.get('queryObject.additionalFilters.groupBys').map((item) => {
                return Ember.Object.create(item);
            }));
            this.set('queryObject.additionalFilters.orderBys', this.get('queryObject.additionalFilters.orderBys') && this.get('queryObject.additionalFilters.orderBys').map((item) => {
                return Ember.Object.create(item);
            }));
        }
    })),

    columns: Ember.computed('results', 'error', 'results.additional_filters_applied', function () {
        if ((this.get('results.additional_filters_applied') &&
                this.get('queryObject.additionalFilterColumns')) || this.get('error')) {

            return this.get('queryObject.additionalFilterColumns') || [];
        }
        return this.get('results.columns') && this.get('results.columns').map((item, index) => {
            return {
                name: item,
                human_name: item,
                data_type: this.figureOutDataType(index)
            };
        }) || [];
    }),

    columnsObserver: Ember.on('init', Ember.observer('columns', 'results', function () {
        if (this.get('results.columns') && this.get('columns').length > 0) {
            this.set(
                'queryObject.additionalFilterColumns',
                this.get('columns')
            );
        }
    })),

    figureOutDataType(index) {
        let dataType = 'Not Relevent';
        this.get('results.rows').every((row) => {
            if (moment(row[index], moment.ISO_8601, true).isValid()) {
                dataType = 'datetime';
                return false;
            }
            return true;
        });
        return dataType;
    },

    rawObject: Ember.computed(function () {
        return Ember.Object.extend({
            selected: null,
            label: Ember.computed('selected', 'selected.value', function () {
                if (this.get('selected.raw') == true) {
                    this.set('selected.human_name', null);
                    this.set('selected.name', null);
                }
                return (this.get('selected.human_name') || this.get('selected.name') || this.get('selected.value'));
            })
        });
    }),
    rawObjectWithSelected(_this) {
        let selected = _this.get('rawObject').create();
        selected.set('selected', Ember.Object.create({
            raw: false,
            value: null
        }));
        selected.set('castType', Ember.Object.create({}));
        return selected;
    },
    actions: {

        addFilter() {
            if (!this.get('queryObject.additionalFilters.filters')) {
                this.set('queryObject.additionalFilters.filters', []);
            }
            this.get('queryObject.additionalFilters.filters').pushObject(Ember.Object.create({
                column: null,
                operator: null,
                value: null,
                valueDateObj: {}
            }));
        },

        addView() {
            if (!this.get('queryObject.additionalFilters.views')) {
                this.set('queryObject.additionalFilters.views', []);
            }
            this.get('queryObject.additionalFilters.views').pushObject(Ember.Object.create({}));
        },

        addGroupBy() {
            if (!this.get('queryObject.additionalFilters.groupBys')) {
                this.set('queryObject.additionalFilters.groupBys', []);
            }
            this.get('queryObject.additionalFilters.groupBys').pushObject(this.get('rawObjectWithSelected')(this));
        },
        addOrderBy() {
            if (!this.get('queryObject.additionalFilters.orderBys')) {
                this.set('queryObject.additionalFilters.orderBys', []);
            }
            this.get('queryObject.additionalFilters.orderBys').pushObject(Ember.Object.create({}));
        },
        switchToBuilder(type, el, handleSelected) {
            var items = this.get('queryObject.additionalFilters').get(type);
            if (handleSelected) {
                el.set('selected', Ember.Object.create({}));
                el.set('castType', null);
            } else {
                el.set('raw', false);
            }
        },
        switchToRaw(type, el, handleSelected) {
            var items = this.get('queryObject.additionalFilters').get(type);
            if (handleSelected) {
                el.set('selected', Ember.Object.create({
                    raw: true
                }));
                el.set('castType', null);
            } else {
                el.set('raw', true);
            }
        },
        remove(type, el) {
            let arr = Ember.Object.create(this.get('queryObject.additionalFilters')).get(type);
            arr.removeObject(el);
        }
    }

});
