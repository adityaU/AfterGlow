<template>
  <div class="tw-h-full" ref="code-wrapper">
    <MonacoEditor theme="AGDraculaTheme" v-model:value="codeLocal" language="sql" @editorWillMount="editorWillMount" @editorDidMount="editorDidMount" />
  </div>
</template>
<script>
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// // import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import {BaseSQLWorker} from 'monaco-sql-languages/out/esm/baseSQLWorker'

// self.MonacoEnvironment = {
//   getWorker(_, label) {
//     if (label === 'sql') {
//       return new BaseSQLWorker()
//     }
//     return new editorWorker()
//   }
// }

const theme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "282a36",
      token: ""
    },
    {
      foreground: "6272a4",
      token: "comment"
    },
    {
      foreground: "f1fa8c",
      token: "string"
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric"
    },
    {
      foreground: "bd93f9",
      token: "constant.language"
    },
    {
      foreground: "bd93f9",
      token: "constant.character"
    },
    {
      foreground: "bd93f9",
      token: "constant.other"
    },
    {
      foreground: "ffb86c",
      token: "variable.other.readwrite.instance"
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escaped"
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escape"
    },
    {
      foreground: "ff79c6",
      token: "string source"
    },
    {
      foreground: "ff79c6",
      token: "string source.ruby"
    },
    {
      foreground: "ff79c6",
      token: "keyword"
    },
    {
      foreground: "ff79c6",
      token: "storage"
    },
    {
      foreground: "8be9fd",
      fontStyle: "italic",
      token: "storage.type"
    },
    {
      foreground: "50fa7b",
      fontStyle: "underline",
      token: "entity.name.class"
    },
    {
      foreground: "50fa7b",
      fontStyle: "italic underline",
      token: "entity.other.inherited-class"
    },
    {
      foreground: "50fa7b",
      token: "entity.name.function"
    },
    {
      foreground: "ffb86c",
      fontStyle: "italic",
      token: "variable.parameter"
    },
    {
      foreground: "ff79c6",
      token: "entity.name.tag"
    },
    {
      foreground: "50fa7b",
      token: "entity.other.attribute-name"
    },
    {
      foreground: "8be9fd",
      token: "support.function"
    },
    {
      foreground: "6be5fd",
      token: "support.constant"
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.type"
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.class"
    },
    {
      foreground: "f8f8f0",
      background: "ff79c6",
      token: "invalid"
    },
    {
      foreground: "f8f8f0",
      background: "bd93f9",
      token: "invalid.deprecated"
    },
    {
      foreground: "cfcfc2",
      token: "meta.structure.dictionary.json string.quoted.double.json"
    },
    {
      foreground: "6272a4",
      token: "meta.diff"
    },
    {
      foreground: "6272a4",
      token: "meta.diff.header"
    },
    {
      foreground: "ff79c6",
      token: "markup.deleted"
    },
    {
      foreground: "50fa7b",
      token: "markup.inserted"
    },
    {
      foreground: "e6db74",
      token: "markup.changed"
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric.line-number.find-in-files - match"
    },
    {

      foreground: "e6db74",
      token: "entity.name.filename"
    },
    {
      foreground: "f83333",
      token: "message.error"
    },
    {
      foreground: "eeeeee",
      token: "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
    },
    {
      foreground: "eeeeee",
      token: "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
    },
    {
      foreground: "8be9fd",
      token: "meta.structure.dictionary.json string.quoted.double.json"
    },
    {
      foreground: "f1fa8c",
      token: "meta.structure.dictionary.value.json string.quoted.double.json"
    },
    {
      foreground: "50fa7b",
      token: "meta meta meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ffb86c",
      token: "meta meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ff79c6",
      token: "meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "bd93f9",
      token: "meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "50fa7b",
      token: "meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ffb86c",
      token: "meta meta.structure.dictionary.value string"
    }
  ],
  colors: {
    "editor.foreground": "#f8f8f2",
    "editor.background": "#282a36",
    "editor.selectionBackground": "#44475a",
    "editor.lineHighlightBackground": "#44475a",
    "editorCursor.foreground": "#f8f8f0",
    "editorWhitespace.foreground": "#3B3A32",
    "editorIndentGuide.activeBackground": "#9D550FB0",
    "editor.selectionHighlightBorder": "#222218"
  }
} 

