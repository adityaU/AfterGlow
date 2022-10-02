
import AGTable from 'components/dataRenderers/charts/table.vue';
import AGTransposedTable from 'components/dataRenderers/charts/transposedTable.vue';
import AGNumberChart from 'components/dataRenderers/charts/numberChart.vue';
import AGComboChart from 'components/dataRenderers/charts/comboChart.vue';
import AGPie from 'components/dataRenderers/charts/pieChart.vue';

import TableSettings from 'components/dataRenderers/charts/settings/tableSettings.vue';
import ComboChartSettings from 'components/dataRenderers/charts/settings/mixedChartSettings.vue';
import PieChartSettings from 'components/dataRenderers/charts/settings/pieChartSettings.vue';
import NumberChartSettings from 'components/dataRenderers/charts/settings/numberSettings.vue';

import {shallowRef} from 'vue';


  const newComponentDefs =
  {
    table: {
      settingsComponent: shallowRef(TableSettings),
      visComponent: shallowRef(AGTable),
      additionalProps: {},
    },
    transposed_table: {
      settingsComponent: shallowRef(TableSettings),
      visComponent: shallowRef(AGTransposedTable),
      additionalProps: {},
    },
    pie: {
      settingsComponent: shallowRef(PieChartSettings),
      visComponent: shallowRef(AGPie),
      additionalProps: {},
    },
    funnel: {
      settingsComponent: shallowRef(PieChartSettings),
      visComponent: shallowRef(AGPie),
      additionalProps: { defaultChartType: 'funnel', hideFunnelOptions: true },
    },
    line: {
      settingsComponent: shallowRef(ComboChartSettings),
      visComponent: shallowRef(AGComboChart),
      additionalProps: { defaultChartType: 'line' },
    },
    bar: {
      settingsComponent: shallowRef(ComboChartSettings),
      visComponent: shallowRef(AGComboChart),
      additionalProps: { defaultChartType: 'bar' },
    },
    area: {
      settingsComponent: shallowRef(ComboChartSettings),
      visComponent: shallowRef(AGComboChart),
      additionalProps: { defaultChartType: 'area' },
    },
    bubble: {
      settingsComponent: shallowRef(ComboChartSettings),
      visComponent: shallowRef(AGComboChart),
      additionalProps: { defaultChartType: 'scatter' },
    },
    number: {
      settingsComponent: shallowRef(NumberChartSettings),
      visComponent: shallowRef(AGNumberChart),
      additionalProps: {},
    },
  }

export {newComponentDefs};
