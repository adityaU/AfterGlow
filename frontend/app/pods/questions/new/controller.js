/* global pushObject */

import Ember from 'ember';
import ChartSettings from 'frontend/mixins/chart-settings';
import LoadingMessages from 'frontend/mixins/loading-messages';
import ResultViewMixin from 'frontend/mixins/result-view-mixin';
import CustomEvents from 'frontend/mixins/custom-events';
import AceTools from 'frontend/mixins/ace-tools';
import DynamicQueryParamsControllerMixin from 'frontend/mixins/dynamic-query-params-controller-mixin';


export default Ember.Controller.extend(LoadingMessages, ChartSettings, ResultViewMixin, AceTools, CustomEvents, DynamicQueryParamsControllerMixin, {
    ajax: Ember.inject.service(),
    queryParamsVariables: Ember.computed.alias('question.variables'),
    reloadBasedOnQueryParamsObserver: Ember.observer('reloadBasedOnQueryParams', function () {
        this.set('question.resultsCanBeLoaded', true);
    }),

    newQuestion: true,
    databases: Ember.computed(function () {
        return this.get('store').findAll('database');
    }),

    canEdit: true,
    showVariables: false,
    question: Ember.computed('recalculate', function () {
        return this.store.createRecord('question', {
            title: 'New Question',
            human_sql: Ember.Object.create({
                fromTable: true,
                queryType: 'query_builder',
                database: null,
                table: null,
                views: [],
                filters: [],
                groupBys: [],
                orderBys: [],
                offset: null,
                rawQuery: '',
                additionalFilters: Ember.Object.create({
                    filters: [],
                    groupBys: [],
                    orderBys: [],
                    views: []
                }),
                limit: null
            }),
            results_view_settings: {
                resultsViewType: 'Table',
                numbers: [],
                dataColumns: [{}]
            },
        });
    }),
    getQuestionfromLocalStorage() {
        return JSON.parse(localStorage.getItem('AG_NEW_QUESTION') || '{}');
    },

    questionNameObserver: Ember.observer('question.title',
        'queryObject.table.human_name',
        'queryObject.filters.@each.label',
        'queryObject.views.@each.label',
        'queryObject.groupBys.@each.label',
        function () {
            if (this.get('queryObject.table.human_name') && !this.get('questionNameIsSet')) {
                let title = '';
                let filterlabels = '';
                let viewlabels = '';
                let groupBylabels = '';
                if (this.get('queryObject.views.length')) {
                    viewlabels = this.get('queryObject.views').map((item) => {
                        return item.get('label');
                    }).join(' , ');
                }
                if (viewlabels != '') {
                    title = `${viewlabels} of `;
                }
                title = title + `${this.get('queryObject.table.human_name')}`;
                if (this.get('queryObject.filters.length')) {
                    filterlabels = this.get('queryObject.filters').map((item) => {
                        return item.get('label');
                    }).join(' , ');
                }
                if (filterlabels != '') {
                    title = `${title} where ${filterlabels}`;
                }
                if (this.get('queryObject.groupBys.length')) {
                    groupBylabels = this.get('queryObject.groupBys').map((item) => {
                        return item.get('label');
                    }).join(' , ');
                }
                if (groupBylabels != '') {
                    title = `${title}, grouped by ${groupBylabels}`;
                }
                this.set('question.title', title);
            }
        }),
    resultsViewType: Ember.computed.alias('question.results_view_settings.resultsViewType'),
    questionName: Ember.computed.alias('question.title'),
    resultsViewSettings: Ember.computed.alias('question.results_view_settings'),
    queryBuilderType: Ember.computed('queryObject.queryType', function () {
        let queryType = this.get('queryObject.queryType');
        if (queryType == 'query_builder') {
            return true;
        } else {
            return false;
        }
    }),

    changeSQL: Ember.observer('queryObject.rawQuery', function () {
        this.set('question.sql', this.get('queryObject.rawQuery'));
    }),
    aceTheme: 'ace/theme/dracula',
    aceMode: 'ace/mode/sql',

    queryObject: Ember.computed.alias('question.human_sql'),

    apiNamespace: Ember.computed('store', function () {
        return this.get('store').adapterFor('application').namespace;
    }),

    apiHost: Ember.computed('store', function () {
        return this.get('store').adapterFor('application').host;
    }),
    showGetResults: false,
    showGetResultsObserver: Ember.observer('queryObject.database', 'queryObject.table', 'queryObject.queryType', 'queryObject.rawQuery', function () {
        let showGetResults = ((this.get('queryObject.database') && this.get('queryObject.table')) ||
            (this.get('queryObject.database') && (this.get('queryObject.queryType') == 'raw') && this.get('queryObject.rawQuery')));
        Ember.run.next(this, function () {
            this.set('showGetResults', showGetResults);
        });
    }),
    errorMessage: Ember.computed('errors', 'question.errorMessage', function () {

        return this.get('errors.message') || this.get('question.errorMessage')
    }),

    resultsWidgetSettingsComponent: Ember.computed('resultsViewType', function () {
        this.set('results', this.get('results'));
        return this.get('resultsWidgets')[this.get('resultsViewType')] + '-settings';
    }),
    availableResultsTypes: Ember.computed('resultsWidgets', function () {
        return Object.keys(this.get('resultsWidgets'));
    }),
    availableResultsTypesHash: Ember.computed('availableResultsTypes', function () {
        return Object.keys(this.get('resultsWidgets')).map(function (item) {
            return Ember.Object.create({
                title: item
            });
        });
    }),
    resultsViewTypeTitle: Ember.computed('resultsViewType', function () {
        return Ember.Object.create({
            title: this.get('resultsViewType')
        });
    }),
    getResultsWithSelectedTextFunction() {
        this.getResultsFunction(null, true);
    },
    getResultsFunction(queryObject, withSelected) {
        let question = this.get('question');

        let query_variables = question.get('query_variables');
        let changedAttributes = Object.keys(question.changedAttributes()).filter((item) => {
            return item != 'updated_at' && item != 'cached_results';
        });
        // if (question.id && ( changedAttributes == 0) && !this.get('variablesChanged') && !this.get('attributesChanged')){
        //     question.set("updated_at", new Date())
        //     question.set('resultsCanBeLoaded', true)
        // }else{
        question.set('updated_at', new Date());
        queryObject = queryObject || this.get('queryObject');
        queryObject.set('id', question.get('id'));
        queryObject.set('variables', query_variables && query_variables.map((item) => {
            return {
                name: item.get('name'),
                value: item.get('value') || item.get('default'),
                var_type: item.get('var_type'),
                default_options: item.get('default_options')
            };
        }));

        this.changeQueryParamsInUrl(queryObject.get('variables'), queryObject.get('name'));
        this.set('loading', true);
        this.set('results', null);
        if (withSelected && this.get('aceEditor') && this.get('aceEditor').getSelectedText()) {
            queryObject = JSON.parse(JSON.stringify(queryObject));
            queryObject['rawQuery'] = this.get('aceEditor').getSelectedText();
        }
        this.get('ajax').apiCall({
            url: this.get('apiHost') + this.get('apiNamespace') + '/query_results',
            type: 'POST',
            data: queryObject
        }, (response, status) => {
            this.set('loading', false);
            this.set('errors', null);
            this.set('results', response.data);
            if (!this.get('resultsViewType')) {
                this.set('resultsViewType', this.autoDetect(response.data.rows));
            }

            if (!(withSelected && this.get('aceEditor') && this.get('aceEditor').getSelectedText())) {
                this.set('queryObject.rawQuery', response.query);
                this.set('validQuestion', true);
            }
            this.set('isQueryLimited', response.data.limited);
            this.set('queryLimit', response.data.limit);
            this.set('limitedQuery', response.data.limited_query);
            this.set('variablesReplacedQuery', response.data.variables_replaced_query);
        }, (error, status) => {
            this.set('loading', false);
            (error && error.error) ? this.set('errors', error.error) : this.set('errors', {
                message: 'Something isn\'t right. Please check the query elements.'
            });
            this.set('results', null);
            if (!(withSelected && this.get('aceEditor') && this.get('aceEditor').getSelectedText())) {
                this.set('validQuestion', false);
                this.set('queryObject.rawQuery', error.query);
            }
            this.set('isQueryLimited', null);
            this.set('queryLimit', null);
            this.set('limitQuery', null);
            this.set('variablesReplacedQuery', error.error.variables_replaced_query);
        });
        // }
    },

    actions: {
        removeVariable(variable) {
            this.get('question.variables').removeObject(variable);
            this.set('variablesChanged', true);
            variable.destroyRecord();
        },

        toggleSql() {
            let queryType = this.get('queryObject.queryType');
            if (queryType == 'query_builder') {
                this.set('queryObject.queryType', 'raw');
                (this.get('queryObject.rawQuery') == null) &&
                    this.set('queryObject.rawQuery', '');
            } else {
                this.set('queryObject.queryType', 'query_builder');
            }
            let plotlyComponent = Ember.$('.js-plotly-plot')[0];
            plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
        },
        getQuestionResults() {
            this.set('results', null);
            this.set('errors', null);
            let question = this.get('question');
            question.set('updated_at', new Date());
            question.set('resultsCanBeLoaded', true);
        },
        getResults(queryObject) {
            this.getResultsFunction(queryObject);
        },
        toggleSettings() {
            this.toggleProperty('showSettings');
        },
        saveQuestion() {
            if (this.get('newQuestion')) {
                Ember.run.later(this, () => {
                    $('.js-question_title').focus();
                }, 150);
                this.set('newQuestion', false);

            } else {
                let question = this.get('question');
                question.set('sql', question.get('sql') || question.get('human_sql.rawQuery'));
                question.set('cached_results', null);
                question.set('query_type', question.get('human_sql.queryType') == 'raw' ? 'sql' : 'human_sql');
                question.save().then((response) => {
                    question.get('variables').invoke('save');

                    this.set('retryingTransition', true);
                    this.transitionToRoute('questions.show', response.id);
                }).then((variable) => {
                    question.set('resultsCanBeLoaded', true);
                });

            }
        },
        transitionToDashBoard(dashboard_id) {
            this.transitionToRoute('dashboards.show', dashboard_id);
        },
        transitionToIndex() {
            this.transitionToRoute('index');
        },
        downloadData() {
            let question = this.get('question');
            let queryObject = this.get('queryObject');
            let query_variables = question.get('query_variables');
            queryObject.set('variables', query_variables && query_variables.map((item) => {
                return {
                    name: item.get('name'),
                    value: item.get('value') || item.get('default'),
                    var_type: item.get('var_type'),
                    default_options: item.get('default_options')
                };
            }));
            this.get('ajax').apiCall({
                url: this.get('apiHost') + this.get('apiNamespace') + '/create_csv',
                type: 'POST',
                data: queryObject
            }, (response, status) => {

                this.get('toast').success(
                    'Your CSV is getting uploaded to cloud. You\'ll get an email with download link shortly',
                    'YaY!', {
                        closeButton: true,
                        timeout: 1500,
                        progressBar: false
                    }
                );
            }, (error, status) => {
                this.get('toast').success(
                    'Looks like CSV download process is not working as expected. Please try again. If problem persists, talk to your Admin',
                    'Sorry Mate!', {
                        closeButton: true,
                        timeout: 1500,
                        progressBar: false
                    }
                );
            });
        },
        addVariable() {
            let variable = this.store.createRecord('variable', {
                name: 'New Variable',
                var_type: 'String',
                default: 'value',
                default_options: []
            });
            this.get('question.variables').pushObject(variable);
            this.set('variablesChanged', true);
        },


        transitionToSnapshots(questionId) {
            this.transitionToRoute('questions.show.snapshots.all', questionId);
        },
        updateResultViewType(selection) {
            this.set('resultsViewType', selection.get('title'));
        },
        toggleFullscreen() {
            let plotlyComponent = Ember.$('.js-plotly-plot')[0];
            this.set('resizeTime', new Date());
            if (this.get('fullscreenClass')) {
                this.set('fullscreenClass', null);
                plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
            } else {
                this.set('fullscreenClass', 'fullscreen');
                plotlyComponent && plotlyComponent.dispatchEvent(this.get('plotlyResize'));
            }
        },
        toggleSqlEditor() {
            this.toggleProperty('collapseSqlEditor');
        },
        setEditorWhenReady(editor) {
            this.set('aceEditor', editor);
        },
    apply(){
      if (this.get('canEdit')){
        this.getResultsFunction(this.get('queryObject'))
      }else{
            let question = this.get('question');
            question.set('resultsCanBeLoaded', true);
            question.set('updated_at', new Date());
      }
    }


    }
});
