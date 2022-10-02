
<style scoped>
.font-transition {
        -webkit-transition: all 0.1s;
        -moz-transition: all 0.1s;
        -o-transition: all 0.1s;
        transition: all 0.1s;
}
</style>
<template>
        <!-- <div v-for="datum, j in row" :key="datum" class="tw-col-span-2"> -->
        <div class="tw-border tw-rounded tw-break-inside-avoid-column tw-px-16 tw-py-8 tw-flex tw-flex-col tw-justify-center tw-items-center">

                <div class="tw-flex tw-text-center tw-justify-center tw-items-baseline">
                        <div>
                                <div class="tw-inline font-transition  tw-text-black/80">{{ settings.dataPrefix }}
                                </div>
                                <div class="tw-inline font-transition  tw-text-black/80 font-data">
                                        {{ formatNumber(precise(data.dataValues[index], settings.dataPrecision),
                                                        settings.dataFormat)
                                        }}
                                </div>
                                <div class="tw-inline font-transition  tw-text-black/80">
                                        {{ settings.dataSuffix }}
                                </div>
                        </div>
                        <div class="tw-flex font-transition font-trend tw-items-center tw-justify-start tw-flex-[0]"
                                v-if="settings.trendColumn">
                                <div class="tw-ml-3">
                                        {{ settings.trendPrefix }}
                                        {{ formatNumber(precise(data.referenceValues[index], settings.trendPrecision),
                                                        settings.trendFormat)
                                        }}{{ settings.trendSuffix || '%' }}
                                </div>
                                <div>
                                        <ArrowDownIcon class="tw-stroke-red-500" v-if="data.referenceValues[index] < 0"
                                                size=14 />
                                        <ArrowUpIcon class="tw-stroke-green-500" v-if="data.referenceValues[index] > 0"
                                                size=14 />
                                        <MenuIcon class="tw-stroke-blue-500" v-if="data.referenceValues[index] === 0"
                                                size=14 />

                                </div>
                        </div>
                </div>
                <div class="text-center tw-whitespace-nowrap tw-flex-[0]" v-if="settings.subtitleColumn">

                        <AGTDRenderer :colDetails="colDetails" isColumnObject=false :value="data.subtitles[index]" :columns="columns" :index="subtitleColumnIndex" showFilters=false hideMenu=true />
                </div>

        </div>

        <!-- </div> -->
</template>

<script>

// import FitText from 'components/utils/fitText.vue'

import { precise, formatNumber } from 'src/helpers/numeralFormatting'
import { ArrowUpIcon, ArrowDownIcon, MenuIcon } from 'vue-tabler-icons'
import AGTDRenderer from 'components/dataRenderers/charts/td/renderer.vue'

export default {
        name: "AGNumberDetails",
        props: ['row', 'fontRef', 'settings', 'index', 'data', 'numberOfColumns', 'subtitleColumnIndex', 'columns', 'colDetails'],
        components: {
                ArrowUpIcon, ArrowDownIcon, MenuIcon, AGTDRenderer
        },

        methods: {
                precise(number, precision) {
                        return precise(number, precision)
                },
                formatNumber(number, format) {
                        return formatNumber(number, format)
                }
        }

}
</script>
