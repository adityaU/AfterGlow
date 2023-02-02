import AGInput from 'components/base/input.vue'
import AGSelect from 'components/base/select.vue'
import AGBoxSelect from 'components/base/boxSelect.vue'
import AGColorSelector from 'components/base/colorSelector.vue'
import AGIconSelector from 'components/base/iconSelector.vue'
import AGDateTime from 'components/base/inputDatePicker.vue'
import AGBool from 'components/base/bool.vue'
import AGSearchSelect from 'components/base/searchSelect.vue'
import AGSlider from 'components/base/slider.vue'

const titlePositions = {
  'left': 'flex-start',
  'center': 'center',
  'right': 'flex-end'
}


const inputTypesRendererMapping = {
  'Text Input': AGInput,
  'Text Input Large': AGInput,
  'Number Input': AGInput,
  'True/ False Selector': AGBool,
  'Single Value Selector': AGSelect,
  'Single Value Box Selector': AGBoxSelect,
  'Multi Value Selector': AGSelect,
  'Multi Value Box Selector': AGBoxSelect,
  'Color Selector': AGColorSelector,
  'Icon Selector': AGIconSelector,
  'Search Selector': AGSearchSelect,
  'Number Slider': AGSlider,
  'Date & Time Selector': AGDateTime,
  'Date Selector': AGDateTime,
  'Time Selector': AGDateTime,
}

const titleStyle = function(titleStyles) {
  if (!titleStyles) { return {} }

  const styles = {}
  styles['fontSize'] = titleStyles.fontSize ? titleStyles.fontSize + 'rem' : '2rem'
  styles['color'] = titleStyles.color ? titleStyles.color : 'color'
  styles['justify-content'] = titleStyles.position ? titlePositions[titleStyles.position] : 'flex-start'
  styles['padding-top'] = titleStyles.paddingY ? titleStyles.paddingY + 'rem' : '0.5rem'
  styles['padding-bottom'] = titleStyles.paddingY ? titleStyles.paddingY + 'rem' : '0.5rem'
  styles['padding-left'] = titleStyles.paddingX ? titleStyles.paddingX + 'rem' : '0.5rem'
  styles['padding-right'] = titleStyles.paddingX ? titleStyles.paddingX + 'rem' : '0.5rem'
  return styles
}


export { inputTypesRendererMapping, titleStyle };
