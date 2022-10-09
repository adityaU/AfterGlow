
<template>

        <staged-menu :stages="stages" :currentStage="viewLocal.currentStage" :show="viewLocal.showMenu">
                <template #header>
                        <div class="tw-grid tw-grid-cols-6">

                                <div class="tw-p-2 tw-col-span-5">
                                        <a href="#" class="btn tw-bg-primary tw-text-white hover:tw-bg-primary/80"
                                                v-for="dv, i in displayValues" :key="dv"
                                                :class="displayValues.length == 1 ? 'btn-full' : (i === 0 ? 'btn-left' : (displayValues.length === i + 1 ? 'btn-right' : 'btn-center'))"
                                                @click="viewLocal.currentStage = dv[1]">{{
                                                                dv[0]
                                                }}</a>

                                </div>
                                <div class="tw-p-2 tw-col-span-1 tw-text-right tw-text-default">
                                        <a href="#"
                                                class="tw-inline-flex tw-border tw-rounded-sm tw-p-1 tw-bg-secondary"
                                                @click="((viewLocal.raw = !viewLocal.raw) || true) && (viewLocal.currentStage = viewLocal.raw ? 2 : 0)">

                                                <q-tooltip transition-show="scale" transition-hide="scale"> {{
                                                                !viewLocal.raw ?
                                                                        'Switch to Raw Snippet' : 'Switch to query builder'
                                                }}
                                                </q-tooltip>
                                                <CodeIcon v-if="!viewLocal.raw" class="tw-h-3 tw-w-3" />
                                                <CodePlusIcon v-if="viewLocal.raw" class="tw-h-3 tw-w-3" />
                                        </a>

                                </div>
                        </div>
                        <div class="tw-py-1 tw-text-center" v-if="!viewLocal.raw">
                                <BoxSelect :options="viewTypeOptions"
                                        :selected="viewLocal.isAggregation ? 'aggregation' : 'columns'" isTab=true
                                        @selected="(val) => ((viewLocal.isAggregation = (val === 'aggregation' ? true : false)) || true) && (viewLocal.currentStage = 0)" />


                        </div>
                </template>
                <template #S1>
                        <div class="" v-if="!viewLocal.isAggregation">
                                <SelectOptions :options="['All columns', ...columns]" :selected="viewLocal.columns" iconLetter="c"
                                        multiselect=true @select="(val) => selectMultiple(viewLocal.columns, val)" />

                        </div>
                        <div class="" v-if="viewLocal.isAggregation">
                                <BoxSelect :options="aggregationOptions" :selected="viewLocal.agg"
                                        class="tw-max-w-[400px]"
                                        @selected="(val) => ((viewLocal.agg = val) || true) && (viewLocal.currentStage = 1)" />
                        </div>
                </template>
                <template #S2>

                        <div class="tw-py-2 tw-px-2" v-if="viewLocal.agg === 'percentile of'">
                                <div class="tw-text-sm tw-font-semibold">Percentile Value: </div>
                                <BaseInput :value="viewLocal.value" @inputed="(val) => viewLocal.value = val"
                                        placeholder="Percentile value" type="number" ref="option_0" class="" />
                        </div>
                        <div class="tw-py-2 ">
                                <div class="tw-px-2 tw-text-sm tw-font-semibold"
                                        v-if="viewLocal.agg === 'percentile of'">Column: </div>
                                <BoxSelect :options="countOfRowsApplicableColumns" :selected="viewLocal.column"
                                        class="tw-max-w-[400px]"
                                        @selected="(val) => ((viewLocal.column = val) || true)" v-if="viewLocal.agg === 'count of rows'" />
                                <BoxSelect :options="numberColumns" :selected="viewLocal.column"
                                        class="tw-max-w-[400px]"
                                        @selected="(val) => ((viewLocal.column = val) || true)" v-if="viewLocal.agg != 'count of rows'" />
                        </div>
                </template>
                <template #S3>
                        <div class="tw-py-2 tw-px-2">
                                <BaseInput :value="viewLocal.value" @inputed="(val) => viewLocal.value = val"
                                        type="text" ref="option_0" placeholder="count(distinct id)"
                                        class="" />
                        </div>
                </template>
                <template #footer>
                        <div class="tw-py-2 tw-px-2 tw-border-t tw-text-right" v-if="shouldShowAddView">
                                <AGButton v-close-popup=10
                                        class="tw-bg-primary tw-border-primary tw-text-white hover:tw-bg-primary/80 hover:tw-text-white"
                                        @clicked="((viewLocal.showMenu = false) || true) && $emit('addView', viewLocal) && stopPropagation">
                                        {{ addLabel }}
                                </AGButton>
                        </div>
                </template>
        </staged-menu>
</template>
<script>


import { findDataType } from 'src/helpers/dataTypes'
import StagedMenu from 'components/base/stagedMenu.vue'
import SelectOptions from 'components/base/selectOptions.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import BaseInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'

import { ViewMixin } from 'src/mixins/viewMixin'

import { CodeIcon, CodePlusIcon } from 'vue-tabler-icons'

import { _ } from 'lodash'

const newView = {
        isAggregation: false,
        columns: [],
        raw: false,
        agg: null,
        column: null,
        value: null,
        currentStage: 0
}
export default {
        name: 'VueMenu',
        mixins: [ViewMixin],

        props: ['view', 'columns', 'colDetails', 'addLabel', 'reset', 'rows'],

        watch: {
                reset() {
                        this.viewLocal = _.cloneDeep(newView)
                },
                viewLocal: {
                        handler() {
                                this.$emit('editFilter', this.viewLocal)
                        },
                        deep: true
                }
        },

        components: { CodeIcon, CodePlusIcon, StagedMenu, SelectOptions, BoxSelect, BaseInput, AGButton },
        data() {
                return {
                        viewLocal: this.view || _.cloneDeep(newView),
                        viewTypeOptions: ['columns', 'aggregation'].map((item) => { return { name: item, value: item } }),
                        aggregationOptions: ['count of rows', 'minimum of', 'maximum of', 'sum of', 'average of', 'percentile of', 'standard deviation', 'standard variance'].map((item) => { return { name: item, value: item } }),
                        countOfRowsApplicableColumns: ['all', ...(this.columns || [])].map((x) => {
                        return {name: x, value: x}
                        }),
                        stages: [
                                { name: "S1" },
                                { name: "S2" },
                                { name: "S3" },
                        ]
                }
        },

        computed: {
                displayValues() {
                        return this.getDisplayValues(this.viewLocal)
                },
                numberColumns() {
                        return this.columns.filter((item) => { return findDataType(this.colDetails, item) == 'number' }).
                                map((item) => { return { name: item, value: item } })
                },
                shouldShowAddView() {
                        if (this.viewLocal.raw && this.viewLocal.value != null) {
                                return true
                        }
                        if (this.viewLocal.isAggregation) {
                                if (this.viewLocal.agg === 'percentile of') {
                                        return (this.viewLocal.value != null) && this.viewLocal.column
                                }
                                return this.viewLocal.column && this.viewLocal.agg
                        }
                        return this.viewLocal.columns.length
                }
        },

        methods: {
                selectMultiple(arr, value) {
                        const index = arr.indexOf(value)
                        if (index >= 0) {
                                arr.splice(index, 1)
                        } else {
                                arr.push(value)
                        }

                },
                setViewType() {
                        if (this.viewLocal.isAggregation) {
                                this.viewLocal.agg = null
                                this.viewLocal.column = null
                        } else {

                        }
                }

        }

}
</script>
