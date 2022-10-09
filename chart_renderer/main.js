var express = require('express')
var app = express()

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

const makeOptions = function(settings, results, rendererType) {
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


    console.log(results.columns)
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

      console.log(results.columns)
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

app.get('/render_chart/', function(req, res) {
  let payload = req.query.payload
  console.log(req.query)
  let buff = new Buffer(payload, 'base64');
  payload = buff.toString('utf8');
  payload = JSON.parse(payload)
  console.log(payload.results)



  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: 1200,
    height: 750
  });


  console.log(makeOptions(payload.settings, payload.results))

  chart.setOption(makeOptions(payload.settings, payload.results));

  const svgStr = chart.renderToSVGString();
  res.set('Content-Type', 'image/png');
  sharp(Buffer.from(svgStr)).png().toBuffer().then((png) => {
    res.send(png)
  })

})

app.listen(3000)
