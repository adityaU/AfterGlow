const defaultColors = [
'#6A67CE','#554994','#F675A8','#F29393',
'#FFCCB3','#54BAB9','#80558C','#006E7F',
'#85586F','#774360','#B25068','#A91079',
'#3AB0FF','#B22727','#37E2D5','#EE5007'
]

const addTransparancy = function(color :string, opacity: number){
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

const  generateColors = function(n: number){

  if (n <= 16) {
    return defaultColors.slice(0, n);
  }
  const colors = [...defaultColors];
    for (let j = 0; j < 6; j++) {
      for (let colorIndex = 0; colorIndex < 16; colorIndex++) {
        let color = defaultColors[colorIndex];
        color = color.slice(1, color.length);
        const newColor = addTransparancy(color, 1 - (0.15*(j+1)));
        colors.push('#' + newColor); 
        if (colors.length === n) {
          return colors;
        }
      }
  }
}


export  {generateColors, defaultColors};
