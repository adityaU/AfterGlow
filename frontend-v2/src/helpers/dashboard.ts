import {_} from 'lodash'
import {queryStore} from 'stores/query'

const query = queryStore()
const makeSettings = function(s, type) {
    const settings = _.cloneDeep(s[1])
    settings['widID'] = s[0]
    settings['type'] = settings['type'] || type || 'question'
    if (!settings['version']) {
        settings['h'] = Math.floor(2.3 * settings['height'])
        settings['w'] = Math.ceil(settings['width'] * 12 / 48)
        settings['y'] = Math.floor(2.3 * settings['y'])
        delete settings['height']
        delete settings['width']
    }
    return settings
}

const convertWidgets = function(dashboard) {
    if (dashboard && dashboard.settings && !dashboard.settings.version) {
        const widgets = []
        if (dashboard && dashboard.settings) {
            Object.entries(dashboard.settings).forEach(s => {
                widgets.push(makeSettings(s, null))
            })
        }
        if (dashboard && dashboard.notes_settings) {
            Object.entries(dashboard.notes_settings).forEach(s => {
                widgets.push(makeSettings(s, 'notes'))
            })
        }
        return widgets
    }
    return (dashboard && dashboard.settings && dashboard.settings.widgets) || []
}

const getQueryAndPayload = function(queryKey, latestPayload){
      const queryParams = query.get(queryKey)
      let payload = {}
      if (queryParams){
        payload = Object.assign({}, JSON.parse(queryParams.payload), latestPayload)
      }

      return {queryParams, payload}
}

export {convertWidgets, getQueryAndPayload}
