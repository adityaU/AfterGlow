
import { ChartAreaIcon, ChartLineIcon, ChartBarIcon, ChartBubbleIcon, ChartPieIcon, FilterIcon, HashIcon, TableIcon, ListDetailsIcon } from 'vue-tabler-icons';
const rendererTypeIcons = {
  number: {
    icon: HashIcon,
    tooltipText: 'Number',
  },
  table: {
    icon: TableIcon,
    tooltipText: 'Table',
  },
  transposed_table: {
    icon: TableIcon,
    tooltipText: 'Transposed Table',
    isIconRotated: true
  },
  line: {
    icon: ChartLineIcon,
    tooltipText: 'Line Chart',
  },
  bar: {
    icon: ChartBarIcon,
    tooltipText: 'Bar Chart',
  },
  area: {
    icon: ChartAreaIcon,
    tooltipText: 'Area Chart',
  },
  bubble: {
    icon: ChartBubbleIcon,
    tooltipText: 'Bubble/Scatter chart',
  },
  pie: {
    icon: ChartPieIcon,
    tooltipText: 'Pie Chart',
  },
  funnel: {
    icon: FilterIcon,
    tooltipText: 'Funnel',
  },
}

const customRendererIcons = {
  customList: {
    icon: ListDetailsIcon,
    tooltipText: "Custom List"
  }
}

export { rendererTypeIcons, customRendererIcons }
