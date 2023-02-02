<template>
  <div class="tw-h-full" ref="code-wrapper">
    <MonacoEditor theme="vs-dark" v-model:value="codeLocal" language="sql" @editorWillMount="editorWillMount" @editorDidMount="editorDidMount" />
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

const pgsqlKeywords = [
  'ABORT','ABS','ABSENT','ABSOLUTE','ACCESS','ACCORDING','ACOS','ACTION','ADA','ADD','ADMIN','AFTER','AGGREGATE','ALL','ALLOCATE','ALSO','ALTER','ALWAYS','ANALYSE','ANALYZE','AND','ANY','ARE','ARRAY','ARRAY_AGG','ARRAY_','AS','ASC','ASENSITIVE','ASIN','ASSERTION','ASSIGNMENT','ASYMMETRIC','AT','ATAN','ATOMIC','ATTACH','ATTRIBUTE','ATTRIBUTES','AUTHORIZATION','AVG','BACKWARD','BASE64','BEFORE','BEGIN','BEGIN_FRAME','BEGIN_PARTITION','BERNOULLI','BETWEEN','BIGINT','BINARY','BIT','BIT_LENGTH','BLOB','BLOCKED','BOM','BOOLEAN','BOTH','BREADTH','BY','C','CACHE','CALL','CALLED','CARDINALITY','CASCADE','CASCADED','CASE','CAST','CATALOG','CATALOG_NAME','CEIL','CEILING','CHAIN','CHAINING','CHAR','CHARACTER','CHARACTERISTICS','CHARACTERS','CHARACTER_LENGTH','CHARACTER_','CHARACTER_SET_NAME','CHARACTER_SET_SCHEMA','CHAR_LENGTH','CHECK','CHECKPOINT','CLASS','CLASSIFIER','CLASS_ORIGIN','CLOB','CLOSE','CLUSTER','COALESCE','COBOL','COLLATE','COLLATION','COLLATION_CATALOG','COLLATION_NAME','COLLATION_SCHEMA','COLLECT','COLUMN','COLUMNS','COLUMN_NAME','COMMAND_FUNCTION','COMMAND_','COMMENT','COMMENTS','COMMIT','COMMITTED','COMPRESSION','CONCURRENTLY','CONDITION','CONDITIONAL','CONDITION_NUMBER','CONFIGURATION','CONFLICT','CONNECT','CONNECTION','CONNECTION_NAME','CONSTRAINT','CONSTRAINTS','CONSTRAINT_CATALOG','CONSTRAINT_NAME','CONSTRAINT_SCHEMA','CONSTRUCTOR','CONTAINS','CONTENT','CONTINUE','CONTROL','CONVERSION','CONVERT','COPY','CORR','CORRESPONDING','COS','COSH','COST','COUNT','COVAR_POP','COVAR_SAMP','CREATE','CROSS','CSV','CUBE','CUME_DIST','CURRENT','CURRENT_CATALOG','CURRENT_DATE','CURRENT_','CURRENT_PATH','CURRENT_ROLE','CURRENT_ROW','CURRENT_SCHEMA','CURRENT_TIME','CURRENT_TIMESTAMP','CURRENT_','CURRENT_USER','CURSOR','CURSOR_NAME','CYCLE','DATA','DATABASE','DATALINK','DATE','DATETIME_','DATETIME_','DAY','DB','DEALLOCATE','DEC','DECFLOAT','DECIMAL','DECLARE','DEFAULT','DEFAULTS','DEFERRABLE','DEFERRED','DEFINE','DEFINED','DEFINER','DEGREE','DELETE','DELIMITER','DELIMITERS','DENSE_RANK','DEPENDS','DEPTH','DEREF','DERIVED','DESC','DESCRIBE','DESCRIPTOR','DETACH','DETERMINISTIC','DIAGNOSTICS','DICTIONARY','DISABLE','DISCARD','DISCONNECT','DISPATCH','DISTINCT','DLNEWCOPY','DLPREVIOUSCOPY','DLURLCOMPLETE','DLURLCOMPLETEONLY','DLURLCOMPLETEWRITE','DLURLPATH','DLURLPATHONLY','DLURLPATHWRITE','DLURLSCHEME','DLURLSERVER','DLVALUE','DO','DOCUMENT','DOMAIN','DOUBLE','DROP','DYNAMIC','DYNAMIC_FUNCTION','DYNAMIC_','EACH','ELEMENT','ELSE','EMPTY','ENABLE','ENCODING','ENCRYPTED','END','END','END_FRAME','END_PARTITION','ENFORCED','ENUM','EQUALS','ERROR','ESCAPE','EVENT','EVERY','EXCEPT','EXCEPTION','EXCLUDE','EXCLUDING','EXCLUSIVE','EXEC','EXECUTE','EXISTS','EXP','EXPLAIN','EXPRESSION','EXTENSION','EXTERNAL','EXTRACT','FALSE','FAMILY','FETCH','FILE','FILTER','FINAL','FINALIZE','FINISH','FIRST','FIRST_VALUE','FLAG','FLOAT','FLOOR','FOLLOWING','FOR','FORCE','FOREIGN','FORMAT','FORTRAN','FORWARD','FOUND','FRAME_ROW','FREE','FREEZE','FROM','FS','FULFILL','FULL','FUNCTION','FUNCTIONS','FUSION','G','GENERAL','GENERATED','GET','GLOBAL','GO','GOTO','GRANT','GRANTED','GREATEST','GROUP','GROUPING','GROUPS','HANDLER','HAVING','HEADER','HEX','HIERARCHY','HOLD','HOUR','ID','IDENTITY','IF','IGNORE','ILIKE','IMMEDIATE','IMMEDIATELY','IMMUTABLE','IMPLEMENTATION','IMPLICIT','IMPORT','IN','INCLUDE','INCLUDING','INCREMENT','INDENT','INDEX','INDEXES','INDICATOR','INHERIT','INHERITS','INITIAL','INITIALLY','INLINE','INNER','INOUT','INPUT','INSENSITIVE','INSERT','INSTANCE','INSTANTIABLE','INSTEAD','INT','INTEGER','INTEGRITY','INTERSECT','INTERSECTION','INTERVAL','INTO','INVOKER','IS','ISNULL','ISOLATION','JOIN','JSON_ARRAY','JSON_ARRAYAGG','JSON_EXISTS','JSON_OBJECT','JSON_OBJECTAGG','JSON_QUERY','JSON_TABLE','JSON_TABLE_PRIMITIVE','JSON_VALUE','K','KEEP','KEY','KEYS','KEY_MEMBER','KEY_TYPE','LABEL','LAG','LANGUAGE','LARGE','LAST','LAST_VALUE','LATERAL','LEAD','LEADING','LEAKPROOF','LEAST','LEFT','LENGTH','LEVEL','LIBRARY','LIKE','LIKE_REGEX','LIMIT','LINK','LISTAGG','LISTEN','LN','LOAD','LOCAL','LOCALTIME','LOCALTIMESTAMP','LOCATION','LOCATOR','LOCK','LOCKED','LOG','LOG10','LOGGED','LOWER','M','MAP','MAPPING','MATCH','MATCHED','MATCHES','MATCH_NUMBER','MATCH_RECOGNIZE','MATERIALIZED','MAX','MAXVALUE','MEASURES','MEMBER','MERGE','MESSAGE_LENGTH','MESSAGE_OCTET_LENGTH','MESSAGE_TEXT','METHOD','MIN','MINUTE','MINVALUE','MOD','MODE','MODIFIES','MODULE','MONTH','MORE','MOVE','MULTISET','MUMPS','NAME','NAMES','NAMESPACE','NATIONAL','NATURAL','NCHAR','NCLOB','NESTED','NESTING','NEW','NEXT','NFC','NFD','NFKC','NFKD','NIL','NO','NONE','NORMALIZE','NORMALIZED','NOT','NOTHING','NOTIFY','NOTNULL','NOWAIT','NTH_VALUE','NTILE','NULL','NULLABLE','NULLIF','NULLS','NULL_ORDERING','NUMBER','NUMERIC','OBJECT','OCCURRENCE','OCCURRENCES_REGEX','OCTETS','OCTET_LENGTH','OF','OFF','OFFSET','OIDS','OLD','OMIT','ON','ONE','ONLY','OPEN','OPERATOR','OPTION','OPTIONS','OR','ORDER','ORDERING','ORDINALITY','OTHERS','OUT','OUTER','OUTPUT','OVER','OVERFLOW','OVERLAPS','OVERLAY','OVERRIDING','OWNED','OWNER','P','PAD','PARALLEL','PARAMETER','PARAMETER_MODE','PARAMETER_NAME','PARAMETER_','PARAMETER_','PARAMETER_','PARAMETER_','PARSER','PARTIAL','PARTITION','PASCAL','PASS','PASSING','PASSTHROUGH','PASSWORD','PAST','PATH','PATTERN','PER','PERCENT','PERCENTILE_CONT','PERCENTILE_DISC','PERCENT_RANK','PERIOD','PERMISSION','PERMUTE','PIPE','PLACING','PLAN','PLANS','PLI','POLICY','PORTION','POSITION','POSITION_REGEX','POWER','PRECEDES','PRECEDING','PRECISION','PREPARE','PREPARED','PRESERVE','PREV','PRIMARY','PRIOR','PRIVATE','PRIVILEGES','PROCEDURAL','PROCEDURE','PROCEDURES','PROGRAM','PRUNE','PTF','PUBLIC','PUBLICATION','QUOTE','QUOTES','RANGE','RANK','READ','READS','REAL','REASSIGN','RECHECK','RECOVERY','RECURSIVE','REF','REFERENCES','REFERENCING','REFRESH','REGR_AVGX','REGR_AVGY','REGR_COUNT','REGR_INTERCEPT','REGR_R2','REGR_SLOPE','REGR_SXX','REGR_SXY','REGR_SYY','REINDEX','RELATIVE','RELEASE','RENAME','REPEATABLE','REPLACE','REPLICA','REQUIRING','RESET','RESPECT','RESTART','RESTORE','RESTRICT','RESULT','RETURN','RETURNED_CARDINALITY','RETURNED_LENGTH','RETURNED_','RETURNED_SQLSTATE','RETURNING','RETURNS','REVOKE','RIGHT','ROLE','ROLLBACK','ROLLUP','ROUTINE','ROUTINES','ROUTINE_CATALOG','ROUTINE_NAME','ROUTINE_SCHEMA','ROW','ROWS','ROW_COUNT','ROW_NUMBER','RULE','RUNNING','SAVEPOINT','SCALAR','SCALE','SCHEMA','SCHEMAS','SCHEMA_NAME','SCOPE','SCOPE_CATALOG','SCOPE_NAME','SCOPE_SCHEMA','SCROLL','SEARCH','SECOND','SECTION','SECURITY','SEEK','SELECT','SELECTIVE','SELF','SEMANTICS','SENSITIVE','SEQUENCE','SEQUENCES','SERIALIZABLE','SERVER','SERVER_NAME','SESSION','SESSION_USER','SET','SETOF','SETS','SHARE','SHOW','SIMILAR','SIMPLE','SIN','SINH','SIZE','SKIP','SMALLINT','SNAPSHOT','SOME','SORT_DIRECTION','SOURCE','SPACE','SPECIFIC','SPECIFICTYPE','SPECIFIC_NAME','SQL','SQLCODE','SQLERROR','SQLEXCEPTION','SQLSTATE','SQLWARNING','SQRT','STABLE','STANDALONE','START','STATE','STATEMENT','STATIC','STATISTICS','STDDEV_POP','STDDEV_SAMP','STDIN','STDOUT','STORAGE','STORED','STRICT','STRING','STRIP','STRUCTURE','STYLE','SUBCLASS_ORIGIN','SUBMULTISET','SUBSCRIPTION','SUBSET','SUBSTRING','SUBSTRING_REGEX','SUCCEEDS','SUM','SUPPORT','SYMMETRIC','SYSID','SYSTEM','SYSTEM_TIME','SYSTEM_USER','T','TABLE','TABLES','TABLESAMPLE','TABLESPACE','TABLE_NAME','TAN','TANH','TEMP','TEMPLATE','TEMPORARY','TEXT','THEN','THROUGH','TIES','TIME','TIMESTAMP','TIMEZONE_HOUR','TIMEZONE_MINUTE','TO','TOKEN','TOP_LEVEL_COUNT','TRAILING','TRANSACTION','TRANSACTIONS_','TRANSACTIONS_','TRANSACTION_ACTIVE','TRANSFORM','TRANSFORMS','TRANSLATE','TRANSLATE_REGEX','TRANSLATION','TREAT','TRIGGER','TRIGGER_CATALOG','TRIGGER_NAME','TRIGGER_SCHEMA','TRIM','TRIM_ARRAY','TRUE','TRUNCATE','TRUSTED','TYPE','TYPES','UESCAPE','UNBOUNDED','UNCOMMITTED','UNCONDITIONAL','UNDER','UNENCRYPTED','UNION','UNIQUE','UNKNOWN','UNLINK','UNLISTEN','UNLOGGED','UNMATCHED','UNNAMED','UNNEST','UNTIL','UNTYPED','UPDATE','UPPER','URI','USAGE','USER','USER_','USER_','USER_','USER_','USING','UTF16','UTF32','UTF8','VACUUM','VALID','VALIDATE','VALIDATOR','VALUE','VALUES','VALUE_OF','VARBINARY','VARCHAR','VARIADIC','VARYING','VAR_POP','VAR_SAMP','VERBOSE','VERSION','VERSIONING','VIEW','VIEWS','VOLATILE','WHEN','WHENEVER','WHERE','WHITESPACE','WIDTH_BUCKET','WINDOW','WITH','WITHIN','WITHOUT','WORK','WRAPPER','WRITE','XML','XMLAGG','XMLATTRIBUTES','XMLBINARY','XMLCAST','XMLCOMMENT','XMLCONCAT','XMLDECLARATION','XMLDOCUMENT','XMLELEMENT','XMLEXISTS','XMLFOREST','XMLITERATE','XMLNAMESPACES','XMLPARSE','XMLPI','XMLQUERY','XMLROOT','XMLSCHEMA','XMLSERIALIZE','XMLTABLE','XMLTEXT','XMLVALIDATE','YEAR','YES','ZON'
]

