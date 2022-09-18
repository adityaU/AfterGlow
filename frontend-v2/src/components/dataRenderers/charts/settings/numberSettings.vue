<template>

    <div class="tw-divide-y">
        <div class="tw-w-full tw-py-4 tw-px-2 tw-font-semibold tw-text-default tw-text-sm">
            settingsLocal
        </div>

        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.title = val) || true) && $emit('settings', settingsLocal)" label="Title"
                :value="settingsLocal.title" placeholder="Set Title" />

        </div>

        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.dataColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.dataColumn" :options="columns" label="Data Column" description="Select a column" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.trendColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.trendColumn" :options="columns" label="Trend Column"
                description="Select a column" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.dataPrefix = val) || true) && $emit('settings', settingsLocal)"
                label="Data Prefix" :value="settingsLocal.countPrefix" placeholder="e. g. $ etc" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.dataSuffix = val) || true) && $emit('settings', settingsLocal)"
                label="Data Suffix" :value="settingsLocal.countSuffix" placeholder="e. g. M/B/T" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.trendPrefix = val) || true) && $emit('settings', settingsLocal)"
                label="Trend Prefix" :value="settingsLocal.trendPrefix" placeholder="e. g. Last Week" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGInput class="tw-w-full tw-mb-2"
                @inputed="(val) => ((settingsLocal.trendSuffix = val) || true) && $emit('settings', settingsLocal)"
                label="Trend Suffix" :value="settingsLocal.trendSuffix" placeholder="e. g. M/B/T default %" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2" v-if="settingsLocal.trendColumn" >
            <AGBool class="tw-w-full tw-mb-2"
                @updated="(val) => ((settingsLocal.directReference = val) || true) && $emit('settings', settingsLocal)"
                :val="settingsLocal.directReference" label="Direct Reference for Trend" />

        </div>
        <div class="tw-w-full tw-py-4  tw-px-2">
            <AGSelect class="tw-w-full tw-mb-2"
                @select="(val) => ((settingsLocal.subtitleColumn = val) || true) && $emit('settings', settingsLocal)"
                :selected="settingsLocal.subtitleColumn" :options="columns" label="Subtitle Column"
                description="Select a column" />
        </div>
    </div>
</template>

<script>
import AGBool from 'components/base/bool.vue'
import AGSelect from 'components/base/select.vue'
import AGInput from 'components/base/agInput.vue'
export default {

    name: "NumberSettings",
    components: { AGBool, AGInput, AGSelect },
    props: ['columns', 'settings'],
    data() {
        return {
            settingsLocal: this.settings || {}
        }
    }

}
</script>