const pgsqlKeywords = [
  {name: 'ABORT', value: 100000},
  {name: 'ABS', value: 100000},
  {name: 'ABSENT', value: 100000},
  {name: 'ABSOLUTE', value: 100000},
  {name: 'ACCESS', value: 100000},
  {name: 'ACCORDING', value: 100000},
  {name: 'ACOS', value: 100000},
  {name: 'ACTION', value: 100000},
  {name: 'ADA', value: 100000},
  {name: 'ADD', value: 100000},
  {name: 'ADMIN', value: 100000},
  {name: 'AFTER', value: 100000},
  {name: 'AGGREGATE', value: 100000},
  {name: 'ALL', value: 100000},
  {name: 'ALLOCATE', value: 100000},
  {name: 'ALSO', value: 100000},
  {name: 'ALTER', value: 100000},
  {name: 'ALWAYS', value: 100000},
  {name: 'ANALYSE', value: 100000},
  {name: 'ANALYZE', value: 100000},
  {name: 'AND', value: 4},
  {name: 'ANY', value: 100000},
  {name: 'ARE', value: 100000},
  {name: 'ARRAY', value: 100000},
  {name: 'ARRAY_AGG', value: 100000},
  {name: 'ARRAY_', value: 100000},
  {name: 'AS', value: 100000},
  {name: 'ASC', value: 100000},
  {name: 'ASENSITIVE', value: 100000},
  {name: 'ASIN', value: 100000},
  {name: 'ASSERTION', value: 100000},
  {name: 'ASSIGNMENT', value: 100000},
  {name: 'ASYMMETRIC', value: 100000},
  {name: 'AT', value: 100000},
  {name: 'ATAN', value: 100000},
  {name: 'ATOMIC', value: 100000},
  {name: 'ATTACH', value: 100000},
  {name: 'ATTRIBUTE', value: 100000},
  {name: 'ATTRIBUTES', value: 100000},
  {name: 'AUTHORIZATION', value: 100000},
  {name: 'AVG', value: 100000},
  {name: 'BACKWARD', value: 100000},
  {name: 'BASE64', value: 100000},
  {name: 'BEFORE', value: 100000},
  {name: 'BEGIN', value: 100000},
  {name: 'BEGIN_FRAME', value: 100000},
  {name: 'BEGIN_PARTITION', value: 100000},
  {name: 'BERNOULLI', value: 100000},
  {name: 'BETWEEN', value: 100000},
  {name: 'BIGINT', value: 100000},
  {name: 'BINARY', value: 100000},
  {name: 'BIT', value: 100000},
  {name: 'BIT_LENGTH', value: 100000},
  {name: 'BLOB', value: 100000},
  {name: 'BLOCKED', value: 100000},
  {name: 'BOM', value: 100000},
  {name: 'BOOLEAN', value: 100000},
  {name: 'BOTH', value: 100000},
  {name: 'BREADTH', value: 100000},
  {name: 'BY', value: 100000},
  {name: 'C', value: 100000},
  {name: 'CACHE', value: 100000},
  {name: 'CALL', value: 100000},
  {name: 'CALLED', value: 100000},
  {name: 'CARDINALITY', value: 100000},
  {name: 'CASCADE', value: 100000},
  {name: 'CASCADED', value: 100000},
  {name: 'CASE', value: 100000},
  {name: 'CAST', value: 100000},
  {name: 'CATALOG', value: 100000},
  {name: 'CATALOG_NAME', value: 100000},
  {name: 'CEIL', value: 100000},
  {name: 'CEILING', value: 100000},
  {name: 'CHAIN', value: 100000},
  {name: 'CHAINING', value: 100000},
  {name: 'CHAR', value: 100000},
  {name: 'CHARACTER', value: 100000},
  {name: 'CHARACTERISTICS', value: 100000},
  {name: 'CHARACTERS', value: 100000},
  {name: 'CHARACTER_LENGTH', value: 100000},
  {name: 'CHARACTER_', value: 100000},
  {name: 'CHARACTER_SET_NAME', value: 100000},
  {name: 'CHARACTER_SET_SCHEMA', value: 100000},
  {name: 'CHAR_LENGTH', value: 100000},
  {name: 'CHECK', value: 100000},
  {name: 'CHECKPOINT', value: 100000},
  {name: 'CLASS', value: 100000},
  {name: 'CLASSIFIER', value: 100000},
  {name: 'CLASS_ORIGIN', value: 100000},
  {name: 'CLOB', value: 100000},
  {name: 'CLOSE', value: 100000},
  {name: 'CLUSTER', value: 100000},
  {name: 'COALESCE', value: 100000},
  {name: 'COBOL', value: 100000},
  {name: 'COLLATE', value: 100000},
  {name: 'COLLATION', value: 100000},
  {name: 'COLLATION_CATALOG', value: 100000},
  {name: 'COLLATION_NAME', value: 100000},
  {name: 'COLLATION_SCHEMA', value: 100000},
  {name: 'COLLECT', value: 100000},
  {name: 'COLUMN', value: 100000},
  {name: 'COLUMNS', value: 100000},
  {name: 'COLUMN_NAME', value: 100000},
  {name: 'COMMAND_FUNCTION', value: 100000},
  {name: 'COMMAND_', value: 100000},
  {name: 'COMMENT', value: 100000},
  {name: 'COMMENTS', value: 100000},
  {name: 'COMMIT', value: 100000},
  {name: 'COMMITTED', value: 100000},
  {name: 'COMPRESSION', value: 100000},
  {name: 'CONCURRENTLY', value: 100000},
  {name: 'CONDITION', value: 100000},
  {name: 'CONDITIONAL', value: 100000},
  {name: 'CONDITION_NUMBER', value: 100000},
  {name: 'CONFIGURATION', value: 100000},
  {name: 'CONFLICT', value: 100000},
  {name: 'CONNECT', value: 100000},
  {name: 'CONNECTION', value: 100000},
  {name: 'CONNECTION_NAME', value: 100000},
  {name: 'CONSTRAINT', value: 100000},
  {name: 'CONSTRAINTS', value: 100000},
  {name: 'CONSTRAINT_CATALOG', value: 100000},
  {name: 'CONSTRAINT_NAME', value: 100000},
  {name: 'CONSTRAINT_SCHEMA', value: 100000},
  {name: 'CONSTRUCTOR', value: 100000},
  {name: 'CONTAINS', value: 100000},
  {name: 'CONTENT', value: 100000},
  {name: 'CONTINUE', value: 100000},
  {name: 'CONTROL', value: 100000},
  {name: 'CONVERSION', value: 100000},
  {name: 'CONVERT', value: 100000},
  {name: 'COPY', value: 100000},
  {name: 'CORR', value: 100000},
  {name: 'CORRESPONDING', value: 100000},
  {name: 'COS', value: 100000},
  {name: 'COSH', value: 100000},
  {name: 'COST', value: 100000},
  {name: 'COUNT', value: 100000},
  {name: 'COVAR_POP', value: 100000},
  {name: 'COVAR_SAMP', value: 100000},
  {name: 'CREATE', value: 100000},
  {name: 'CROSS', value: 100000},
  {name: 'CSV', value: 100000},
  {name: 'CUBE', value: 100000},
  {name: 'CUME_DIST', value: 100000},
  {name: 'CURRENT', value: 100000},
  {name: 'CURRENT_CATALOG', value: 100000},
  {name: 'CURRENT_DATE', value: 100000},
  {name: 'CURRENT_', value: 100000},
  {name: 'CURRENT_PATH', value: 100000},
  {name: 'CURRENT_ROLE', value: 100000},
  {name: 'CURRENT_ROW', value: 100000},
  {name: 'CURRENT_SCHEMA', value: 100000},
  {name: 'CURRENT_TIME', value: 100000},
  {name: 'CURRENT_TIMESTAMP', value: 100000},
  {name: 'CURRENT_', value: 100000},
  {name: 'CURRENT_USER', value: 100000},
  {name: 'CURSOR', value: 100000},
  {name: 'CURSOR_NAME', value: 100000},
  {name: 'CYCLE', value: 100000},
  {name: 'DATA', value: 100000},
  {name: 'DATABASE', value: 100000},
  {name: 'DATALINK', value: 100000},
  {name: 'DATE', value: 100000},
  {name: 'DATETIME_', value: 100000},
  {name: 'DATETIME_', value: 100000},
  {name: 'DAY', value: 100000},
  {name: 'DB', value: 100000},
  {name: 'DEALLOCATE', value: 100000},
  {name: 'DEC', value: 100000},
  {name: 'DECFLOAT', value: 100000},
  {name: 'DECIMAL', value: 100000},
  {name: 'DECLARE', value: 100000},
  {name: 'DEFAULT', value: 100000},
  {name: 'DEFAULTS', value: 100000},
  {name: 'DEFERRABLE', value: 100000},
  {name: 'DEFERRED', value: 100000},
  {name: 'DEFINE', value: 100000},
  {name: 'DEFINED', value: 100000},
  {name: 'DEFINER', value: 100000},
  {name: 'DEGREE', value: 100000},
  {name: 'DELETE', value: 100000},
  {name: 'DELIMITER', value: 100000},
  {name: 'DELIMITERS', value: 100000},
  {name: 'DENSE_RANK', value: 100000},
  {name: 'DEPENDS', value: 100000},
  {name: 'DEPTH', value: 100000},
  {name: 'DEREF', value: 100000},
  {name: 'DERIVED', value: 100000},
  {name: 'DESC', value: 100000},
  {name: 'DESCRIBE', value: 100000},
  {name: 'DESCRIPTOR', value: 100000},
  {name: 'DETACH', value: 100000},
  {name: 'DETERMINISTIC', value: 100000},
  {name: 'DIAGNOSTICS', value: 100000},
  {name: 'DICTIONARY', value: 100000},
  {name: 'DISABLE', value: 100000},
  {name: 'DISCARD', value: 100000},
  {name: 'DISCONNECT', value: 100000},
  {name: 'DISPATCH', value: 100000},
  {name: 'DISTINCT', value: 100000},
  {name: 'DLNEWCOPY', value: 100000},
  {name: 'DLPREVIOUSCOPY', value: 100000},
  {name: 'DLURLCOMPLETE', value: 100000},
  {name: 'DLURLCOMPLETEONLY', value: 100000},
  {name: 'DLURLCOMPLETEWRITE', value: 100000},
  {name: 'DLURLPATH', value: 100000},
  {name: 'DLURLPATHONLY', value: 100000},
  {name: 'DLURLPATHWRITE', value: 100000},
  {name: 'DLURLSCHEME', value: 100000},
  {name: 'DLURLSERVER', value: 100000},
  {name: 'DLVALUE', value: 100000},
  {name: 'DO', value: 100000},
  {name: 'DOCUMENT', value: 100000},
  {name: 'DOMAIN', value: 100000},
  {name: 'DOUBLE', value: 100000},
  {name: 'DROP', value: 100000},
  {name: 'DYNAMIC', value: 100000},
  {name: 'DYNAMIC_FUNCTION', value: 100000},
  {name: 'DYNAMIC_', value: 100000},
  {name: 'EACH', value: 100000},
  {name: 'ELEMENT', value: 100000},
  {name: 'ELSE', value: 100000},
  {name: 'EMPTY', value: 100000},
  {name: 'ENABLE', value: 100000},
  {name: 'ENCODING', value: 100000},
  {name: 'ENCRYPTED', value: 100000},
  {name: 'END', value: 100000},
  {name: 'END', value: 100000},
  {name: 'END_FRAME', value: 100000},
  {name: 'END_PARTITION', value: 100000},
  {name: 'ENFORCED', value: 100000},
  {name: 'ENUM', value: 100000},
  {name: 'EQUALS', value: 100000},
  {name: 'ERROR', value: 100000},
  {name: 'ESCAPE', value: 100000},
  {name: 'EVENT', value: 100000},
  {name: 'EVERY', value: 100000},
  {name: 'EXCEPT', value: 100000},
  {name: 'EXCEPTION', value: 100000},
  {name: 'EXCLUDE', value: 100000},
  {name: 'EXCLUDING', value: 100000},
  {name: 'EXCLUSIVE', value: 100000},
  {name: 'EXEC', value: 100000},
  {name: 'EXECUTE', value: 100000},
  {name: 'EXISTS', value: 100000},
  {name: 'EXP', value: 100000},
  {name: 'EXPLAIN', value: 100000},
  {name: 'EXPRESSION', value: 100000},
  {name: 'EXTENSION', value: 100000},
  {name: 'EXTERNAL', value: 100000},
  {name: 'EXTRACT', value: 100000},
  {name: 'FALSE', value: 100000},
  {name: 'FAMILY', value: 100000},
  {name: 'FETCH', value: 100000},
  {name: 'FILE', value: 100000},
  {name: 'FILTER', value: 100000},
  {name: 'FINAL', value: 100000},
  {name: 'FINALIZE', value: 100000},
  {name: 'FINISH', value: 100000},
  {name: 'FIRST', value: 100000},
  {name: 'FIRST_VALUE', value: 100000},
  {name: 'FLAG', value: 100000},
  {name: 'FLOAT', value: 100000},
  {name: 'FLOOR', value: 100000},
  {name: 'FOLLOWING', value: 100000},
  {name: 'FOR', value: 100000},
  {name: 'FORCE', value: 100000},
  {name: 'FOREIGN', value: 100000},
  {name: 'FORMAT', value: 100000},
  {name: 'FORTRAN', value: 100000},
  {name: 'FORWARD', value: 100000},
  {name: 'FOUND', value: 100000},
  {name: 'FRAME_ROW', value: 100000},
  {name: 'FREE', value: 100000},
  {name: 'FREEZE', value: 100000},
  {name: 'FROM', value: 2},
  {name: 'FS', value: 100000},
  {name: 'FULFILL', value: 100000},
  {name: 'FULL', value: 100000},
  {name: 'FUNCTION', value: 100000},
  {name: 'FUNCTIONS', value: 100000},
  {name: 'FUSION', value: 100000},
  {name: 'G', value: 100000},
  {name: 'GENERAL', value: 100000},
  {name: 'GENERATED', value: 100000},
  {name: 'GET', value: 100000},
  {name: 'GLOBAL', value: 100000},
  {name: 'GO', value: 100000},
  {name: 'GOTO', value: 100000},
  {name: 'GRANT', value: 100000},
  {name: 'GRANTED', value: 100000},
  {name: 'GREATEST', value: 100000},
  {name: 'GROUP', value: 100000},
  {name: 'GROUPING', value: 100000},
  {name: 'GROUPS', value: 100000},
  {name: 'HANDLER', value: 100000},
  {name: 'HAVING', value: 7},
  {name: 'HEADER', value: 100000},
  {name: 'HEX', value: 100000},
  {name: 'HIERARCHY', value: 100000},
  {name: 'HOLD', value: 100000},
  {name: 'HOUR', value: 100000},
  {name: 'ID', value: 100000},
  {name: 'IDENTITY', value: 100000},
  {name: 'IF', value: 100000},
  {name: 'IGNORE', value: 100000},
  {name: 'ILIKE', value: 100000},
  {name: 'IMMEDIATE', value: 100000},
  {name: 'IMMEDIATELY', value: 100000},
  {name: 'IMMUTABLE', value: 100000},
  {name: 'IMPLEMENTATION', value: 100000},
  {name: 'IMPLICIT', value: 100000},
  {name: 'IMPORT', value: 100000},
  {name: 'IN', value: 100000},
  {name: 'INCLUDE', value: 100000},
  {name: 'INCLUDING', value: 100000},
  {name: 'INCREMENT', value: 100000},
  {name: 'INDENT', value: 100000},
  {name: 'INDEX', value: 100000},
  {name: 'INDEXES', value: 100000},
  {name: 'INDICATOR', value: 100000},
  {name: 'INHERIT', value: 100000},
  {name: 'INHERITS', value: 100000},
  {name: 'INITIAL', value: 100000},
  {name: 'INITIALLY', value: 100000},
  {name: 'INLINE', value: 100000},
  {name: 'INNER', value: 100000},
  {name: 'INOUT', value: 100000},
  {name: 'INPUT', value: 100000},
  {name: 'INSENSITIVE', value: 100000},
  {name: 'INSERT', value: 100000},
  {name: 'INSTANCE', value: 100000},
  {name: 'INSTANTIABLE', value: 100000},
  {name: 'INSTEAD', value: 100000},
  {name: 'INT', value: 100000},
  {name: 'INTEGER', value: 100000},
  {name: 'INTEGRITY', value: 100000},
  {name: 'INTERSECT', value: 100000},
  {name: 'INTERSECTION', value: 100000},
  {name: 'INTERVAL', value: 100000},
  {name: 'INTO', value: 100000},
  {name: 'INVOKER', value: 100000},
  {name: 'IS', value: 100000},
  {name: 'ISNULL', value: 100000},
  {name: 'ISOLATION', value: 100000},
  {name: 'JOIN', value: 8},
  {name: 'JSON_ARRAY', value: 100000},
  {name: 'JSON_ARRAYAGG', value: 100000},
  {name: 'JSON_EXISTS', value: 100000},
  {name: 'JSON_OBJECT', value: 100000},
  {name: 'JSON_OBJECTAGG', value: 100000},
  {name: 'JSON_QUERY', value: 100000},
  {name: 'JSON_TABLE', value: 100000},
  {name: 'JSON_TABLE_PRIMITIVE', value: 100000},
  {name: 'JSON_VALUE', value: 100000},
  {name: 'K', value: 100000},
  {name: 'KEEP', value: 100000},
  {name: 'KEY', value: 100000},
  {name: 'KEYS', value: 100000},
  {name: 'KEY_MEMBER', value: 100000},
  {name: 'KEY_TYPE', value: 100000},
  {name: 'LABEL', value: 100000},
  {name: 'LAG', value: 100000},
  {name: 'LANGUAGE', value: 100000},
  {name: 'LARGE', value: 100000},
  {name: 'LAST', value: 100000},
  {name: 'LAST_VALUE', value: 100000},
  {name: 'LATERAL', value: 100000},
  {name: 'LEAD', value: 100000},
  {name: 'LEADING', value: 100000},
  {name: 'LEAKPROOF', value: 100000},
  {name: 'LEAST', value: 100000},
  {name: 'LEFT', value: 9},
  {name: 'LENGTH', value: 100000},
  {name: 'LEVEL', value: 100000},
  {name: 'LIBRARY', value: 100000},
  {name: 'LIKE', value: 100000},
  {name: 'LIKE_REGEX', value: 100000},
  {name: 'LIMIT', value: 100000},
  {name: 'LINK', value: 100000},
  {name: 'LISTAGG', value: 100000},
  {name: 'LISTEN', value: 100000},
  {name: 'LN', value: 100000},
  {name: 'LOAD', value: 100000},
  {name: 'LOCAL', value: 100000},
  {name: 'LOCALTIME', value: 100000},
  {name: 'LOCALTIMESTAMP', value: 100000},
  {name: 'LOCATION', value: 100000},
  {name: 'LOCATOR', value: 100000},
  {name: 'LOCK', value: 100000},
  {name: 'LOCKED', value: 100000},
  {name: 'LOG', value: 100000},
  {name: 'LOG10', value: 100000},
  {name: 'LOGGED', value: 100000},
  {name: 'LOWER', value: 100000},
  {name: 'M', value: 100000},
  {name: 'MAP', value: 100000},
  {name: 'MAPPING', value: 100000},
  {name: 'MATCH', value: 100000},
  {name: 'MATCHED', value: 100000},
  {name: 'MATCHES', value: 100000},
  {name: 'MATCH_NUMBER', value: 100000},
  {name: 'MATCH_RECOGNIZE', value: 100000},
  {name: 'MATERIALIZED', value: 100000},
  {name: 'MAX', value: 100000},
  {name: 'MAXVALUE', value: 100000},
  {name: 'MEASURES', value: 100000},
  {name: 'MEMBER', value: 100000},
  {name: 'MERGE', value: 100000},
  {name: 'MESSAGE_LENGTH', value: 100000},
  {name: 'MESSAGE_OCTET_LENGTH', value: 100000},
  {name: 'MESSAGE_TEXT', value: 100000},
  {name: 'METHOD', value: 100000},
  {name: 'MIN', value: 100000},
  {name: 'MINUTE', value: 100000},
  {name: 'MINVALUE', value: 100000},
  {name: 'MOD', value: 100000},
  {name: 'MODE', value: 100000},
  {name: 'MODIFIES', value: 100000},
  {name: 'MODULE', value: 100000},
  {name: 'MONTH', value: 100000},
  {name: 'MORE', value: 100000},
  {name: 'MOVE', value: 100000},
  {name: 'MULTISET', value: 100000},
  {name: 'MUMPS', value: 100000},
  {name: 'NAME', value: 100000},
  {name: 'NAMES', value: 100000},
  {name: 'NAMESPACE', value: 100000},
  {name: 'NATIONAL', value: 100000},
  {name: 'NATURAL', value: 100000},
  {name: 'NCHAR', value: 100000},
  {name: 'NCLOB', value: 100000},
  {name: 'NESTED', value: 100000},
  {name: 'NESTING', value: 100000},
  {name: 'NEW', value: 100000},
  {name: 'NEXT', value: 100000},
  {name: 'NFC', value: 100000},
  {name: 'NFD', value: 100000},
  {name: 'NFKC', value: 100000},
  {name: 'NFKD', value: 100000},
  {name: 'NIL', value: 100000},
  {name: 'NO', value: 100000},
  {name: 'NONE', value: 100000},
  {name: 'NORMALIZE', value: 100000},
  {name: 'NORMALIZED', value: 100000},
  {name: 'NOT', value: 5},
  {name: 'NOTHING', value: 100000},
  {name: 'NOTIFY', value: 100000},
  {name: 'NOTNULL', value: 100000},
  {name: 'NOWAIT', value: 100000},
  {name: 'NTH_VALUE', value: 100000},
  {name: 'NTILE', value: 100000},
  {name: 'NULL', value: 100000},
  {name: 'NULLABLE', value: 100000},
  {name: 'NULLIF', value: 100000},
  {name: 'NULLS', value: 100000},
  {name: 'NULL_ORDERING', value: 100000},
  {name: 'NUMBER', value: 100000},
  {name: 'NUMERIC', value: 100000},
  {name: 'OBJECT', value: 100000},
  {name: 'OCCURRENCE', value: 100000},
  {name: 'OCCURRENCES_REGEX', value: 100000},
  {name: 'OCTETS', value: 100000},
  {name: 'OCTET_LENGTH', value: 100000},
  {name: 'OF', value: 100000},
  {name: 'OFF', value: 100000},
  {name: 'OFFSET', value: 100000},
  {name: 'OIDS', value: 100000},
  {name: 'OLD', value: 100000},
  {name: 'OMIT', value: 100000},
  {name: 'ON', value: 100000},
  {name: 'ONE', value: 100000},
  {name: 'ONLY', value: 100000},
  {name: 'OPEN', value: 100000},
  {name: 'OPERATOR', value: 100000},
  {name: 'OPTION', value: 100000},
  {name: 'OPTIONS', value: 100000},
  {name: 'OR', value: 6},
  {name: 'ORDER', value: 100000},
  {name: 'ORDERING', value: 100000},
  {name: 'ORDINALITY', value: 100000},
  {name: 'OTHERS', value: 100000},
  {name: 'OUT', value: 100000},
  {name: 'OUTER', value: 100000},
  {name: 'OUTPUT', value: 100000},
  {name: 'OVER', value: 100000},
  {name: 'OVERFLOW', value: 100000},
  {name: 'OVERLAPS', value: 100000},
  {name: 'OVERLAY', value: 100000},
  {name: 'OVERRIDING', value: 100000},
  {name: 'OWNED', value: 100000},
  {name: 'OWNER', value: 100000},
  {name: 'P', value: 100000},
  {name: 'PAD', value: 100000},
  {name: 'PARALLEL', value: 100000},
  {name: 'PARAMETER', value: 100000},
  {name: 'PARAMETER_MODE', value: 100000},
  {name: 'PARAMETER_NAME', value: 100000},
  {name: 'PARAMETER_', value: 100000},
  {name: 'PARAMETER_', value: 100000},
  {name: 'PARAMETER_', value: 100000},
  {name: 'PARAMETER_', value: 100000},
  {name: 'PARSER', value: 100000},
  {name: 'PARTIAL', value: 100000},
  {name: 'PARTITION', value: 100000},
  {name: 'PASCAL', value: 100000},
  {name: 'PASS', value: 100000},
  {name: 'PASSING', value: 100000},
  {name: 'PASSTHROUGH', value: 100000},
  {name: 'PASSWORD', value: 100000},
  {name: 'PAST', value: 100000},
  {name: 'PATH', value: 100000},
  {name: 'PATTERN', value: 100000},
  {name: 'PER', value: 100000},
  {name: 'PERCENT', value: 100000},
  {name: 'PERCENTILE_CONT', value: 100000},
  {name: 'PERCENTILE_DISC', value: 100000},
  {name: 'PERCENT_RANK', value: 100000},
  {name: 'PERIOD', value: 100000},
  {name: 'PERMISSION', value: 100000},
  {name: 'PERMUTE', value: 100000},
  {name: 'PIPE', value: 100000},
  {name: 'PLACING', value: 100000},
  {name: 'PLAN', value: 100000},
  {name: 'PLANS', value: 100000},
  {name: 'PLI', value: 100000},
  {name: 'POLICY', value: 100000},
  {name: 'PORTION', value: 100000},
  {name: 'POSITION', value: 100000},
  {name: 'POSITION_REGEX', value: 100000},
  {name: 'POWER', value: 100000},
  {name: 'PRECEDES', value: 100000},
  {name: 'PRECEDING', value: 100000},
  {name: 'PRECISION', value: 100000},
  {name: 'PREPARE', value: 100000},
  {name: 'PREPARED', value: 100000},
  {name: 'PRESERVE', value: 100000},
  {name: 'PREV', value: 100000},
  {name: 'PRIMARY', value: 100000},
  {name: 'PRIOR', value: 100000},
  {name: 'PRIVATE', value: 100000},
  {name: 'PRIVILEGES', value: 100000},
  {name: 'PROCEDURAL', value: 100000},
  {name: 'PROCEDURE', value: 100000},
  {name: 'PROCEDURES', value: 100000},
  {name: 'PROGRAM', value: 100000},
  {name: 'PRUNE', value: 100000},
  {name: 'PTF', value: 100000},
  {name: 'PUBLIC', value: 100000},
  {name: 'PUBLICATION', value: 100000},
  {name: 'QUOTE', value: 100000},
  {name: 'QUOTES', value: 100000},
  {name: 'RANGE', value: 100000},
  {name: 'RANK', value: 100000},
  {name: 'READ', value: 100000},
  {name: 'READS', value: 100000},
  {name: 'REAL', value: 100000},
  {name: 'REASSIGN', value: 100000},
  {name: 'RECHECK', value: 100000},
  {name: 'RECOVERY', value: 100000},
  {name: 'RECURSIVE', value: 100000},
  {name: 'REF', value: 100000},
  {name: 'REFERENCES', value: 100000},
  {name: 'REFERENCING', value: 100000},
  {name: 'REFRESH', value: 100000},
  {name: 'REGR_AVGX', value: 100000},
  {name: 'REGR_AVGY', value: 100000},
  {name: 'REGR_COUNT', value: 100000},
  {name: 'REGR_INTERCEPT', value: 100000},
  {name: 'REGR_R2', value: 100000},
  {name: 'REGR_SLOPE', value: 100000},
  {name: 'REGR_SXX', value: 100000},
  {name: 'REGR_SXY', value: 100000},
  {name: 'REGR_SYY', value: 100000},
  {name: 'REINDEX', value: 100000},
  {name: 'RELATIVE', value: 100000},
  {name: 'RELEASE', value: 100000},
  {name: 'RENAME', value: 100000},
  {name: 'REPEATABLE', value: 100000},
  {name: 'REPLACE', value: 100000},
  {name: 'REPLICA', value: 100000},
  {name: 'REQUIRING', value: 100000},
  {name: 'RESET', value: 100000},
  {name: 'RESPECT', value: 100000},
  {name: 'RESTART', value: 100000},
  {name: 'RESTORE', value: 100000},
  {name: 'RESTRICT', value: 100000},
  {name: 'RESULT', value: 100000},
  {name: 'RETURN', value: 100000},
  {name: 'RETURNED_CARDINALITY', value: 100000},
  {name: 'RETURNED_LENGTH', value: 100000},
  {name: 'RETURNED_', value: 100000},
  {name: 'RETURNED_SQLSTATE', value: 100000},
  {name: 'RETURNING', value: 100000},
  {name: 'RETURNS', value: 100000},
  {name: 'REVOKE', value: 100000},
  {name: 'RIGHT', value: 10},
  {name: 'ROLE', value: 100000},
  {name: 'ROLLBACK', value: 100000},
  {name: 'ROLLUP', value: 100000},
  {name: 'ROUTINE', value: 100000},
  {name: 'ROUTINES', value: 100000},
  {name: 'ROUTINE_CATALOG', value: 100000},
  {name: 'ROUTINE_NAME', value: 100000},
  {name: 'ROUTINE_SCHEMA', value: 100000},
  {name: 'ROW', value: 100000},
  {name: 'ROWS', value: 100000},
  {name: 'ROW_COUNT', value: 100000},
  {name: 'ROW_NUMBER', value: 100000},
  {name: 'RULE', value: 100000},
  {name: 'RUNNING', value: 100000},
  {name: 'SAVEPOINT', value: 100000},
  {name: 'SCALAR', value: 100000},
  {name: 'SCALE', value: 100000},
  {name: 'SCHEMA', value: 100000},
  {name: 'SCHEMAS', value: 100000},
  {name: 'SCHEMA_NAME', value: 100000},
  {name: 'SCOPE', value: 100000},
  {name: 'SCOPE_CATALOG', value: 100000},
  {name: 'SCOPE_NAME', value: 100000},
  {name: 'SCOPE_SCHEMA', value: 100000},
  {name: 'SCROLL', value: 100000},
  {name: 'SEARCH', value: 100000},
  {name: 'SECOND', value: 100000},
  {name: 'SECTION', value: 100000},
  {name: 'SECURITY', value: 100000},
  {name: 'SEEK', value: 100000},
  {name: 'SELECT', value: 1},
  {name: 'SELECTIVE', value: 100000},
  {name: 'SELF', value: 100000},
  {name: 'SEMANTICS', value: 100000},
  {name: 'SENSITIVE', value: 100000},
  {name: 'SEQUENCE', value: 100000},
  {name: 'SEQUENCES', value: 100000},
  {name: 'SERIALIZABLE', value: 100000},
  {name: 'SERVER', value: 100000},
  {name: 'SERVER_NAME', value: 100000},
  {name: 'SESSION', value: 100000},
  {name: 'SESSION_USER', value: 100000},
  {name: 'SET', value: 100000},
  {name: 'SETOF', value: 100000},
  {name: 'SETS', value: 100000},
  {name: 'SHARE', value: 100000},
  {name: 'SHOW', value: 100000},
  {name: 'SIMILAR', value: 100000},
  {name: 'SIMPLE', value: 100000},
  {name: 'SIN', value: 100000},
  {name: 'SINH', value: 100000},
  {name: 'SIZE', value: 100000},
  {name: 'SKIP', value: 100000},
  {name: 'SMALLINT', value: 100000},
  {name: 'SNAPSHOT', value: 100000},
  {name: 'SOME', value: 100000},
  {name: 'SORT_DIRECTION', value: 100000},
  {name: 'SOURCE', value: 100000},
  {name: 'SPACE', value: 100000},
  {name: 'SPECIFIC', value: 100000},
  {name: 'SPECIFICTYPE', value: 100000},
  {name: 'SPECIFIC_NAME', value: 100000},
  {name: 'SQL', value: 100000},
  {name: 'SQLCODE', value: 100000},
  {name: 'SQLERROR', value: 100000},
  {name: 'SQLEXCEPTION', value: 100000},
  {name: 'SQLSTATE', value: 100000},
  {name: 'SQLWARNING', value: 100000},
  {name: 'SQRT', value: 100000},
  {name: 'STABLE', value: 100000},
  {name: 'STANDALONE', value: 100000},
  {name: 'START', value: 100000},
  {name: 'STATE', value: 100000},
  {name: 'STATEMENT', value: 100000},
  {name: 'STATIC', value: 100000},
  {name: 'STATISTICS', value: 100000},
  {name: 'STDDEV_POP', value: 100000},
  {name: 'STDDEV_SAMP', value: 100000},
  {name: 'STDIN', value: 100000},
  {name: 'STDOUT', value: 100000},
  {name: 'STORAGE', value: 100000},
  {name: 'STORED', value: 100000},
  {name: 'STRICT', value: 100000},
  {name: 'STRING', value: 100000},
  {name: 'STRIP', value: 100000},
  {name: 'STRUCTURE', value: 100000},
  {name: 'STYLE', value: 100000},
  {name: 'SUBCLASS_ORIGIN', value: 100000},
  {name: 'SUBMULTISET', value: 100000},
  {name: 'SUBSCRIPTION', value: 100000},
  {name: 'SUBSET', value: 100000},
  {name: 'SUBSTRING', value: 100000},
  {name: 'SUBSTRING_REGEX', value: 100000},
  {name: 'SUCCEEDS', value: 100000},
  {name: 'SUM', value: 100000},
  {name: 'SUPPORT', value: 100000},
  {name: 'SYMMETRIC', value: 100000},
  {name: 'SYSID', value: 100000},
  {name: 'SYSTEM', value: 100000},
  {name: 'SYSTEM_TIME', value: 100000},
  {name: 'SYSTEM_USER', value: 100000},
  {name: 'T', value: 100000},
  {name: 'TABLE', value: 100000},
  {name: 'TABLES', value: 100000},
  {name: 'TABLESAMPLE', value: 100000},
  {name: 'TABLESPACE', value: 100000},
  {name: 'TABLE_NAME', value: 100000},
  {name: 'TAN', value: 100000},
  {name: 'TANH', value: 100000},
  {name: 'TEMP', value: 100000},
  {name: 'TEMPLATE', value: 100000},
  {name: 'TEMPORARY', value: 100000},
  {name: 'TEXT', value: 100000},
  {name: 'THEN', value: 100000},
  {name: 'THROUGH', value: 100000},
  {name: 'TIES', value: 100000},
  {name: 'TIME', value: 100000},
  {name: 'TIMESTAMP', value: 100000},
  {name: 'TIMEZONE_HOUR', value: 100000},
  {name: 'TIMEZONE_MINUTE', value: 100000},
  {name: 'TO', value: 100000},
  {name: 'TOKEN', value: 100000},
  {name: 'TOP_LEVEL_COUNT', value: 100000},
  {name: 'TRAILING', value: 100000},
  {name: 'TRANSACTION', value: 100000},
  {name: 'TRANSACTIONS_', value: 100000},
  {name: 'TRANSACTIONS_', value: 100000},
  {name: 'TRANSACTION_ACTIVE', value: 100000},
  {name: 'TRANSFORM', value: 100000},
  {name: 'TRANSFORMS', value: 100000},
  {name: 'TRANSLATE', value: 100000},
  {name: 'TRANSLATE_REGEX', value: 100000},
  {name: 'TRANSLATION', value: 100000},
  {name: 'TREAT', value: 100000},
  {name: 'TRIGGER', value: 100000},
  {name: 'TRIGGER_CATALOG', value: 100000},
  {name: 'TRIGGER_NAME', value: 100000},
  {name: 'TRIGGER_SCHEMA', value: 100000},
  {name: 'TRIM', value: 100000},
  {name: 'TRIM_ARRAY', value: 100000},
  {name: 'TRUE', value: 100000},
  {name: 'TRUNCATE', value: 100000},
  {name: 'TRUSTED', value: 100000},
  {name: 'TYPE', value: 100000},
  {name: 'TYPES', value: 100000},
  {name: 'UESCAPE', value: 100000},
  {name: 'UNBOUNDED', value: 100000},
  {name: 'UNCOMMITTED', value: 100000},
  {name: 'UNCONDITIONAL', value: 100000},
  {name: 'UNDER', value: 100000},
  {name: 'UNENCRYPTED', value: 100000},
  {name: 'UNION', value: 100000},
  {name: 'UNIQUE', value: 100000},
  {name: 'UNKNOWN', value: 100000},
  {name: 'UNLINK', value: 100000},
  {name: 'UNLISTEN', value: 100000},
  {name: 'UNLOGGED', value: 100000},
  {name: 'UNMATCHED', value: 100000},
  {name: 'UNNAMED', value: 100000},
  {name: 'UNNEST', value: 100000},
  {name: 'UNTIL', value: 100000},
  {name: 'UNTYPED', value: 100000},
  {name: 'UPDATE', value: 100000},
  {name: 'UPPER', value: 100000},
  {name: 'URI', value: 100000},
  {name: 'USAGE', value: 100000},
  {name: 'USER', value: 100000},
  {name: 'USER_', value: 100000},
  {name: 'USER_', value: 100000},
  {name: 'USER_', value: 100000},
  {name: 'USER_', value: 100000},
  {name: 'USING', value: 100000},
  {name: 'UTF16', value: 100000},
  {name: 'UTF32', value: 100000},
  {name: 'UTF8', value: 100000},
  {name: 'VACUUM', value: 100000},
  {name: 'VALID', value: 100000},
  {name: 'VALIDATE', value: 100000},
  {name: 'VALIDATOR', value: 100000},
  {name: 'VALUE', value: 100000},
  {name: 'VALUES', value: 100000},
  {name: 'VALUE_OF', value: 100000},
  {name: 'VARBINARY', value: 100000},
  {name: 'VARCHAR', value: 100000},
  {name: 'VARIADIC', value: 100000},
  {name: 'VARYING', value: 100000},
  {name: 'VAR_POP', value: 100000},
  {name: 'VAR_SAMP', value: 100000},
  {name: 'VERBOSE', value: 100000},
  {name: 'VERSION', value: 100000},
  {name: 'VERSIONING', value: 100000},
  {name: 'VIEW', value: 100000},
  {name: 'VIEWS', value: 100000},
  {name: 'VOLATILE', value: 100000},
  {name: 'WHEN', value: 100000},
  {name: 'WHENEVER', value: 100000},
  {name: 'WHERE', value: 3},
  {name: 'WHITESPACE', value: 100000},
  {name: 'WIDTH_BUCKET', value: 100000},
  {name: 'WINDOW', value: 100000},
  {name: 'WITH', value: 100000},
  {name: 'WITHIN', value: 100000},
  {name: 'WITHOUT', value: 100000},
  {name: 'WORK', value: 100000},
  {name: 'WRAPPER', value: 100000},
  {name: 'WRITE', value: 100000},
  {name: 'XML', value: 100000},
  {name: 'XMLAGG', value: 100000},
  {name: 'XMLATTRIBUTES', value: 100000},
  {name: 'XMLBINARY', value: 100000},
  {name: 'XMLCAST', value: 100000},
  {name: 'XMLCOMMENT', value: 100000},
  {name: 'XMLCONCAT', value: 100000},
  {name: 'XMLDECLARATION', value: 100000},
  {name: 'XMLDOCUMENT', value: 100000},
  {name: 'XMLELEMENT', value: 100000},
  {name: 'XMLEXISTS', value: 100000},
  {name: 'XMLFOREST', value: 100000},
  {name: 'XMLITERATE', value: 100000},
  {name: 'XMLNAMESPACES', value: 100000},
  {name: 'XMLPARSE', value: 100000},
  {name: 'XMLPI', value: 100000},
  {name: 'XMLQUERY', value: 100000},
  {name: 'XMLROOT', value: 100000},
  {name: 'XMLSCHEMA', value: 100000},
  {name: 'XMLSERIALIZE', value: 100000},
  {name: 'XMLTABLE', value: 100000},
  {name: 'XMLTEXT', value: 100000},
  {name: 'XMLVALIDATE', value: 100000},
  {name: 'YEAR', value: 100000},
  {name: 'YES', value: 100000},
  {name: 'ZON', value: 100000}
]