import MonacoEditor from 'monaco-editor-vue3'
import {shallowRef} from 'vue'
import { formatDialect, postgresql } from 'sql-formatter';

export default {
  name: 'AGSQLEditor',
  components: {
    MonacoEditor
  },

  props: ['tableList', 'pasteAtCursor', 'code'],

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

    code(){
      this.codeLocal = this.code
    }
  },

  data() {

    return {
      codeLocal: '/* select * from table limit 10 */',
      editorInstance: null,
      monaco: null,
      completionProvider : {suggestions: []},
    }
  },

  methods: {
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

    setCompletion(monaco){

      monaco.languages.registerCompletionItemProvider('sql', 
        {
          provideCompletionItems : (_model, position) =>  {
            let suggestions = [
              ...pgsqlKeywords.map(k => {
                return {
                  label: k, 
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: k
                }
              }),
              ...this.tableList.map(t => {
                return {
                  label: t.name, 
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: t.name
                }
              }),
              ...this.tableList.map(t => {
                return {
                  label: "sn:" + t.name, 
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: "select * from " + t.name + " limit 10"
                }
              })
            ]
            const completionProviderSuggestions = this.completionProvider.suggestions.map(m => m.label)
            this.completionProvider = {suggestions: suggestions}
            suggestions = suggestions.filter(s => {
              return (completionProviderSuggestions.indexOf(s.label) < 0) 
            })
            return this.completionProvider
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

          matches.forEach(m => {
            content = content.replaceAll(m, `/* ${m} */`)
          })

          const matchEEX = content.match(/<%={0,1}.+%>/gm)

          matchEEX.forEach(m => {
            content = content.replaceAll(m, `/* ${m} */`)
          })

          var formatted = formatDialect(content, {dialect: postgresql, keywordCase: 'upper'})
          matches.forEach(m => {
            formatted = formatted.replaceAll(`/* ${m} */`, m)
          })

          matchEEX.forEach(m => {
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
    },

    setupMonaco(){
      let monaco = this.monaco
      if (monaco){
        monaco = this.setKeywordsHighlighting(monaco)
        monaco = this.setCompletion(monaco)
        this.setFormatter()

      }
    }
  }
}
</script>
