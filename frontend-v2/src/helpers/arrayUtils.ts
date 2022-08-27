

const chunks = function(array: Array<any>, size: number) {
    const arrayOfArrays = [];
    for (let i=0; i<array.length; i+=size) {
      arrayOfArrays.push(array.slice(i,i+size));
    }
    return arrayOfArrays;
  }


export {chunks}
