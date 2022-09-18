<template v-if="results.data">
        <div
                class="tw-col-span-1 tw-col-span-2 tw-col-span-3 tw-col-span-4 tw-col-span-5 tw-col-span-6 tw-col-span-7 tw-col-span-8 tw-col-span-9 tw-col-span-10 tw-col-span-11 tw-col-span-12 tw-hidden ">
        </div>
        <div
                class="tw-columns-1 tw-columns-2 tw-columns-3 tw-columns-4 tw-columns-5 tw-columns-6 tw-columns-7 tw-columns-8 tw-columns-9 tw-columns-10 tw-columns-11 tw-columns-12 tw-hidden ">
        </div>
        <div class="tw-h-full" ref="chart">
                <div class="tw-text-3xl tw-w-full tw-text-center tw-py-4" v-if="settingsLocal.title">{{
                                settingsLocal.title
                }}</div>
                <div :class="colsClass()" class=" tw-m-2 tw-justify-items-center tw-content-center">
                        <div class="tw-w-full tw-my-2 first:tw-mt-0 " v-for="datum, index in data.dataValues"
                                :key="datum">
                                <AGNumberDetails :data="data" :settings="settingsLocal" :fontRef="fontRef"
                                        :index="index" :numberOfColumns="numberOfColumns" />
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
                        fontRef: 0,
                        numberOfColumns: 5,
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


        methods: {
                colsClass() {
                        switch (this.data.dataValues && this.data.dataValues.length) {
                                case 1:
                                        return 'tw-columns-1'
                                case 2:
                                        return 'tw-columns-2'
                                case 3:
                                        return 'tw-columns-3'
                                case 4:
                                        return 'tw-columns-4'
                                case 5:
                                        return 'tw-columns-5'
                                case 6:
                                        return 'tw-columns-6'
                                default:
                                        return 'tw-columns-xs'
                        }
                },

                setNumberOfColumns() {

                        const ref = this.$refs["chart"]
                        const height = ref.clientHeight
                        const width = ref.clientWidth
                        const numberOfColumns = Math.ceil(width / 380)
                        if (numberOfColumns > 6) {
                                numberOfColumns = 6
                        }
                        this.numberOfColumns = numberOfColumns
                        return { height, width }

                },

                updateFontsConfig() {
                        const dim = this.setNumberOfColumns()
                        this.updateChartConf(this.settingsLocal)
                        if (this.data.chunkedDataValues) {
                                const widthDivider = this.data.dataValues.length >= this.numberOfColumns ? this.numberOfColumns : this.data.dataValues.length
                                this.fontRef = Math.min(dim.width / (this.numberOfColumns * widthDivider), dim.height / (this.data.chunkedDataValues.length * 2))
                                this.fontRef = this.fontRef < 50 ? 50 : this.fontRef
                        }
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
                        let subtitleColumnIndex = this.results.columns.indexOf(settings.subtitleColumn)

                        if (subtitleColumnIndex >= 0) {
                                data.subtitles = this.results.rows.map((item) => {
                                        return item[subtitleColumnIndex]
                                })
                        }

                        this.data = data
                        this.setNumberOfColumns()

                }
        }

}
</script>