import MonacoEditor from 'monaco-editor-vue3'
import {shallowRef} from 'vue'
import isEqual from 'lodash/isEqual'
import { formatDialect, postgresql } from 'sql-formatter';
import debounce from 'lodash/debounce'
import {KeyCode} from 'monaco-editor'
import {autocomplete} from 'src/apis/autoComplete'

export default {
  name: 'AGSQLEditor',
  components: {
    MonacoEditor
  },

  props: ['tableList', 'pasteAtCursor', 'code', 'databaseID'],

  watch: {
    tableList: {
      deep: true, 
      handler(){
        this.setCompletion(this.monaco)
      }
    },
    pasteAtCursor(){
      if (this.pasteAtCursor){
        this.applyPasteAtCursor()
        this.$emit('update:pasteAtCursor', null)
      }
    },
    codeLocal(oldv, newv){
      if (!isEqual(oldv, newv)){
        this.$emit('update:code', this.codeLocal)
        debounce(() => this.setDynamicCompletion(this.monaco), 300)()
      } 
    },

    code(oldv, newv){
      if (!isEqual(oldv, newv)){
        this.codeLocal = this.code
      }
    }
  },

  data() {

    return {
      codeLocal: this.code || '/* select * from table limit 10 */',
      editorInstance: null,
      monaco: null,
      completionProvider : null,
      dynamicCompletionProvider: null,
    }
  },

  unmounted(){
        this.dynamicCompletionProvider?.dispose()
        this.completionProvider?.dispose()
  },

  methods: {
    updateColumnsForCompletion(){
      if (!this.codeLocal){
        return 
      } 


    },
    applyPasteAtCursor(){
      this.editorInstance.focus()
      this.editorInstance.trigger('keyboard', 'type', {text: this.pasteAtCursor});
    },

    setKeywordsHighlighting(monaco){
      monaco.languages.setMonarchTokensProvider('sql', {
        pgsqlKeywords, 
        tokenizer: {
          root: [ 
            [ /@?[a-zA-Z][\w$]*/, {
              cases: {
                '@pgsqlKeywords': 'keyword',
                '@default': 'variable'
              }
            } ],
            [/'.*?'/, 'value'],
            [/".*?"/, 'string'],
            [/\/\*.*\*\//, 'comment'],
          ]

        }
      })
      return monaco
    },

    setDynamicCompletion(monaco){
      if (this.dynamicCompletionProvider){
        this.dynamicCompletionProvider.dispose()
      }
      this.dynamicCompletionProvider =  monaco.languages.registerCompletionItemProvider('sql', 
        {
          provideCompletionItems : (model, position) =>  {
            return new Promise((resolve, reject) => {
              const  prefix = model.getWordUntilPosition(position)
              autocomplete(this.codeLocal, prefix.word, this.databaseID, (response)=> {
                resolve({suggestions: response && response.map(v => {
                  return {
                    label: v.value,
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: v.value,
                    sortText: v.score.toString()
                  }
                }) || []})
              })        
            })
          }
        })
    },

    setCompletion(monaco){
      if (this.completionProvider) {
        this.completionProvider.dispose()
      }
      this.completionProvider =  monaco.languages.registerCompletionItemProvider('sql', 
        {
          provideCompletionItems : (_model, position) =>  {
            let suggestions = [
              ...pgsqlKeywords.map(k => {
                return {
                  label: k.name, 
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: k.name, 
                  sortText: (k.value < 20 ? k.value : k.name.length).toString()
                }
              }),
              // ...this.tableList.map(t => {
              //   return {
              //     label: t.name, 
              //     kind: monaco.languages.CompletionItemKind.Class,
              //     insertText: t.name,
              //     sortText: t.name.length.toString(),
              //   }
              // }),
              ...this.tableList.map(t => {
                return {
                  label: "sn:" + t.name, 
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: "select * from " + t.name + " limit 10",
                  sortText: t.name.length.toString(),
                }
              })
            ]
            return {suggestions: suggestions}
          }
        }
      )
      return monaco
    },

    setFormatter(){
      this.monaco.languages.registerDocumentFormattingEditProvider("sql", {
        provideDocumentFormattingEdits(model) {
          let content = model.getValue()
          const matches = content.match(/{{\W*.+?\W*}}/g)
          console.log(matches)

          matches?.forEach(m => {
            content = content.replaceAll(m, `/* ${m} */`)
          })

          const matchEEX = content.match(/<%={0,1}.+%>/gm)

          matchEEX?.forEach(m => {
            content = content.replaceAll(m, `/* ${m} */`)
          })

          var formatted = formatDialect(content, {dialect: postgresql, keywordCase: 'upper'})
          matches?.forEach(m => {
            formatted = formatted.replaceAll(`/* ${m} */`, m)
          })

          matchEEX?.forEach(m => {
            formatted = formatted.replaceAll(`/* ${m} */`, m)
          })
          return [
            {
              range: model.getFullModelRange(),
              text: formatted,
            },
          ];
        }
      });
    },

    async sqlfmt(code){
      return
    },

    editorWillMount(monaco){
      this.monaco = shallowRef(monaco)
      this.setupMonaco()
    },

    editorDidMount(editor){
      this.editorInstance = shallowRef(editor)
      this.setKeybindings()
    },
    setKeybindings(){
      this.editorInstance.addCommand(KeyCode.F1, ()=> { "pass" }, null)
      this.editorInstance.addCommand(this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KeyP, ()=> { 
        this.editorInstance.trigger('', 'editor.action.quickCommand', null)
      }, null)

      this.editorInstance.addCommand(this.monaco.KeyMod.CtrlCmd | this.monaco.KeyMod.Shift | this.monaco.KeyCode.Enter, ()=> { 
        const selected = this.editorInstance.getModel().getValueInRange(this.editorInstance.getSelection())
        console.log('selected', selected)
        this.$emit('runSelectedQuery', selected)
      }, null)
      this.editorInstance.addCommand(this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.Enter, ()=> { 
        this.$emit('runQuery')
      }, null)
    },
    setupMonaco(){
      let monaco = this.monaco
      if (monaco){
        monaco.editor.defineTheme('AGDraculaTheme', theme)
        // monaco = this.setKeywordsHighlighting(monaco)
        monaco = this.setCompletion(monaco)
        this.setFormatter()

      }
    }
  }
}
</script>
