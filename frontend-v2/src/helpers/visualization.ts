import { newQueryTerms } from './qtHelpers'
import cloneDeep from 'lodash/cloneDeep'
const newSettings =
{
  table: null,
  transposed_table: null,
  pie: null,
  funnel: null,
  line: null,
  bar: null,
  area: null,
  bubble: null,
  number: null,
  customList: null,
}


const newVisualization = {
  name: 'Visualization 1',
  rendererType: 'table',
  settings: cloneDeep(newSettings),
  queryTerms: cloneDeep(newQueryTerms)
}

export { newSettings, newVisualization }
