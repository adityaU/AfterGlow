import JP from 'jmespath';

import {
  isObject,
  isEqual,
  cloneDeep,
  isDate,
  isBoolean,
  isNumber,
} from 'lodash';
import { findDataType } from './dataTypes';

const responseBody = function (apiResponse) {
  try {
    return JSON.parse(apiResponse?.response_body || {});
  } catch (error) {
    console.log(error);
    return { response: apiResponse?.response_body };
  }
};
const finalQuery = function (apiResponse) {
  const apiRes = cloneDeep(apiResponse || {});
  apiRes.response_body = 'redacted';
  return JSON.stringify(apiRes);
};

const isObject2 = function (jsonAttr) {
  return isObject(jsonAttr) && !Array.isArray(jsonAttr);
};
const isArray = function (jsonAttr) {
  return Array.isArray(jsonAttr);
};
const isData = function (jsonAttr) {
  return !isObject2(jsonAttr) && !isArray(jsonAttr);
};

const extractData = function (apiResponse, jsonPath) {
  if (jsonPath == '' || !jsonPath) {
    return { success: true, results: responseBody(apiResponse) };
  }
  try {
    return {
      success: true,
      results: JP.search(responseBody(apiResponse), jsonPath),
    };
  } catch (error) {
    console.log(error);
    return { success: false, results: null };
  }
};

const findType = function (data) {
  data = data.filter((d) => d);
  let types = data.map((d) => {
    if (isDate(d)) return 'datetime';
    if (isNumber(d)) return 'number';
    if (isBoolean(d)) return 'boolean';
    return 'text';
  });
  types = [...new Set(types)];
  if (types.length == 1) {
    return types[0];
  }
  return 'text';
};

const findColumnDetails = function (rows, columns) {
  const colDetails = {};
  columns.forEach((c, i) => {
    colDetails[c] = {
      data_type: findType(rows.map((row) => row[i]).slice(0, 10)),
    };
  });
  return colDetails;
};

const extractResultsFromJsonPath = function (apiResponse, jsonPath) {
  const extracted = extractData(apiResponse, jsonPath);
  if (!extracted.success) {
    return extracted;
  }

  let results = extracted.results;
  if (results?.length === 0) {
    return { success: false, results: null };
  }
  if (isObject2(results)) {
    const resultsLocal = {
      columns: Object.keys(results),
      rows: [],
      final_query: finalQuery(apiResponse),
      query_type: 'json',
    };
    resultsLocal.rows[0] = results.columns.map((c) => results[c]);
    resultsLocal.column_details = findColumnDetails(
      resultsLocal.rows,
      resultsLocal.columns
    );
    return { success: true, results: resultsLocal };
  }

  if (isArray(results)) {
    if (results.length == 1 && isArray(results[0])) {
      results = results[0];
    }
    const isObjectArray = results.map((r) => isObject2(r)).indexOf(true) >= 0;
    if (isObjectArray) {
      const allKeys = [];
      results.forEach((r) => {
        if (isObject(r)) {
          allKeys.push(...Object.keys(r));
        }
      });
      const resultsLocal = {
        columns: [...new Set(allKeys)],
        rows: [],
        final_query: finalQuery(apiResponse),
        query_type: 'json',
      };
      resultsLocal.rows = results.map((r) => {
        return resultsLocal.columns.map((c) => r[c]);
      });
      resultsLocal.column_details = findColumnDetails(
        resultsLocal.rows,
        resultsLocal.columns
      );
      return { success: true, results: resultsLocal };
    } else {
      const resultsLocal = {
        columns: [jsonPath],
        rows: [],
        final_query: finalQuery(apiResponse),
        query_type: 'json',
      };
      resultsLocal.rows = results.map((r) => [r]);
      resultsLocal.column_details = findColumnDetails(
        resultsLocal.rows,
        resultsLocal.columns
      );
      return { success: true, results: resultsLocal };
    }
  }
};

export { responseBody, extractResultsFromJsonPath };
