<template>
    <table class="tw-border-collapse tw-w-full">
    </table>
    <table class="tw-border-collapse tw-w-full">
        <thead>
            <tr class="tw-border-b tw-bg-secondary tw-text-default">
                <td class="tw-p-2">
                    Settings
                </td>
            </tr>

        </thead>
        <tbody>
            <tr class="tw-border-b">
                <td class="tw-p-2">
                    <AGSelect @select="(val) => (settings.xaxis = val) && $emit('settings', settings)"
                        :options="columns" label="X-Axis Column" description="Select a column" />
                </td>
            </tr>
        </tbody>
    </table>

    <table class="tw-border-collapse tw-w-full" v-for="s, index in settings.series" :key="s">
        <thead>
            <tr class="tw-border-b tw-bg-secondary tw-text-default tw-w-full">
                <td class="tw-p-2">
                    Data Series {{ index + 1 }}
                </td>
            </tr>

        </thead>
        <tbody>
            <tr class="tw-border-b">
                <td class="tw-p-2">
                    <AGSelect @select="(val) => (s.dataColumn = val) && $emit('settings', settings)" :options="columns"
                        label="Y-Axis Column" description="Select a column" />
                </td>
            </tr>

            <tr class="tw-border-b">
                <td class="tw-p-2">
                    <AGSelect @select="(val) => (s.dimension.dataColumn = val) && $emit('settings', settings)"
                        :options="columns" label="Dimension" description="Select a column" />

                </td>
            </tr>

            <table v-if="s.dimension.dataColumn" class="tw-w-full">
            <tr class="tw-border-b tw-w-full"  v-for="dimOption in s.dimension.options" :key="dimOption">
                <td class="tw-p-2 tw-pl-6">
                    <ColorSelector @selectColor="(val) => (dimOption.color = val) && $emit('settings', settings)"
                     :label="dimOption.name + ' color'"   :selectedColor="dimOption.color"></ColorSelector>
                </td>
            </tr>
            </table>
            <!-- <tr class="tw-border-b" v-for="dimOption in s.dimension.options" :key="dimOption"> -->
            <!--     <td class="tw-p-2 tw-pl-6"> -->
            <!--         <ColorSelector @selectColor="(val) => (dimOption. = val) && $emit('settings', settings)" -->
            <!--             :selectedColor="dimOption.color"></ColorSelector> -->
            <!--     </td> -->
            <!-- </tr> -->


            <tr class="tw-border-b">
                <td class="tw-p-2">
                    <AGSelect @select="(val) => (s.chartType = val) && $emit('settings', settings)"
                        :options="chartTypes" label="ChartType" description="Select a ChartType" />
                </td>
            </tr>
            <tr class="tw-border-b" v-if="!s.dimension.dataColumn">
                <td class="tw-p-2">
                    <ColorSelector @selectColor="(val) => (s.color = val) && $emit('settings', settings)"
                        :selectedColor="s.color"></ColorSelector>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="tw-p-2">
        <AGButton label="Add Another" class="tw-px-2" @clicked="addNewSeries" />
    </div>
</template>

<script>
import ColorSelector from 'components/base/colorSelector.vue';
import AGSelect from 'components/base/select.vue';
import AGButton from 'components/base/button.vue';
export default {
    components: { ColorSelector, AGSelect, AGButton },
    props: ["columns"],

    data() {
        return {
            chartTypes: ['line', 'area', 'bar'],
            settings: {
                xaxis: null,
                series: [
                    {
                        dataColumn: null,
                        dimension: { name: null, options: null },
                        color: null,
                        chartType: 'line'
                    }
                ]
            }
        }
    },

    methods: {
        addNewSeries() {
            this.settings.series.push({
                dataColumn: null,
                dimension: { name: null, options: null },
                color: null,
                chartType: 'line'
            })
            this.$emit("settings", this.settings)

        }
    }

}
</script>
