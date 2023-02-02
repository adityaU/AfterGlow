<template>
        <staged-menu :stages="stages" :currentStage="sortingLocal.currentStage" :show="sortingLocal.showMenu">
                <template #header>
                        <div class="tw-grid tw-grid-cols-6">

                                <div class="tw-p-2 tw-col-span-5">
                                        <a href="#" class="btn tw-bg-primary tw-text-white hover:tw-bg-primary/80"
                                                v-for="dv, i in displayValues" :key="dv"
                                                :class="displayValues.length == 1 ? 'btn-full' : (i === 0 ? 'btn-left' : (displayValues.length === i + 1 ? 'btn-right' : 'btn-center'))"
                                                @click="sortingLocal.currentStage = dv[1]">{{
                                                                dv[0]
                                                }}</a>

                                </div>
                                <div class="tw-p-2 tw-col-span-1 tw-text-right tw-text-default">
                                        <a href="#"
                                                class="tw-inline-flex tw-border tw-rounded-sm tw-p-1 tw-bg-secondary"
                                                @click="((sortingLocal.raw = !sortingLocal.raw) || true) && (sortingLocal.currentStage = sortingLocal.raw ? 2 : 0)">

                                                <q-tooltip transition-show="scale" transition-hide="scale"> {{
                                                                !sortingLocal.raw ?
                                                                        'Switch to Raw Snippet' : 'Switch to query builder'
                                                }}
                                                </q-tooltip>
                                                <CodeIcon v-if="!sortingLocal.raw" class="tw-h-3 tw-w-3" />
                                                <CodePlusIcon v-if="sortingLocal.raw" class="tw-h-3 tw-w-3" />
                                        </a>

                                </div>
                        </div>
                </template>
                <template #S1>
                        <div class="">
                                <SelectOptions :options="columns" :selected="sortingLocal.column" iconLetter="c"
                                        @select="(val) => ((sortingLocal.column = val) || true) && (sortingLocal.currentStage = 1 )" />

                        </div>
                </template>
                <template #S2>

                        <div class="tw-py-2 ">
                                <BoxSelect :options="directionOptions" :selected="sortingLocal.direction"
                                        @selected="(val) => ((sortingLocal.direction = val) || true)" />
                        </div>
                </template>
                <template #S3>
                        <div class="tw-py-2 tw-px-2">
                                <BaseInput :value="sortingLocal.value" @inputed="(val) => sortingLocal.value = val"
                                        type="text" ref="option_0" placeholder="1 desc"
                                        class="" />
                        </div>
                </template>
                <template #footer>
                        <div class="tw-py-2 tw-px-2 tw-border-t tw-text-right" v-if="shouldShowAddsorting">
                                <AGButton v-close-popup=10
                                        class="tw-bg-primary tw-border-primary tw-text-white hover:tw-bg-primary/80 hover:tw-text-white"
                                        @clicked="((sortingLocal.showMenu = false) || true) && $emit('addsorting', sortingLocal) && stopPropagation">
                                        {{ addLabel }}
                                </AGButton>
                        </div>
                </template>
        </staged-menu>
</template>
<script>


import StagedMenu from 'components/base/stagedMenu.vue'
import SelectOptions from 'components/base/selectOptions.vue'
import BoxSelect from 'components/base/boxSelect.vue'
import BaseInput from 'components/base/input.vue'
import AGButton from 'components/base/button.vue'

import { SortingMixin } from 'src/mixins/sortingMixin'

import { CodeIcon, CodePlusIcon } from 'vue-tabler-icons'

import { _ } from 'lodash'

const newsorting = {
        column: null,
        direction: 'ascending',
        raw: false,
        value: null,
        currentStage: 0,
}
export default {
        name: 'VueMenu',
        mixins: [SortingMixin],

        props: ['sorting', 'columns', 'colDetails', 'addLabel', 'reset'],

        watch: {
                reset() {
                        this.sortingLocal = _.cloneDeep(newsorting)
                },
                sortingLocal: {
                        handler() {
                                this.$emit('editFilter', this.sortingLocal)
                        },
                        deep: true
                }
        },

        components: { BoxSelect, CodeIcon, CodePlusIcon, StagedMenu, SelectOptions, BaseInput, AGButton },
        data() {
                return {
                        sortingLocal: this.sorting || _.cloneDeep(newsorting),

                        directionOptions: ['ascending', 'descending'].map((item) => {return {name: item, value: item}}),
                        stages: [
                                { name: "S1" },
                                { name: "S2" },
                                { name: "S3" },
                        ]
                }
        },

        computed: {
                displayValues() {
                        return this.getDisplayValues(this.sortingLocal, this.colDetails)
                },
                columnDataType() {
                        const dt =  this.getColumnDataType(this.sortingLocal, this.colDetails)

                        return dt
                },
                shouldShowAddsorting() {
                        if (this.sortingLocal.raw && this.sortingLocal.value != null) {
                                return true
                        }
                        return this.sortingLocal.column && this.sortingLocal.direction
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
                setsortingType() {
                        if (this.sortingLocal.isAggregation) {
                                this.sortingLocal.agg = null
                                this.sortingLocal.column = null
                        } else {

                        }
                }

        }

}
</script>
