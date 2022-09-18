
const dataTypesMapping = {
                                "NaiveDateTime": "datetime",
                                "Inferred.DateTime": "datetime",
                                "Integer": "number",
                                "Float": "number",
                                "Decimal": "number"
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


export  {findDataType, dataTypesMapping};
