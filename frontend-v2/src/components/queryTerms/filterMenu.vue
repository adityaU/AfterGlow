<template>

        <staged-menu :stages="stages" :currentStage="filterLocal.currentStage" :show="filterLocal.showMenu">
                <template #header>
                        <div class="tw-grid tw-grid-cols-6 tw-border-b">

                                <div class="tw-p-2 tw-col-span-5 tw-flex">
                                        <div class="btn tw-cursor-pointer tw-bg-primary tw-text-white hover:tw-bg-primary/80"
                                                v-for="dv, i in displayValues" :key="dv"
                                                :class="displayValues.length == 1 ? 'btn-full' : (i === 0 ? 'btn-left' : (displayValues.length === i + 1 ? 'btn-right' : 'btn-center'))"
                                                @click="filterLocal.currentStage = dv[1]">{{
                                                                dv[0]
                                                }}</div>
                                </div>
                                <div class="tw-p-2 tw-col-span-1 tw-text-right tw-text-default">
                                        <div
                                                class="tw-cursor-pointer tw-inline-flex tw-border tw-rounded-sm tw-p-1 tw-bg-secondary"
                                                @click="((filterLocal.raw = !filterLocal.raw) || true) && (filterLocal.currentStage = filterLocal.raw ? 3 : 0)">

                                                <q-tooltip transition-show="scale" transition-hide="scale"> {{
                                                                !filterLocal.raw ?
                                                                        'Switch to Raw Snippet' : 'Switch to query builder'
                                                }}
                                                </q-tooltip>
                                                <CodeIcon v-if="!filterLocal.raw" class="tw-h-3 tw-w-3" />
                                                <CodePlusIcon v-if="filterLocal.raw" class="tw-h-3 tw-w-3" />
                                        </div>

                                </div>
                        </div>

                </template>
                <template #S1>
                        <SelectOptions :options="columns" :selected="filterLocal.column" :menuShow="menuShow" iconLetter="c"
                                @select="(val) => ((filterLocal.column = val) || true) && (filterLocal.currentStage = 1) && (setDefaultDateValue())" />
                </template>
                <template #S2>
                        <BoxSelect :options="operatorOptions" :selected="filterLocal.operator"
                                @selected="(val) => updateOperator(val)" />
                </template>
                <template #S3>
                        <div class="" v-if="columnDataType == 'number'">
                                <div class="tw-py-2 tw-px-2">
                                        <BaseInput :value="filterLocal.value"
                                                @inputed="(val) => filterLocal.value = val" type="number" ref="option_0"
                                                 />
                                </div>
                        </div>
                        <div class="" v-if="columnDataType == 'text'">
                                <div class="tw-py-2 tw-px-2">
                                        <SelectOptions :options="valueOptions" :selected="filterLocal.value"
                                                :menuShow="menuShow" includeQuery=true
                                                @select="(val) => ((filterLocal.value = val) || true)" />
                                </div>
                        </div>
                        <div class="" v-if="(columnDataType == 'datetime') && filterLocal.value">
                                <div class="tw-py-2 tw-px-2">

                                        <BoxSelect :options="datetimeValueTypes" :selected="filterLocal.value.type" class="tw-text-center" isTab=true
                                                @selected="(val) => (filterLocal.value.type = val || true) && setDateTimeValueValue()" />
                                        <div class="" v-if="filterLocal.value.type === 'duration'">
                                        <div class="tw-py-2">
                                                <BaseInput :value="filterLocal.value.value.durationValue"
                                                        @inputed="(val) => filterLocal.value.value.durationValue = val"
                                                        type="number" ref="option_0" placeholder="30" />

                                                <BoxSelect :options="durationTypeOptions" class="tw-max-w-[400px]"
                                                        :selected="filterLocal.value.value.durationType"
                                                        @selected="(val) => filterLocal.value.value.durationType = val" />


                                                <BoxSelect :options="durationTenseOptions"
                                                        :selected="filterLocal.value.value.durationTense"
                                                        @selected="(val) => filterLocal.value.value.durationTense = val" />

                                        </div>

                                        </div>
                                        <div class="tw-inline-flex tw-mt-2" v-if="filterLocal.value.type === 'datepicker'">
                                                <q-date class="!tw-mr-1" flat=true v-model="filterLocal.value.value" :mask="datetimeFormat" color="primary" />
                                                <q-time class="!tw-ml-1" flat=true v-model="filterLocal.value.value" :mask="datetimeFormat" color="primary" />
                                        </div>
                                </div>
                        </div>
                </template>
                <template #S4>
                        <div class="tw-py-2 tw-px-2">
                                <BaseInput :value="filterLocal.value" @inputed="(val) => filterLocal.value = val"
                                        type="text" ref="option_0" placeholder="lower(column) = 'value"
                                        class="" />
                        </div>
                </template>
                <template #footer>
                        <div class="tw-py-2 tw-px-2 tw-border-t tw-text-right" v-if="shouldShowAddFilter">
                                <AGButton v-close-popup=10
                                        class="tw-bg-primary tw-border-primary tw-text-white hover:tw-bg-primary/80 hover:tw-text-white"
                                        @clicked="((filterLocal.showMenu = false) || true) && $emit('addFilter', filterLocal) && prevent">
                                        {{ addLabel }}
                                </AGButton>
                        </div>
                </template>
        </staged-menu>
