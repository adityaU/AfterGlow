var express = require('express')
var app = express()

const defaultColors = [
'#6A67CE','#FFCCB3','#F675A8','#006E7F',
'#554994','#54BAB9','#80558C','#F29393',
'#85586F','#774360','#B25068','#A91079',
'#3AB0FF','#B22727','#37E2D5','#EE5007'
]

const addTransparancy = function(color, opacity){
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

const  generateColors = function(n){

  if (n <= 16) {
    return defaultColors.slice(0, n);
  }
  const colors = [...defaultColors];
    for (let j = 0; j < 6; j++) {
      for (let colorIndex = 0; colorIndex < 16; colorIndex++) {
        let color = defaultColors[colorIndex];
        color = color.slice(1, color.length);
        const newColor = addTransparancy(color, 1 - (0.15*(j+1)));
        if (colors.length === n) {
          return colors;
        }
      }
  }
}


const chartWidth = 750;
const chartHeight = 1200
const echarts = require('echarts');
const sharp = require('sharp');
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

const getColumnIndex = function(columnName, columns) {
  return columns.indexOf(columnName)
}

const renderChartCondition = function(settings) {
  return settings.xaxis && settings.series[0].dataColumn
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

const getXType = function(columnName, columnDetails) {
  return chartDTMapping[findDataType(columnDetails, columnName)] || "category"
}

const bubbleSymbolSize = function(maxValue) {
  return function(data) {
    if (isNaN(data[1])) {
      return 0
    }
    return (data[1] / maxValue) * 150
  }
}



const  renderChartConditionPie = function(settings) {
  return settings.labels &&
    settings.series[0].dataColumn
}

const labelFormatter = function(params) {
  return params.seriesName
}

const makeOptionsCombo = function(settings, results, rendererType) {
  let options = {
    title: {
      text: settings.title,
      left: 'center',
      textStyle: {
        color: "#6e7687",
        fontSize: 25
      }

    },
    legend: { bottom: '10', type: 'scroll', pageIconColor: '#6e7687', pageTextStyle: { color: '#6e7687' }, padding: [5, 10] },
    tooltip: {
      trigger: 'axis',
      order: 'valueDesc',
    },
  }

  let max = 1
  const xIndex = getColumnIndex(settings.xaxis, results.columns)
  if (xIndex >= 0 && renderChartCondition(settings)) {
    let xaxisData = [...new Set(results.rows.map((row) => {
      return row[xIndex]
    }))].sort((a, b) => { return a > b ? -1 : 1 })


    options.xAxis = {
      type: getXType(settings.xaxis, results.columns),
      name: settings.xTitle,
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: "#6e7687"
        }
      }
    }
    options.yAxis = {
      name: settings.yTitle,
      nameLocation: 'middle',
      nameTextStyle: {
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: "#6e7687"
        }
      }
    }
    settings.series.forEach((s, index) => {

      options.yAxis.type = getXType(s.dataColumn, results.column_details)


      let data = {}; let uniqueDimensions = {};

      let yIndex = getColumnIndex(s.dataColumn, results.columns)
      let dimIndex = getColumnIndex(s.dimension.dataColumn, results.columns)
      results.rows.forEach((row) => {
        let xaxis = row[xIndex]
        let dimension = row[dimIndex]
        let yaxis = row[yIndex]
        data[xaxis] = data[xaxis] ? data[xaxis] : {}
        data[xaxis][dimension] = yaxis
        uniqueDimensions[dimension] = true
      })

      let dimensionsData = {}
      xaxisData.forEach((xItem) => {
        Object.entries(uniqueDimensions).forEach((det, _) => {
          if (!dimensionsData[det[0]]) { dimensionsData[det[0]] = [] }
          const d = data[xItem][det[0]]
          dimensionsData[det[0]].push([xItem, d ? d : null])
        })
      })


      let longestY = 100

      Object.entries(dimensionsData).forEach((det, i) => {
        let opt = s.dimension.options && s.dimension.options.filter((option) => {
          return option.name == det[0]
        })


        if (opt && opt.length >= 0) { opt = opt[0] }
        const legendName = opt ? (opt.legendName || opt.name) : s.dataColumn
        const color = opt ? opt.color : s.color
        const chartType = opt ? opt.chartType : s.chartType
        const name = opt ? opt.name : s.dataColumn
        const showLabel = opt ? opt.showLabel : s.showLabel


        options.series = options.series ? options.series : []
        options.legend = options.legend ? options.legend : {}
        options.legend.data = options.legend.data ? options.legend.data : []

        options.legend.data.push(legendName || name)

        let seriesDatum = {
          name: legendName || name,
          type: chartType || rendererType || 'line',
          data: det[1],
          color: color,
          label: { show: showLabel, position: 'top', backgroundColor: 'white', color: '#6e7687' }
        }

        if (seriesDatum.type === 'area') {
          seriesDatum.type = 'line'
          seriesDatum.areaStyle = { opacity: 0.6 }
        }
        if (seriesDatum.type === 'scatter') {

          if (options.yAxis.type === 'value') {
            let maxLocal = Math.max(...det[1].map((tuple) => { return tuple[1] }))
            max = maxLocal > max ? maxLocal : max
          }
          seriesDatum.symbolSize = bubbleSymbolSize(maxValue)
        }        
        seriesDatum.label.position = 'inside'  

        if (s.isStacked) {
          seriesDatum.stack = s.dataColumn + "-" + index
        }

        options.series.push(seriesDatum)

      })
      options.yAxis.nameGap = Math.ceil(15 * 0.35 * longestY + 50)
    })

    return options
  }
  return options
}


