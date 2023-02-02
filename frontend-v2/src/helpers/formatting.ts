
import { formatNumber } from 'src/helpers/numeralFormatting'
import { formatDatetime } from 'src/helpers/datetimeFormatting'

const formatFunc = {
  'datetime': formatDatetime,
  'number': formatNumber
}
const formattedValue = function(value, settings, dataType) {
  if (settings) {
    const ff = formatFunc[dataType]
    const displayValue = ff ? ff(value, settings.format) : value && value.toString()
    return settings.displayText.replace(/{{\W*columnValue\W*}}/, displayValue)
  }
  return value
}

export { formattedValue }