</template>


<script>

import { findDataType, operatorOptions } from 'src/helpers/dataTypes'
import StagedMenu from 'components/base/stagedMenu.vue'
import SelectOptions from 'components/base/selectOptions.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import BaseInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'

import {FilterMixin, datetimeFormat} from 'src/mixins/filterMixins'

import { CodeIcon, CodePlusIcon } from 'vue-tabler-icons'
import { date } from 'quasar'

import { _ } from 'lodash'

const newDurationValue = {
        type: 'duration',
        value: {
                durationValue: 30,
                durationType: 'days',
                durationTense: 'ago'
        }
}
const newFilter = {
        column: null,
        operator: null,
        value: null,
        currentStage: 0,
        raw: false
}
export default {
        name: 'FilterMenu',
        mixins: [FilterMixin],

        props: ['filter', 'columns', 'colDetails', 'addLabel', 'reset', 'rows'],

        watch: {
                // filter: {
                //   handler(){
                //   this.filterLocal = {...this.filter}
                //   },
                //   deep: true
                //
                // },
                reset() {
                        this.filterLocal = _.cloneDeep(newFilter)
                },
                filterLocal: {
                        handler() {
                                this.$emit('editFilter', this.filterLocal)
                        },
                        deep: true
                }
        },

        components: { CodeIcon, CodePlusIcon, StagedMenu, SelectOptions, BoxSelect, BaseInput, AGButton },
        data() {
                return {
                        filterLocal: this.filter || _.cloneDeep(newFilter),
                        time: null,
                        date: null,
                        datetimeValueTypes: ['duration', 'datepicker'].map((item) => { return { name: item, value: item } }),
                        durationTypeOptions: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'].map((item) => { return { name: item, value: item } }),
                        durationTenseOptions: ['ago', 'later'].map((item) => { return { name: item, value: item } }),
                        datetimeFormat: datetimeFormat,
                        stages: [
                                { name: "S1" },
                                { name: "S2" },
                                { name: "S3" },
                                { name: "S4" },
                        ]
                }
        },

        computed: {
                displayValues() {
                        return this.getDisplayValues(this.filterLocal, this.colDetails)
                },
                columnDataType() {
                return this.getColumnDataType(this.filterLocal, this.colDetails)

                },
                operatorOptions() {
                        return operatorOptions[findDataType(this.colDetails, this.filterLocal.column) || 'text'].map((item) => {
                                return { name: item, value: item }
                        })
                },
                valueOptions() {
                        if (this.rows && this.filterLocal.column) {
                                return [... new Set(this.rows.map((item) => { return item[this.columns.indexOf(this.filterLocal.column)] }))]
                        }
                        return []
                },
                shouldShowAddFilter() {
                        if (this.filterLocal.raw && this.filterLocal.value != null) {
                                return true
                        }
                        if (this.filterLocal.column && this.filterLocal.operator) {
                                if (['is NULL', 'is not NULL'].indexOf(this.filterLocal.operator) >= 0) {
                                        return true
                                } else if (this.filterLocal.value != null) {
                                        return true
                                }
                        }
                        return false
                }
        },

        methods: {
                setDateTimeValueValue() {
                        if (this.columnDataType == 'datetime' && this.filterLocal.value) {
                                if (this.filterLocal.value.type === 'duration') {
                                        this.filterLocal.value = _.cloneDeep(newDurationValue)
                                } else {
                                        this.filterLocal.value = {
                                                type: 'datepicker',
                                                value: date.formatDate(new Date(), this.datetimeFormat)
                                        }
                                }
                        }

                },
                setDefaultDateValue() {
                        if (this.filterLocal.column && this.columnDataType == 'datetime') {
                                this.filterLocal.isValueDatetime = true
                                this.filterLocal.value = _.cloneDeep(newDurationValue)
                        } else {
                                this.filterLocal.isValueDatetime = false
                                this.filterLocal.value = null
                        }

                },
                updateOperator(val) {
                        if (['is NULL', 'is not NULL'].indexOf(val) >= 0) {
                                this.filterLocal.value = null
                                this.setDefaultDateValue()
                        } else {
                                this.filterLocal.currentStage = 2
                        }
                        this.filterLocal.operator = val
                },
        }

}
</script>
