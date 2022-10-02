<template v-if="results.data">
        <div class="tw-h-full">


                <div class="tw-w-full tw-flex tw-justify-center tw-items-center" v-if="shouldShowChartInformation">
                        <div class="">
                                Please select a data column from settings.
                        </div>
                </div>
                <div class="tw-h-full" v-if="!shouldShowChartInformation">
                        <div class="tw-flex tw-flex-col tw-justify-center tw-items-center" ref="chart">
                                <div class="tw-text-3xl tw-w-full tw-text-center tw-py-4" v-if="settingsLocal.title">{{
                                                settingsLocal.title
                                }}</div>
                                <div class="tw-flex tw-flex-wrap tw-gap-2 tw-p-2">
                                        <div class="tw-flex-[1_0_10%]"
                                                v-for="datum, index in data.dataValues" :key="datum">
                                                <AGNumberDetails :data="data" :settings="settingsLocal"
                                                         :index="index"
                                                        :numberOfColumns="numberOfColumns" 
                                                        :colDetails="results.column_details"
                                                        :columns="results.columns"
                                                        :subtitleColumnIndex="subtitleColumnIndex"/>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script>

import NumberSettings from 'components/dataRenderers/charts/settings/numberSettings.vue'
import AGNumberDetails from 'components/dataRenderers/charts/numberDetails.vue'



import { chunks } from '../../../helpers/arrayUtils';
export default {
        name: "AGNumberChart",
        components: {
                AGNumberDetails: AGNumberDetails
        },

        props: ["results", "showSettings", "settings", "size"],



        data() {
                return {
                        data: {},
                        numberOfColumns: 5,
                        subtitleColumnIndex: -1,
                        settingsLocal: this.settings || {
                                title: null,
                                dataColumn: null,
                                trendColumn: null,
                                directReference: true
                        }
                }

        },

        watch: {
                size() {
                        this.updateFontsConfig()
                },

                settings: {
                        handler() {
                                this.updateData(this.settings || {})
                        }, deep: true
                }

        },

        mounted() {
                window.addEventListener('resize', this.updateFontsConfig);
                this.updateFontsConfig()
        },


        unmounted() {
                window.removeEventListener('resize', this.updateFontsConfig);
        },

        computed: {
                shouldShowChartInformation() {
                        if (!this.data.dataValues || (this.data.dataValues && this.data.dataValues.length === 0)) {
                                return true
                        }
                        return false
                }

        },


        methods: {

                setNumberOfColumns() {

                        const ref = this.$refs["chart"]
                        if (ref){
                        const height = ref.clientHeight
                        const width = ref.clientWidth
                        const numberOfColumns = Math.ceil(width / 380)
                        if (numberOfColumns > 6) {
                                numberOfColumns = 6
                        }
                        this.numberOfColumns = numberOfColumns
                        return { height, width }

                        }
                        return {height: 0, width: 0}

                },

                updateFontsConfig() {
                        const dim = this.setNumberOfColumns()
                        this.updateChartConf(this.settingsLocal)
                },

                updateData(settings) {
                        this.settingsLocal = settings
                        this.updateFontsConfig()
                },
                updateChartConf(settings) {

                        let data = {}
                        let dataColumnIndex = this.results.columns.indexOf(settings.dataColumn)

                        if (dataColumnIndex >= 0) {
                                data.dataValues = this.results.rows.map((item) => {
                                        return item[dataColumnIndex]
                                })
                                data.chunkedDataValues = chunks(data.dataValues, this.numberOfColumns)
                                let trendColumnIndex = this.results.columns.indexOf(settings.trendColumn)

                                if (trendColumnIndex >= 0) {
                                        data.trendsValues = this.results.rows.map((item) => {
                                                return item[trendColumnIndex]
                                        })
                                        if (settings.directReference) {
                                                data.referenceValues = data.trendsValues
                                        } else {
                                                data.referenceValues = data.dataValues.map((dv, i) => {
                                                        const val = 100 * ((dv - data.trendsValues[i]) / data.trendsValues[i])
                                                        return Math.round((val + Number.EPSILON) * 100) / 100
                                                })
                                        }
                                }

                        }
                        this.subtitleColumnIndex = this.results.columns.indexOf(settings.subtitleColumn)

                        if (this.subtitleColumnIndex >= 0) {
                                data.subtitles = this.results.rows.map((item) => {
                                        return item[this.subtitleColumnIndex]
                                })
                        }

                        this.data = data
                        this.setNumberOfColumns()

                }
        }

}
</script>
