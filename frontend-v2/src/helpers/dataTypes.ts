const operatorOptions = {
  number: ['>', '<', '>=', '<=', '=', '!=', 'is NULL', 'is not NULL'],
  datetime: ['>', '<', '>=', '<=', '=', '!=', 'is NULL', 'is not NULL'],
  boolean: ['is', 'is not', 'is NULL', 'is not NULL'],
  text: [
    '=',
    '!=',
    'is NULL',
    'is not NULL',
    'matches',
    'starts with',
    'ends with',
  ],
};
const dataTypesMapping = {
  String: 'text',
  Number: 'number',
  DateTime: 'datetime',
  Boolean: 'boolean',
  Json: 'text',
  text: 'text',
  number: 'number',
  datetime: 'datetime',
  boolean: 'boolean',
};

const findDataType = function (colDetails, col) {
  if (!colDetails || !colDetails[col]) {
    return 'text';
  }
  if (colDetails[col].is_array) {
    return 'text';
  }
  const dt = dataTypesMapping[colDetails[col].data_type];
  if (dt) {
    return dt;
  }

  return 'text';
};

export { findDataType, dataTypesMapping, operatorOptions };