const makeOptionsPie = function(settings, results, rendererType) {

  let options = {
    title: {
      text: settings.title,
      left: 'center',
      textStyle: {
        color: "#6e7687",
        fontSize: 25
      }

    },
    legend: { bottom: '20', type: 'scroll', pageIconColor: '#6e7687', pageTextStyle: {color: '#6e7687'} , padding: [10, 20] },
    tooltip: {
      trigger: 'item'
    },
  }

  let max = 1
  const xIndex = getColumnIndex(settings.labels, results.columns)
  if (xIndex >= 0 && renderChartConditionPie(settings)) {
    let labelsData = [...new Set(results.rows.map((row) => {
      return row[xIndex]
    }))].sort((a, b) => { return a > b ? -1 : 1 })


    settings.series.forEach((s, index) => {



      let data = {}; let uniqueDimensions = {};

      let yIndex = getColumnIndex(s.dataColumn, results.columns)
      let dimIndex = getColumnIndex(s.dimension.dataColumn, results.columns)
      results.rows.forEach((row) => {

        let labels = row[xIndex]
        let dimension = row[dimIndex]
        let yaxis = row[yIndex]
        data[labels] = data[labels] ? data[labels] : {}
        data[labels][dimension] = yaxis
        uniqueDimensions[dimension] = true
      })

      let dimensionsData = {}
      labelsData.forEach((xItem) => {
        Object.entries(uniqueDimensions).forEach((det, _) => {
          if (!dimensionsData[det[0]]) { dimensionsData[det[0]] = [] }
          const d = data[xItem][det[0]]
          dimensionsData[det[0]].push([xItem, d ? d : null])
        })
      })


      Object.entries(dimensionsData).forEach((det, i) => {
        let opt = s.dimension.options && s.dimension.options.filter((option) => {
          return option.name == det[0]
        })


        if (opt && opt.length >= 0) { opt = opt[0] }
        const legendName = opt ? (opt.legendName || opt.name) : s.dataColumn
        const color = opt ? opt.color : s.color
        const name = opt ? opt.name : s.dataColumn
        const showLabel = opt ? opt.showLabel : s.showLabel


        options.series = options.series ? options.series : []
        options.legend = options.legend ? options.legend : {}
        // options.legend.data = options.legend.data ? options.legend.data : []
        //
        // options.legend.data.push(legendName || name)

        let seriesDatum1 = {
          name: legendName || name,
          avoidLabelOverlap: true,
          type: rendererType || 'pie',
          itemStyle: {
            borderRadius: 8
          },
          data: det[1].map((item) => {
            return {
              value: item[1], name: item[0]
            }
          }).filter((datum) => { return !isNaN(datum.value) && datum.value }),
          color: generateColors(det[1].length),
          label: { show: showLabel, position: 'outside', formatter: "{b}", fontWeight: 'bold' },
          labelLine: {
            show: true
          },
        }


        seriesDatum1.chartType = s.chartType
        seriesDatum1.type = (s.chartType == 'funnel') ? 'funnel' : 'pie'
        if (s.chartType === 'doughnut') {
          seriesDatum1.radius = ['40%', '80%']
          seriesDatum1.label.show = true
          seriesDatum1.label.position = 'center'
          seriesDatum1.label.formatter = labelFormatter
          seriesDatum1.label.fontWeight = 'bold'
        }
        if (s.chartType === 'polar area') {
          seriesDatum1.radius = ['20%', '80%']
          seriesDatum1.roseType = 'area'
          seriesDatum1.label.show = true
          seriesDatum1.label.position = 'center'
          seriesDatum1.label.formatter = labelFormatter
          seriesDatum1.label.fontWeight = 'bold'
        }

        let seriesDatum2 = JSON.parse(JSON.stringify(seriesDatum1))
        seriesDatum2.label.show = showLabel
        seriesDatum2.label.position = 'inside'
        seriesDatum2.label.formatter = '{c}({d}%)'
        seriesDatum2.label.name += "1"
        options.series.push(seriesDatum1)
        options.series.push(seriesDatum2)

      })
    })

    if (options.series && (options.series.length / 2) > 1) {
      if (settings.concentricRendering) {
        const div = 85 / (options.series.length)
        options.series = options.series.filter((_, i) => i % 2 != 0)

        options.series.forEach((s, i) => {
          s.radius = [div * (i) + 4 + '%', div * (i + 1) + '%']
        })

      } else {
        options = setChartPosition(options)
      }
    }



    return options
  }
  return options
}
const setChartPosition = function(options) {
  if (options.series && options.series.length / 2 > 1) {
    let guessedDiv = Math.floor(chartWidth / 250) + 1
    let div = options.series.length / 2 > guessedDiv ? guessedDiv : options.series.length / 2

    options.series.forEach((s, i) => {
      let j = Math.floor(i / 2)
      let xBase = 0
      const yBase = (100 / (Math.ceil(options.series.length / (2 * div)) + 1)) * Math.ceil((i + 1) / (2 * div))

      if (options.series.length % (2 * div) != 0 && Math.ceil(options.series.length / (2 * div)) === Math.ceil((i + 1) / (2 * div))) {
        const newDiv = (options.series.length % (2 * div)) / 2
        xBase = (100 / (newDiv + 1)) * ((j % newDiv) + 1)
      } else {
        xBase = (100 / (div + 1)) * ((j % div) + 1)
      }
      const maxHeight = (chartHeight - 300) * (2 / (Math.ceil(options.series.length / div) + 2))
      const maxWidth = chartWidth * (1 / ((2 * div) + 2))
      let baseRadius = Math.min(maxWidth, maxHeight) - 10

      if (['doughnut', 'polar area'].indexOf(s.chartType) >= 0) {
        s.radius = [baseRadius * 0.4, baseRadius]    
        s.center = [xBase + '%', yBase + '%'] 
             }  else if (s.chartType === 'pie') {
          s.radius = baseRadius
        s.center = [xBase + '%', yBase + '%']
      }

    })

  }

  return options
}


app.get('/render_chart/', function(req, res) {
  let payload = req.query.payload
  let buff = new Buffer(payload, 'base64');
  payload = buff.toString('utf8');
  payload = JSON.parse(payload)



  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 1200,
    height: 750
  });


  if (['pie', 'funnel'].indexOf(payload.renderer_type) >= 0){
    chart.setOption(makeOptionsPie(payload.settings, payload.results, payload.renderer_type));
  }else{
    chart.setOption(makeOptionsCombo(payload.settings, payload.results, payload.renderer_type));
  }

  const svgStr = chart.renderToSVGString();
  res.set('Content-Type', 'image/png');
  sharp(Buffer.from(svgStr)).png().toBuffer().then((png) => {
    res.send(png)
  })

})

app.listen(3000)
