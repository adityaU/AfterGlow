<template>
    <div class="tw-divide-y">
        <div class="tw-w-full tw-py-4 tw-px-2 tw-font-semibold tw-text-default tw-text-sm">
            Settings
        </div>

        <div class="tw-w-full">
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
                        <div class="tw-col-span-10">
                            {{ element.name }}
                        </div>
                        <div class="tw-col-span-1">
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

        </div>
    </div>
</template>

<script>

import { MenuIcon, EyeIcon } from 'vue-tabler-icons'

import draggable from 'vuedraggable'

import _ from 'lodash'


export default {

    name: "TableSettings",
    components: { draggable, MenuIcon, EyeIcon },
    props: ['columns', 'settings'],

    data() {

        let settings = _.cloneDeep(this.settings)
        return {
            settingsLocal: settings && settings.columns ? this.setupColumns(settings) : { columns: (this.columns ? this.columns.map((item, i) => { return { name: item, show: true, order: i } }) : []) },
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
              settings = this.setupColumns(this.settingsLocal)
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
      setupColumns(settings){

                if (settings && settings.columns) {
                    settings.columns = settings.columns.filter((item) => this.columns.indexOf(item.name) >= 0)

                    const existingColumns = settings.columns.map(item => item.name)
                    let order = existingColumns.length
                    this.columns.forEach(col => {
                        if (existingColumns.indexOf(col) < 0) {
                            settings.columns.push({ name: col, show: true, order: order + 1 })
                            order += 1
                        }
                    })
                }
                return settings
      }
    }

}
</script>
