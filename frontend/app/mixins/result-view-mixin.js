import Ember from 'ember';

import HelperMixin from 'frontend/mixins/helper-mixin'


export default Ember.Mixin.create(HelperMixin, {
  resultViewIcons: {
    'calendar': 'fe fe-calendar',
    'number': 'fe fe-hash',
    'table': 'fe fe-list',
    'line': 'fe fe-trending-up',
    'pie': 'fe fe-pie-chart',
    'funnel': 'fe fe-align-center',
    'bars': 'fe fe-bar-chart',
    'area': 'fe fe-activity',
    'bubble': 'fe fe-circle',
    'pivot table': 'fe fe-eye',
    'transposed table': 'fe fe-list rotated90'
  },

  resultViewIconsColumnClass: {
    'transposed table': 'rotated90'
  },

  resultViewDashboardDefaultDimensions: {
    'Calendar': {
      width: 24,
      height: 44
    },
    'Number': {
      width: 12,
      height: 6
    },
    'Table': {
      width: 24,
      height: 24
    },
    'Line': {
      width: 24,
      height: 12
    },
    'Pie': {
      width: 24,
      height: 16
    },
    'Funnel': {
      width: 24,
      height: 16
    },
    'Bars': {
      width: 24,
      height: 12
    },
    'Area': {
      width: 24,
      height: 12
    },
    'Bubble': {
      width: 24,
      height: 12
    },
    'PivotTable': {
      width: 24,
      height: 12
    }
  },

  findIfDate(el) {
    let date = Date.parse(el);
    let dateMatch = el && (el.toString().match('-') != null);
    return (date.toString() != 'NaN' && dateMatch);
  },
  findIfNumber(el) {
    return (parseFloat(el).toString() != NaN.toString());
  },
  any(arr, method) {
    return arr.map((item) => {
      return method.call(this, item);
    }).reduce((a, b) => {
      return a || b;
    }, true);
  },
  all(arr, method) {
    return arr.map((item) => {
      return method.call(this, item);
    }).reduce((a, b) => {
      return a && b;
    }, true);
  },
  categoryColumnsCount(row) {
    return row.filter((item) => {
      return !(this.findIfNumber(item) || this.findIfDate(item) || null);
    }).length;
  },
  autoDetect(rows) {
    if (rows.length == 0) {
      return 'Table';
    }
    if (rows.length == 1 && rows[0].length < 10 && this.all(rows[rows.length - 1], this.findIfNumber)) {
      return 'Number';
    }
    if (rows[rows.length - 1].length == 2 && this.categoryColumnsCount(rows[rows.length - 1]) == 1 && this.any(rows[0], this.findIfNumber)) {
      return 'Pie';
    }
    if ((this.any(rows[rows.length - 1], this.findIfDate) || this.any(rows[rows.length - 1], this.findIfNumber)) &&
      this.categoryColumnsCount(rows[rows.length - 1]) <= 2 &&
      (rows[rows.length - 1].length - this.categoryColumnsCount(rows[rows.length - 1]) >= 2)) {
      return 'Line';
    }
    return 'Table';
  },

  isDisplayable(params) {
    var objType = (Object.prototype.toString.call(params).replace(/\[object|\]/g, '').trim());
    if (objType == 'Object') {
      return "Object"
    } else if (objType == 'Array') {
      if (this.all(params, this.isObj)) {
        return "Array"
      }
      return false
    }
    return false
  },


  parseApiActionResult(response, apiAction) {
    let displayKey = apiAction.get('response_settings.displayKey.key')
    let displayType = apiAction.get('response_settings.displayKey.objType')
    let arrayKeys = displayKey.split(".").filter((key) => key != "root").join(".")
    if (arrayKeys == "") {
      arrayKeys = "."
    }
    let responseBody = {}
    try {
      responseBody = JSON.parse(response.response_body)
    } catch (e) {
      this.set('errors', "Api did not return any valid results");
      return
    }
    let data = this.jsonPath(responseBody, arrayKeys)
    let results = {}
    if (data) {
      if (displayType == 'Object') {
        data = data && data[0]
        results['columns'] = Object.keys(data)
        results['rows'] = [(results['columns'].length > 0) && results['columns'].map((key) => {return data[key]})].filter((row) => {return row})
      } else if (displayType == 'Array') {
        results['columns'] = []
        data.forEach((item) => {
          Object.keys(item).forEach((key) => {
            results['columns'].push(key)
          })
        })
        results['columns'] = this.unique(results['columns'])
        results['rows'] = []
        data.forEach((obj) => {
          console.log(obj)
          results['rows'].push(results['columns'].map((key) => {return obj[key]}))
        })
      }
      return results
    }
    return {
      columns: [],
      rows: []
    }
  },
  jsonPath(obj, expr, arg) {
    var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function (expr) {
        var subx = [];
        return expr.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) {return "[#" + (subx.push($1) - 1) + "]";})
          .replace(/'?\.'?|\['?/g, ";")
          .replace(/;;;|;;/g, ";..;")
          .replace(/;$|'?\]|'$/g, "")
          .replace(/#([0-9]+)/g, function ($0, $1) {return subx[$1];});
      },
      asPath: function (path) {
        var x = path.split(";"), p = "$";
        for (var i = 1, n = x.length; i < n; i++)
          p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
        return p;
      },
      store: function (p, v) {
        if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
        return !!p;
      },
      trace: function (expr, val, path) {
        if (expr) {
          var x = expr.split(";"), loc = x.shift();
          x = x.join(";");
          if (val && val.hasOwnProperty(loc))
            P.trace(x, val[loc], path + ";" + loc);
          else if (loc === "*")
            P.walk(loc, x, val, path, function (m, l, x, v, p) {P.trace(m + ";" + x, v, p);});
          else if (loc === "..") {
            P.trace(x, val, path);
            P.walk(loc, x, val, path, function (m, l, x, v, p) {typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);});
          }
          else if (/,/.test(loc)) { // [name1,name2,...]
            for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
              P.trace(s[i] + ";" + x, val, path);
          }
          else if (/^\(.*?\)$/.test(loc)) // [(expr)]
            P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
          else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
            P.walk(loc, x, val, path, function (m, l, x, v, p) {if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) P.trace(m + ";" + x, v, p);});
          else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
            P.slice(loc, x, val, path);
        }
        else
          P.store(path, val);
      },
      walk: function (loc, expr, val, path, f) {
        if (val instanceof Array) {
          for (var i = 0, n = val.length; i < n; i++)
            if (i in val)
              f(i, loc, expr, val, path);
        }
        else if (typeof val === "object") {
          for (var m in val)
            if (val.hasOwnProperty(m))
              f(m, loc, expr, val, path);
        }
      },
      slice: function (loc, expr, val, path) {
        if (val instanceof Array) {
          var len = val.length, start = 0, end = len, step = 1;
          loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {start = parseInt($1 || start); end = parseInt($2 || end); step = parseInt($3 || step);});
          start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
          end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
          for (var i = start; i < end; i += step)
            P.trace(i + ";" + expr, val, path);
        }
      },
      eval: function (x, _v, _vname) {
        try {return $ && _v && eval(x.replace(/@/g, "_v"));}
        catch (e) {throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"));}
      }
    };

    var $ = obj;
    if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
      return P.result.length ? P.result : false;
    }
  }

});
