
const operatorOptions = {
        'number': ['>', '<', '>=', '<=', '=', '!=',
                'is NULL', 'is not NULL'],
        'datetime': ['>', '<', '>=', '<=', '=', '!=', 'is NULL', 'is not NULL'],
        'boolean' : ['is', 'is not', 'is NULL', 'is NOT NULL'],
        'text': ['=', '!=',
                'is NULL', 'is not NULL', 'matches',
                'starts with', 'ends with']

}
const dataTypesMapping = {
                                "NaiveDateTime": "datetime",
                                "Inferred.DateTime": "datetime",
                                "Integer": "number",
                                "Float": "number",
                                "Decimal": "number",
                                "Boolean" : 'boolean'
                        }

const findDataType = function(colDetails, col){
  if (!colDetails || !colDetails[col]){
    return 'text'
  }
  const dt = dataTypesMapping[colDetails[col].data_type] 
     if (dt) {
       return dt 
     }

   return 'text' 
}


export  {findDataType, dataTypesMapping, operatorOptions};
