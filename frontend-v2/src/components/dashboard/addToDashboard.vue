<template>
    <teleport to="body">

        <AGModal size="small" :show="open" @update:show="(val) => $emit('update:show', val)" :loading="loading"
            :loadingMessage="loadingMessage">
            <template #header>
                <div class="tw-p-2 tw-text-2xl tw-font-semibold">
                    Add To Dashboard
                </div>
            </template>
            <template #body>
                <div class="tw-text-center" v-if="!visualizationID">
                    Please save the Visualization first
                </div>
                <div class="tw-p-2 divide-y" v-if="dashboard && visualizationID">
                    <div>
                        <div class="label">Please select a dashboard</div>
                        <BoxSelect :options="dashboardsOptions"  class="tw-text-center"
                                                @selected="addToDashboard" />
                    </div>
                    <div>
                        Or create a new dashboard
                        <AGInput label="Name" placeholder="What do you call it?" :value="dashboard.name"
                            @inputed="(val) => dashboard.title = val" />
                        <AGInput label="Description" placeholder="What does it show?" :value="dashboard.description"
                            @inputed="(val) => dashboard.description = val" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="tw-grid tw-grid-cols-12">
                    <div class="tw-col-span-12 tw-p-2 tw-text-center">
                        <AGButton class="tw-text-default hover:tw-bg-secondary tw-mr-2 tw-p-2"
                            @clicked="$emit('update:open', false)">
                            Cancel
                        </AGButton>
                        <AGButton :disabled="!(dashboard && dashboard.title) || !visualizationID"
                            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-ml-2 tw-p-2"
                            @clicked="createDashboard">
                            Create & Add to dashboard
                        </AGButton>
                    </div>
                </div>
            </template>
        </AGModal>
    </teleport>
</template>

<script>
import AGModal from 'components/utils/modal.vue'
import AGButton from 'components/base/button.vue'
import AGInput from 'components/base/agInput.vue'
import BoxSelect from 'components/base/boxSelect.vue'

import { createDashboard, fetchDashboards, saveDashboard } from 'src/apis/dashboards'

import {queryStore} from 'stores/query'
import { convertWidgets } from 'src/helpers/dashboard'

const query = queryStore()
export default {
    name: 'AGAddToDashboard',
    props: ['visualizationID', 'queryKey', 'open'],
    components: { AGModal, AGButton, AGInput, BoxSelect },
    data() {
        return {
            query: query.get(this.queryKey),
            loading: false,
            dashboard: { title: null, description: null }
        }
    },
    mounted(){
      fetchDashboards(this.query.token, this.setDashboards)
    },

    computed: {
      dashboardsOptions(){
        return (this.dashboards && this.dashboards.map(d => {
          return {name: d.title, value: d.id}
        })) || []
      }
    },


    methods: {
        setDashboards(dashboards, loading){
          this.loading = loading
          this.dashboards = dashboards || [] 
        },
        transitionToDashboard(dashboard, loading) {
            this.loading = loading
            this.dashboard = dashboard
            if (dashboard) {
                window.location.href = '/dashboards/' + dashboard.id
            }
        },
        transitionToDashboardFromID(id) {
          return (loading) => {
            this.loading = loading
            if (!loading){
                window.parent.location.href = '/dashboards/' + id
            }
          }
        },
        createDashboard() {
            this.dashboard.settings = { version: 1, widgets: [{ x: 0, y: 0, w: 6, h: 55, type: 'visualization', widID: this.visualizationID }] }
            createDashboard(this.dashboard, this.query.token, this.transitionToDashboard)
        },
        addToDashboard(id){
          let dashboard = this.dashboards.filter(d => d.id === id)[0]
          if (dashboard){
            let widgets = convertWidgets(dashboard)
            dashboard.settings = dashboard.settings || {}
            dashboard.settings.widgets = widgets
            dashboard.settings.version = 1
            dashboard.settings.widgets.push({ x: 0, y: 0, w: 6, h: 55, type: 'visualization', widID: this.visualizationID })
            saveDashboard(id, dashboard, this.query.token, this.transitionToDashboardFromID(id))
          }
        }
    }

}
</script>
