<template>

    <div class="tw-divide-y">
        <BoxSelect :options="settingsCategories"
        :selected="settingsCategory"
        @selected="(val) => settingsCategory = val" class="tw-pt-2 tw-text-center" />

        <div v-if="settingsCategory === 'Title'" >
        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.title = val) || true) && $emit('settings', settingsLocal)"
                label="Title" :value="settingsLocal.title" placeholder="Set Title" />

        </div>

        </div>

        <div v-if="settingsCategory === 'Data'">
        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.dataColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.dataColumn" :options="numberColumns" label="Data Column"
                description="Select a column" />

        </div>
        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.dataPrefix = val) || true) && $emit('settings', settingsLocal)"
                label="Data Prefix" :value="settingsLocal.countPrefix" placeholder="e. g. $ etc" />

        </div>

        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.dataSuffix = val) || true) && $emit('settings', settingsLocal)"
                label="Data Suffix" :value="settingsLocal.countSuffix" placeholder="e. g. M/B/T" />

        </div>

        <!-- <div class="tw-w-full tw-py-2  tw-px-2"> -->
        <!--     <AGInput class="tw-w-full tw-mb-2" -->
        <!--         @inputed="(val) => ((settingsLocal.dataPrecision = val) || true) && $emit('settings', settingsLocal)" -->
        <!--         label="Precision" :value="settingsLocal.dataPrecision" type='number' /> -->
        <!---->
        <!-- </div> -->
        <div class="tw-w-full tw-py-2  tw-px-2">
                        <AGSelect class="tw-w-full tw-mb-2"
                            @select="(val) => ((settingsLocal.dataFormat = val) || true) && $emit('settings', settingsLocal)"
                            :selected="settingsLocal.dataFormat" :options="numericFormats" label="Format"
                            description="Select a format" :areOptionsObject=true />

        </div>
        </div>
        <div v-if="settingsCategory === 'Trend'">
        <div class="tw-w-full tw-py-2  tw-px-2" v-if="!settingsLocal.trendFromNextRow">
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.trendColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.trendColumn" :options="numberColumns" label="Trend Column"
                description="Select a column" />
        </div>
        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGBool class="tw-w-full tw-mb-2"
                @updated="(val) => ((settingsLocal.trendFromNextRow = val) || true) && $emit('settings', settingsLocal)"
                :val="settingsLocal.trendFromNextRow" label="Pick from next row of data column" />
            <div class="tw-text-sm">
            Note: last value in data column will be ignored as there won't be any trend to show. 
            </div>

        </div>

        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.trendPrefix = val) || true) && $emit('settings', settingsLocal)"
                label="Trend Prefix" :value="settingsLocal.trendPrefix" placeholder="e. g. Last Week" />

        </div>
        <div class="tw-w-full tw-py-2  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.trendSuffix = val) || true) && $emit('settings', settingsLocal)"
                label="Trend Suffix" :value="settingsLocal.trendSuffix" placeholder="e. g. M/B/T default %" />

        </div>

        <!-- <div class="tw-w-full tw-py-2  tw-px-2"> -->
        <!--     <AGInput class="tw-w-full tw-mb-2" -->
        <!--         @inputed="(val) => ((settingsLocal.trendPrecision = val) || true) && $emit('settings', settingsLocal)" -->
        <!--         label="Precision" :value="settingsLocal.trendPrecision" type='number' /> -->
        <!---->
        <!-- </div> -->
        <div class="tw-w-full tw-py-2  tw-px-2">
                        <AGSelect class="tw-w-full tw-mb-2"
                            @select="(val) => ((settingsLocal.trendFormat = val) || true) && $emit('settings', settingsLocal)"
                            :selected="settingsLocal.trendFormat" :options="numericFormats" label="Format"
                            description="Select a format" :areOptionsObject=true />

        </div>

        <div class="tw-w-full tw-py-2  tw-px-2" v-if="settingsLocal.trendColumn">
            <AGBool class="tw-w-full tw-mb-2"
                @updated="(val) => ((settingsLocal.directReference = val) || true) && $emit('settings', settingsLocal)"
                :val="settingsLocal.directReference" label="Direct Reference for Trend" />

        </div>
        </div>

        <div v-if="settingsCategory === 'Subtitle'">

        <div class="tw-w-full tw-py-2  tw-px-2" >
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.subtitleColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.subtitleColumn" :options="columns" label="Subtitle Column"
                description="Select a column" />
        </div>
        </div>
    </div>
</template>

<script>
import AGBool from 'components/base/bool.vue'
import AGSelect from 'components/base/select.vue'
import AGInput from 'components/base/agInput.vue'
import BoxSelect from 'components/base/boxSelect.vue';

import { findDataType } from 'src/helpers/dataTypes';
import {numericFormats} from 'src/helpers/numeralFormatting'
export default {

    name: "NumberSettings",
    components: { AGBool, AGInput, AGSelect, BoxSelect},
    props: ['columns', 'settings', 'colDetails'],
    data() {
        return {
            settingsLocal: this.settings || {},
            settingsCategory: 'Data',
            settingsCategories: ['Title', 'Data', 'Trend', 'Subtitle'].map(i => {
            return {name: i, value: i}
            }),
            numericFormats: numericFormats,
        }
    },

    computed: {
        numberColumns() {
            return this.columns && this.columns.filter(col => findDataType(this.colDetails, col) === 'number') || []
        }
    }

}
</script>
