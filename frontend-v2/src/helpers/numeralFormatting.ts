import numeral from 'numeral';
const formats = [['0,0.0000' ,'10,000.0000'],
['0,0' ,'10,000'],
['+0,0' ,'+10,000'],
['0,0.0' ,'-10,000.0'],
['0.000' ,'10000.123'],
['00000' ,'00100'],
['000000,0' ,'001,000'],
['000.00' ,'010.00'],
['0[.]00000' ,'10000.12340'],
['(0,0.0000)' ,'(10,000.0000)'],
['.00' ,'-.23'],
['(.00)' ,'(.23)'],
['0.00000' ,'0.23000'],
['0.0[0000]' ,'0.23'],
['0.0a' ,'1.2m'],
['0 a' ,'1 k'],
['0a' ,'-104k'],
['0o' ,'1st'],
['0o' , '100th']]

const numericFormats = formats.map(f => {
  return {name: f[0], subtitle: f[1], value: f[0]}
})

const formatNumber = function(number, format) {
  return numeral(number).format(format)
}

const precise = function(number, precision){
  if (precision === null){
    return number
  }
  return Number.parseFloat(number).toFixed(2)
}

export {formatNumber, numericFormats, precise}
