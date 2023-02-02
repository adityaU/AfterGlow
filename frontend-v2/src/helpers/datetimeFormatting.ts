import { date } from 'quasar';
import moment from 'moment';
const formats = [
  ['From Now'],
  ["YYYY-MM-DD"],
  ["DD-MM-YYYY"],
  ["MM-DD-YYYY"],
  ["MM-YYYY"],
  ["MMM-YYYY"],
  ["YYYY/MM/DD"],
  ["DD/MM/YYYY"],
  ["MM/DD/YYYY"],
  ["MM/YYYY"],
  ["MMM/YYYY"],
  ["YYYY"],
  ["ddd, MMM Do, YYYY hh:mm:ss A"],
  ["ddd, MMM Do, YYYY HH:mm:ss "],
  ["ddd, MMM Do, YYYY hh:mm A"],
  ["ddd, MMM Do, YYYY HH:mm "],
  ["ddd, MMM Do, YYYY hh:mm:ss A Z"],
  ["ddd, MMM Do, YYYY HH:mm:ss Z"],
  ["ddd, MMM Do, YYYY hh:mm A Z"],
  ["ddd, MMM Do, YYYY HH:mm Z"],
  ["YYYY-MM-DD hh:mm:ss A"],
  ["YYYY-MM-DD hh:mm:ss A Z"],
  ["YYYY-MM-DD HH:mm:ss"],
  ["YYYY-MM-DD HH:mm:ss Z"],
  ["No Formatting"]
]

const formatDatetime = function(datetime: string, format: string) {
  if (format === 'No Formatting') {
    return datetime
  }
  if (typeof datetime === 'object') {
    datetime = datetime.toString()
  } else if (datetime && !datetime.match(/[z|Z]$/)) {
    datetime = datetime + 'Z'
  }
  if (format === 'From Now') {
    return moment(datetime).fromNow()
  }
  if (format === 'ISO') {
    return moment(datetime).toISOString()
  }
  return date.formatDate(datetime, format)
}

const dateTimeFormats = formats.map(f => {
  return { name: f[0], subtitle: formatDatetime((new Date()).toString(), f[0]), value: f[0] }
})


export { formatDatetime, dateTimeFormats }
