import hash from 'src/helpers/syncHash'
const defaultColors = [
  '#6574cd', '#FFCCB3', '#F675A8', '#006E7F',
  '#554994', '#54BAB9', '#80558C', '#F29393',
  '#85586F', '#774360', '#B25068', '#A91079',
  '#3AB0FF', '#B22727', '#37E2D5', '#EE5007'
]

const addTransparancy = function(color: string, opacity: number) {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

const generateColors = function(n: number) {

  if (n <= 16) {
    return defaultColors.slice(0, n);
  }
  const colors = [...defaultColors];
  for (let j = 0; j < 6; j++) {
    for (let colorIndex = 0; colorIndex < 16; colorIndex++) {
      let color = defaultColors[colorIndex];
      color = color.slice(1, color.length);
      const newColor = addTransparancy(color, 1 - (0.15 * (j + 1)));
      colors.push('#' + newColor);
      if (colors.length === n) {
        return colors;
      }
    }
  }
}

const autoTextColor = function(bgColor) {
  const lightColor = 'white'
  const darkColor = '#6e7687'
  if (!bgColor) { return darkColor }
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}

const getRandomColor = function(value, darkOnly) {
  let colors = generateColors(100)
  if (darkOnly) {
    colors = colors.filter(c => {
      return autoTextColor(c) == 'white'
    })
  }
  const sha = hash(value.toString())
  const index = Math.round(colors.length * parseInt(sha, 16) / Math.pow(16, sha.length));
  return colors[index]
}

export { generateColors, defaultColors, autoTextColor, getRandomColor };
