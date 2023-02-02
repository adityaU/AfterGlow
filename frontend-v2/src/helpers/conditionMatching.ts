
import { date } from 'quasar'
const findDate = function(value, type, tense) {
  if (!value || !type || !tense) { return null }

  const currentDate = new Date()
  const difference = {}
  if (type === 'weeks') {
    difference['days'] = value * 7
  } else if (type === 'quarters') {
    difference['months'] = value * 3
  } else {
    difference[type] = value
  }

  if (tense === 'ago') {
    return date.subtractFromDate(currentDate, difference)
  }
  return date.addToDate(currentDate, difference)
}

const wrap = function(value, dataType) {
  if (!value) { return null }
  if (typeof (value) === 'object') {
    if (value.type === 'duration') {
      return findDate(value.value.durationValue, value.value.durationType, value.value.durationTense,)
    } else if (value.type === 'datepicker') {
      return new Date(value.value)
    }
    return value
  }
  if (dataType === 'datetime') {
    return value === null ? null : new Date(value)
  }
  if (dataType === 'boolean') {
    return value === null ? null : value.toString()
  }
  return value
}


const operatorFunc = {
  '=': function(a, b, dataType) { return wrap(a, dataType) === wrap(b, dataType) },
  '!=': function(a, b, dataType) { return wrap(a, dataType) != wrap(b, dataType) },
  '>': function(a, b, dataType) { return wrap(a, dataType) > wrap(b, dataType) },
  '>=': function(a, b, dataType) { return wrap(a, dataType) >= wrap(b, dataType) },
  '<': function(a, b, dataType) { return wrap(a, dataType) < wrap(b, dataType) },
  '<=': function(a, b, dataType) { return wrap(a, dataType) <= wrap(b, dataType) },
  'starts With': function(a, b, _dataType) { return a.match(new RegExp(`^${b}`)) },
  'matches': function(a, b, _dataType) { return a.match(new RegExp(`${b}`)) },
  'ends with': function(a, b, _dataType) { return a.match(new RegExp(`${b}$`)) },
  'is not NULL': function(a, _b, dataType) { return wrap(a, dataType) != null },
  'is NULL': function(a, _b, dataType) { return !wrap(a, dataType) },
  'is': function(a, b, dataType) { return wrap(a, dataType) === wrap(b, dataType) },
  'is not': function(a, b, dataType) { return wrap(a, dataType) != wrap(b, dataType) },
}

const extractFormattingSetting = function(conditions, value, dataType) {
  const nonDefaultConditions = conditions ? conditions.filter(c => !c.default) : []
  const defaultCondition = conditions ? conditions.filter(c => c.default)[0] : {}
  for (let index = 0; index < nonDefaultConditions.length; index++) {
    const condition = nonDefaultConditions[index]
    if (operatorFunc[condition.operation](value, condition.value, dataType)) {
      return condition.apply
    }
  }

  return defaultCondition.apply
}

export { extractFormattingSetting } 
