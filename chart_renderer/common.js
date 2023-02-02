function (require, module, __filename, __dirname) {
  let exports = module.exports;

  const chartDTMapping = {
    'datetime': 'time',
    'text': 'category',
    'number': 'value'
  }
  const dataTypesMapping = {
    "NaiveDateTime": "datetime",
    "Inferred.DateTime": "datetime",
    "Integer": "number",
    "Float": "number",
    "Decimal": "number",
    "Boolean": 'boolean'
  }

  exports.getColumnIndex = function(columnName, columns) {
    return columns.indexOf(columnName)
  }

  exports.renderChartCondition = function(settings) {
    return settings.xaxis &&
      settings.series[0].dataColumn
  }


  const findDataType = function(colDetails, col) {
    if (!colDetails || !colDetails[col]) {
      return 'text'
    }
    const dt = dataTypesMapping[colDetails[col].data_type]
    if (dt) {
      return dt
    }

    return 'text'
  }

  exports.getXType = function(columnName, columnDetails) {
    return chartDTMapping[findDataType(columnDetails, columnName)] || "category"
  }


  return module.exports;
}
