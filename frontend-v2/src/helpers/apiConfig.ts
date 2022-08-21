

const  apiConfig =  function(token){
  return {
    headers: {
      'Authorization': token,
      'accept': 'application/json'
    }
  }

}


export default apiConfig;
