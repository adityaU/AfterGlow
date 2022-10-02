<template>
    <div class="tw-divide-y">

        <div class="tw-w-full" v-if="settingsLocal">
            <draggable class="tw-divide-y" v-model="settingsLocal.columns" v-bind="dragOptions" @start="drag = true"
                @end="drag = false" item-key="order">
                <template #item="{ element }">
                    <div class="tw-p-2 tw-grid tw-grid-cols-12">
                        <div class="tw-col-span-1">
                            <a href="#">
                                <q-tooltip transition-show="scale" transition-hide="scale"> Reorder</q-tooltip>
                                <MenuIcon class="tw-w-5 tw-h-5 tw-stroke-primary tw-inline" />
                            </a>
                        </div>
                        <div class="tw-col-span-9">
                            <div class="text-icon-primary tw-inline-block" v-if="!element.apiAction">C</div>
                            <div class="text-icon-primary tw-inline-block tw-bg-red-900" v-if="element.apiAction">A
                            </div>
                            {{ element.name }}
                        </div>
                        <div class="tw-col-span-2 tw-text-right">
                            <a href="#"
                                @click="((apiAction = element.details) || true) && (newApiActionModalOpen = true)"
                                v-if="element.apiAction">

                                <q-tooltip transition-show="scale" transition-hide="scale"> Edit API Action </q-tooltip>
                                <EditIcon class="tw-w-5 tw-h-5 tw-inline tw-stroke-primary"/>
                            </a>
                            <a href="#"
                                @click="((apiAction = element.details) || true) && (deleteApiActionModalOpen = true)"
                                v-if="element.apiAction">

                                <q-tooltip transition-show="scale" transition-hide="scale"> Delete API Action </q-tooltip>
                                <XIcon class="tw-w-5 tw-h-5 tw-inline tw-stroke-red-500"/>
                            </a>


                            <a href="#" @click="element.show = !element.show">
                                <q-tooltip transition-show="scale" transition-hide="scale"> {{ element.show ? 'Hide' :
                                        'Show'
                                }}
                                </q-tooltip>
                                <EyeIcon class="tw-w-5 tw-h-5 tw-inline"
                                    :class="element.show ? 'tw-stroke-primary' : 'tw-stroke-default'" />
                            </a>
                        </div>
                    </div>
                </template>
            </draggable>
            <NewApiAction v-model:open="newApiActionModalOpen" :apiAction="apiAction" :queryKey="queryKey"
                :visualizationID="visualizationID" :questionID="questionID" :key="apiAction" @update:apiAction="$emit('updateApiActions')" />

            <DeleteApiAction v-model:open="deleteApiActionModalOpen" :apiActionID="apiAction && apiAction.id" :queryKey="queryKey" :key="apiAction && apiAction.id" @update:apiAction="$emit('updateApiActions')" />
            <AGButton class="tw-border-0 tw-text-primary tw-font-semibold tw-float-right"
                @clicked="((apiAction = null) || true) && (newApiActionModalOpen = true)" v-if="(questionID != null && questionID != 'null')" >
                <PlusIcon class="tw-inline" size=14 /> API Action
            </AGButton>
        </div>
    </div>
</template>

<script>

import { MenuIcon, EyeIcon, PlusIcon, EditIcon, XIcon } from 'vue-tabler-icons'

import NewApiAction from 'components/apiActions/new.vue'
import DeleteApiAction from 'components/apiActions/delete.vue'
import AGButton from 'components/base/button.vue'

import draggable from 'vuedraggable'

import _ from 'lodash'


export default {

    name: "TableSettings",
    components: { draggable, MenuIcon, EyeIcon, PlusIcon, NewApiAction, AGButton, EditIcon, DeleteApiAction, XIcon },
    props: ['columns', 'settings', 'apiActionsQuesLevel', 'queryKey', 'visualizationID', 'questionID'],

    data() {

        let settings = _.cloneDeep(this.settings)
        let settingsLocal = this.setupColumns(settings)
        this.$emit('settings', settingsLocal)
        return {
            settingsLocal: settingsLocal,
            newApiActionModalOpen: false,
            deleteApiActionModalOpen: false,
            dragOptions: {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            },

        }
    },
    watch: {
        columns: {
            deep: true,
            handler() {
                this.settingsLocal = this.setupColumns(this.settingsLocal)
            }
        },

        apiActionsVizLevel: {
            deep: true,
            handler() {
                this.settingsLocal = this.setupColumns(this.settingsLocal)
            }
        },
        apiActionsQuesLevel: {
            deep: true,
            handler() {
                this.settingsLocal = this.setupColumns(this.settingsLocal)
            }
        },
        // settings: {
        //     handler() {
        //         let settings = _.cloneDeep(this.settings)
        //         this.optionsLocal = (settings && settings.columns && settings.columns) || (this.columns ? this.columns.map((item, i) => { return { name: item, show: true, order: i } }) : [])
        //     },
        //     deep: true
        // },
        settingsLocal: {
            handler() {
              this.$emit('settings', this.settingsLocal)
            },
            deep: true
        }
    },

    methods: {
        setupColumns(settings) {
            settings = _.cloneDeep(settings)
            if (settings && settings.columns) {
                settings.columns = settings.columns.filter((item) => this.columns.indexOf(item.name) >= 0 || item.apiAction)

                const existingColumns = settings.columns.filter(item => !item.apiAction).map(item => item.name)
                let order = existingColumns.length
                this.columns.forEach(col => {
                    if (existingColumns.indexOf(col) < 0) {
                        settings.columns.push({ name: col, show: true, order: order + 1 })
                        order += 1
                    }
                })
            } else {
                settings = { columns: (this.columns ? this.columns.map((item, i) => { return { name: item, show: true, order: i } }) : []) }
            }

            if (this.apiActionsQuesLevel) {
                let order = settings.columns.length
                const apiActionIDs = this.apiActionsQuesLevel && this.apiActionsQuesLevel.map((aa) => aa.id)
                settings.columns = settings.columns.filter(item =>  (!item.apiAction || (apiActionIDs.indexOf(item.apiActionID) >= 0)))
                const existing = settings.columns.filter((col) => col.apiAction).map((aa) => aa.apiActionID )
                this.apiActionsQuesLevel.forEach((apiAction) => {
                    if (((apiAction.visualization_id === null) || (apiAction.visualization_id === this.visualizationID))){
                    if ((existing.indexOf(apiAction.id) < 0) ) {
                        settings.columns.push({ name: apiAction.name, show: true, apiActionID: apiAction.id, order: order + 1, apiAction: true, details: apiAction })
                        order = order + 1
                    } else {
                      let aa = settings.columns.filter((col) => col.apiAction && (col.apiActionID == apiAction.id))[0]
                      aa.name = apiAction.name
                      aa.details = apiAction
                    }

                    }
                })
            }
            settings.towardsBase = true


            return settings
        }
    }

}
</script>
