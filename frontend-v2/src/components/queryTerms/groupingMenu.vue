<template>
        <staged-menu :stages="stages" :currentStage="groupingLocal.currentStage" :show="groupingLocal.showMenu">
                <template #header>
                        <div class="tw-grid tw-grid-cols-6">

                                <div class="tw-p-2 tw-col-span-5">
                                        <a href="#" class="btn tw-bg-primary tw-text-white hover:tw-bg-primary/80"
                                                v-for="dv, i in displayValues" :key="dv"
                                                :class="displayValues.length == 1 ? 'btn-full' : (i === 0 ? 'btn-left' : (displayValues.length === i + 1 ? 'btn-right' : 'btn-center'))"
                                                @click="groupingLocal.currentStage = dv[1]">{{
                                                                dv[0]
                                                }}</a>

                                </div>
                                <div class="tw-p-2 tw-col-span-1 tw-text-right tw-text-default">
                                        <a href="#"
                                                class="tw-inline-flex tw-border tw-rounded-sm tw-p-1 tw-bg-secondary"
                                                @click="((groupingLocal.raw = !groupingLocal.raw) || true) && (groupingLocal.currentStage = groupingLocal.raw ? 2 : 0)">

                                                <q-tooltip transition-show="scale" transition-hide="scale"> {{
                                                                !groupingLocal.raw ?
                                                                        'Switch to Raw Snippet' : 'Switch to query builder'
                                                }}
                                                </q-tooltip>
                                                <CodeIcon v-if="!groupingLocal.raw" class="tw-h-3 tw-w-3" />
                                                <CodePlusIcon v-if="groupingLocal.raw" class="tw-h-3 tw-w-3" />
                                        </a>

                                </div>
                        </div>
                </template>
                <template #S1>
                        <div class="">
                                <SelectOptions :options="columns" :selected="groupingLocal.column" iconLetter="c"
                                        @select="(val) => ((groupingLocal.column = val) || true) && (groupingLocal.currentStage = (columnDataType == 'datetime') ? 1 : 0 )" />

                        </div>
                </template>
                <template #S2>

                        <div class="tw-py-2 ">
                                <SelectOptions :options="durationOptions" :selected="groupingLocal.duration"
                                        @select="(val) => ((groupingLocal.duration = val) || true)" />
                        </div>
                </template>
                <template #S3>
                        <div class="tw-py-2 tw-px-2">
                                <BaseInput :value="groupingLocal.value" @inputed="(val) => groupingLocal.value = val"
                                        type="text" ref="option_0" placeholder="1, 2"
                                        class="" />
                        </div>
                </template>
                <template #footer>
                        <div class="tw-py-2 tw-px-2 tw-border-t tw-text-right" v-if="shouldShowAddgrouping">
                                <AGButton v-close-popup=10
                                        class="tw-bg-primary tw-border-primary tw-text-white hover:tw-bg-primary/80 hover:tw-text-white"
                                        @clicked="((groupingLocal.showMenu = false) || true) && $emit('addgrouping', groupingLocal) && stopPropagation">
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
import BaseInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'

import { GroupingMixin } from 'src/mixins/groupingMixin'

import { CodeIcon, CodePlusIcon } from 'vue-tabler-icons'

import { _ } from 'lodash'

const newGrouping = {
        column: null,
        duration: null,
        raw: false,
        value: null,
        currentStage: 0,
}
export default {
        name: 'VueMenu',
        mixins: [GroupingMixin],

        props: ['grouping', 'columns', 'colDetails', 'addLabel', 'reset'],

        watch: {
                reset() {
                        this.groupingLocal = _.cloneDeep(newGrouping)
                },
                groupingLocal: {
                        handler() {
                                this.$emit('editFilter', this.groupingLocal)
                        },
                        deep: true
                }
        },

        components: { CodeIcon, CodePlusIcon, StagedMenu, SelectOptions, BaseInput, AGButton },
        data() {
                return {
                        groupingLocal: this.grouping || _.cloneDeep(newGrouping),

                        durationOptions: ['As It is', 'by Seconds', 'by Minute', 'by Day',
                                'by Hour', 'by Week', 'by Month', 'by Quarter',
                                'by year', 'by Hour of the day', 'by Day of the week',
                                'by week of year', 'by month of year', 'by quarter of year'],
                        stages: [
                                { name: "S1" },
                                { name: "S2" },
                                { name: "S3" },
                        ]
                }
        },

        computed: {
                displayValues() {
                        return this.getDisplayValues(this.groupingLocal, this.colDetails)
                },
                columnDataType() {
                        const dt =  this.getColumnDataType(this.groupingLocal, this.colDetails)
                        console.log(dt)

                        return dt
                },
                numberColumns() {
                        return this.columns.filter((item) => { return findDataType(this.colDetails, item) == 'number' }).
                                map((item) => { return { name: item, value: item } })
                },
                shouldShowAddgrouping() {
                        if (this.groupingLocal.raw && this.groupingLocal.value != null) {
                                return true
                        }
                        if (this.groupingLocal.column && this.getColumnDataType(this.groupingLocal, this.colDetails) == 'datetime') {
                                return this.groupingLocal.column && this.groupingLocal.duration
                        }
                        return this.groupingLocal.column
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
                setgroupingType() {
                        if (this.groupingLocal.isAggregation) {
                                this.groupingLocal.agg = null
                                this.groupingLocal.column = null
                        } else {

                        }
                }

        }

}
</script>
