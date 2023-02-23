<style lang="scss">
.monaco-editor .suggest-widget.docs-side {
  width: 1000px;
}

.monaco-editor .suggest-widget.docs-side > .details {
  width: 60%;
  max-height: 800px !important;
}

.monaco-editor .suggest-widget.docs-side > .tree {
  width: 30%;
  float: left;
}

.monaco-editor .suggest-widget {
  width: 50rem;
}
</style>
<template>
  <div class="tw-h-full" ref="code-wrapper">
    <MonacoEditor
      theme="AGDraculaTheme"
      v-model:value="codeLocal"
      language="sql"
      :options="editorOptions"
      @editorWillMount="editorWillMount"
      @editorDidMount="editorDidMount"
    />
    <AGCreateSnippetModal
      v-model:open="openCreateSnippetModal"
      :databaseID="databaseID"
      :text="selectedText"
      @newSnippet="(snippet) => updateSQL(snippet)"
      :key="selectedText"
      v-if="selectedText"
    />
    <AGToast v-model:show="showToast" type="ok">{{ toastText }}</AGToast>
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

import { pgsqlKeywords } from 'src/helpers/pgWords';
import MonacoEditor from 'monaco-editor-vue3';
import AGToast from 'components/utils/toast.vue';
import { shallowRef } from 'vue';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { KeyCode } from 'monaco-editor';
import { AGDraculaTheme } from 'src/helpers/monacoTheme';
import { autocomplete } from 'src/apis/autoComplete';
import { fetchSnippet, fetchSnippets } from 'src/apis/snippet';
import AGCreateSnippetModal from 'components/question/createSnippetModal.vue';
import { fetchTables, getColumns } from 'src/apis/database';
import { sessionStore } from 'src/stores/session';
import { fetchQuestion } from 'src/apis/questions';
import { setSQLFormatter } from 'src/helpers/formatters';

const session = sessionStore();

export default {
  name: 'AGSQLEditor',
  components: {
    MonacoEditor,
    AGCreateSnippetModal,
    AGToast,
  },

  watch: {
    databaseID() {
      fetchTable;
    },
  },

  props: ['pasteAtCursor', 'code', 'databaseID'],

  watch: {
    tableList() {
      this.setCompletion(this.monaco);
    },
    databaseID() {
      fetchTables(this.databaseID, session.token, this.setTableList);
    },

    snippets() {
      this.setSnippetCompletion(this.monaco);
    },
    tableList: {
      deep: true,
      handler() {
        this.setCompletion(this.monaco);
      },
    },
    pasteAtCursor() {
      if (this.pasteAtCursor) {
        this.applyPasteAtCursor();
        this.$emit('update:pasteAtCursor', null);
      }
    },
    codeLocal(oldv, newv) {
      if (!isEqual(oldv, newv)) {
        this.$emit('update:code', this.codeLocal);
        debounce(() => this.setDynamicCompletion(this.monaco), 300)();
      }
    },

    code(oldv, newv) {
      if (!isEqual(oldv, newv)) {
        this.codeLocal = this.code;
      }
    },
  },

  data() {
    return {
      codeLocal: this.code,
      tableList: [],
      editorInstance: null,
      monaco: null,
      completionProvider: null,
      dynamicCompletionProvider: null,
      snippetsCompletionProvider: null,
      selectedText: '',
      openCreateSnippetModal: false,
      snippets: [],
      hoverProvider: null,
      editorOptions: {
        fixedOverflowWidgets: true,
        minimap: { enabled: false },
      },
      showToast: false,
      toastText: null,
    };
  },

  unmounted() {
    this.dynamicCompletionProvider?.dispose();
    this.completionProvider?.dispose();
    this.snippetsCompletionProvider?.dispose();
    this.hoverProvider?.dispose();
  },

  mounted() {
    if (this.databaseID) {
      fetchSnippets(this.databaseID, this.setSnippets);
      fetchTables(this.databaseID, session.token, this.setTableList);
    }
  },

  methods: {
    setSnippets(snippets, loading) {
      this.snippets = snippets || [];
    },
    updateColumnsForCompletion() {
      if (!this.codeLocal) {
        return;
      }
    },
    applyPasteAtCursor() {
      this.editorInstance.focus();
      this.editorInstance.trigger('keyboard', 'type', {
        text: this.pasteAtCursor,
      });
    },

    setKeywordsHighlighting(monaco) {
      monaco.languages.setMonarchTokensProvider('sql', {
        pgsqlKeywords,
        tokenizer: {
          root: [
            [
              /@?[a-zA-Z][\w$]*/,
              {
                cases: {
                  '@pgsqlKeywords': 'keyword',
                  '@default': 'variable',
                },
              },
            ],
            [/'.*?'/, 'value'],
            [/".*?"/, 'string'],
            [/\/\*.*\*\//, 'comment'],
          ],
        },
      });
      return monaco;
    },

    setSnippetCompletion(monaco) {
      if (this.snippetsCompletionProvider) {
        this.snippetsCompletionProvider.dispose();
      }
      this.snippetsCompletionProvider =
        monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: (model, position) => {
            let suggestions = [
              ...this.snippets.map((k) => {
                return {
                  label: {
                    label: `sn:${k.name}:${k.id} `,
                    description: k.text,
                    detail: `${
                      k.expand_on_select ? 'expandable' : 'non expandable'
                    }`,
                  },

                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: k.expand_on_select
                    ? k.text
                    : `{{sn:${k.name}:${k.id}}}`,
                  sortText: k.name.length.toString(),
                  documentation: { value: k.text },
                };
              }),
            ];
            return { suggestions: suggestions };
          },
        });
    },

    setDynamicCompletion(monaco) {
      if (this.dynamicCompletionProvider) {
        this.dynamicCompletionProvider.dispose();
      }
      this.dynamicCompletionProvider =
        monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: (model, position) => {
            return new Promise((resolve, reject) => {
              const prefix = model.getWordUntilPosition(position);
              autocomplete(
                this.codeLocal,
                prefix.word,
                this.databaseID,
                (response) => {
                  resolve({
                    suggestions:
                      (response &&
                        response.map((v) => {
                          return {
                            label: v.value,
                            kind: monaco.languages.CompletionItemKind.Class,
                            insertText: v.value,
                            sortText: v.score.toString(),
                          };
                        })) ||
                      [],
                  });
                }
              );
            });
          },
        });
    },

    setCompletion(monaco) {
      if (this.completionProvider) {
        this.completionProvider.dispose();
      }
      this.completionProvider = monaco.languages.registerCompletionItemProvider(
        'sql',
        {
          provideCompletionItems: (_model, _position) => {
            let suggestions = [
              ...pgsqlKeywords.map((k) => {
                return {
                  label: k.name,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: k.name,
                  sortText: (k.value < 20 ? k.value : k.name.length).toString(),
                };
              }),
              ...this.tableList.map((t) => {
                return {
                  label: t.name,
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: t.name,
                  sortText: t.name.length.toString(),
                };
              }),
              ...this.tableList.map((t) => {
                return {
                  label: {
                    label: 'sn:' + t.name,
                    description: 'select * from ' + t.name + ' limit 10',
                  },
                  kind: monaco.languages.CompletionItemKind.Class,
                  insertText: 'select * from ' + t.name + ' limit 10',
                  sortText: t.name.length.toString(),
                  documentation: {
                    value: 'select * from ' + t.name + ' limit 10',
                  },
                };
              }),
            ];
            suggestions = [
              ...new Map(
                suggestions.map((item) => [
                  item?.label?.label || item.label,
                  item,
                ])
              ).values(),
            ];
            return { suggestions: suggestions };
          },
        }
      );
      return monaco;
    },

    updateSQL(snippet) {
      if (!snippet) {
        return;
      }
      if (snippet.expand_on_select) {
        this.editorInstance.executeEdits('', [
          { range: this.currentSelection, text: snippet.text },
        ]);
        return;
      }
      this.editorInstance.executeEdits('', [
        {
          range: this.currentSelection,
          text: `{{sn:${snippet.name}:${snippet.id}}}`,
        },
      ]);
    },

    editorWillMount(monaco) {
      this.monaco = shallowRef(monaco);
      this.setupMonaco();
    },

    editorDidMount(editor) {
      this.editorInstance = shallowRef(editor);
      this.setKeybindings();
    },
    setKeybindings() {
      this.editorInstance.addCommand(
        KeyCode.F1,
        () => {
          'pass';
        },
        null
      );

      this.editorInstance.addCommand(
        this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KeyP,
        () => {
          this.editorInstance.trigger('', 'editor.action.quickCommand', null);
        },
        null
      );
      this.editorInstance.addCommand(
        this.monaco.KeyMod.CtrlCmd |
          this.monaco.KeyMod.Shift |
          this.monaco.KeyCode.Enter,
        () => {
          const selected = this.editorInstance
            .getModel()
            .getValueInRange(this.editorInstance.getSelection());
          console.log('selected', selected);
          this.$emit('runSelectedQuery', selected);
        },
        null
      );

      this.editorInstance.addCommand(
        this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.Enter,
        () => {
          this.$emit('runQuery');
        },
        null
      );

      this.editorInstance.addAction({
        id: "Copy Selected Table's columns",
        label: "Copy Selected Table's columns",
        keybindings: [this.monaco.KeyMod.Alt | this.monaco.KeyCode.KeyT],
        contextMenuGroupId: 'additionalActions',
        run: (editor) => {
          const currentSelection = editor.getSelection();
          const selectedText = editor
            .getModel()
            .getValueInRange(currentSelection);

          if (!selectedText) return;

          const tableNames = this.tableList.map((t) =>
            t.name.toLowerCase().trim()
          );
          const tableReadableNames = this.tableList.map((t) =>
            t.readable_table_name.toLowerCase().trim()
          );
          let index = tableNames.indexOf(selectedText.toLowerCase().trim());
          if (index >= 0) {
            this.copyColumns(index);
            return;
          }
          index = tableReadableNames.indexOf(selectedText.toLowerCase().trim());
          if (index >= 0) {
            this.copyColumns(index);
            return;
          }
        },
      });

      this.editorInstance.addAction({
        id: 'Create snippet from selected text',
        label: 'Create snippet from selected text',
        keybindings: [this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KeyS],
        contextMenuGroupId: 'additionalActions',
        run: (editor) => {
          this.currentSelection = editor.getSelection();
          this.selectedText = editor
            .getModel()
            .getValueInRange(this.currentSelection);
          this.openCreateSnippetModal = true;
        },
      });
    },

    copyColumns(index) {
      getColumns(
        this.tableList[index].id,
        session.token,
        this.copyFormattedColumns
      );
    },

    copyFormattedColumns(table) {
      if (table) {
        const text = table.columns.map((c) => c.name).join(',\n');
        navigator.clipboard.writeText(text);
        this.toastText = 'Copied Columns to clipboard!';
        this.showToast = true;
      }
    },
    setupHover(monaco) {
      if (this.hoverProvider) {
        this.hoverProvider.dispose();
      }
      this.hoverProvider = monaco.languages.registerHoverProvider('sql', {
        provideHover: (model, position) => {
          // Log the current word in the console, you probably want to do something else here.

          const selection = this.editorInstance?.getSelection();
          const text = model.getValueInRange(selection);
          if (!text) {
            return;
          }

          const snippetMatch = [...text.matchAll(/{{\w*sn:.+:(\d+)?\W*}}/g)];
          if (snippetMatch.length != 0) {
            return new Promise((resolve, reject) => {
              const snippetID = snippetMatch[0][1];
              fetchSnippet(snippetID, (response, loading) => {
                if (response) {
                  resolve({
                    range: new this.monaco.Range(
                      selection.startLineNumber,
                      selection.startColumn,
                      selection.endLineNumber,
                      selection.endColumn
                    ),
                    contents: [
                      {
                        supportHtml: true,
                        value: '```sql\n' + response.text + '\n```\n',
                      },
                      {
                        supportHtml: true,
                        value: `[Edit Snippet](${window.location.origin}/snippets/${snippetID})`,
                      },
                    ],
                  });
                }
              });
            });
          }

          const quesMatch = [...text.matchAll(/{{\w*ques:(\d+)?\W*}}/g)];
          if (quesMatch.length != 0) {
            return new Promise((resolve, reject) => {
              const quesID = quesMatch[0][1];
              fetchQuestion(quesID, session.token, (response, loading) => {
                if (response) {
                  resolve({
                    range: new this.monaco.Range(
                      selection.startLineNumber,
                      selection.startColumn,
                      selection.endLineNumber,
                      selection.endColumn
                    ),
                    contents: [
                      {
                        supportHtml: true,
                        value: response.title,
                      },
                      {
                        supportHtml: true,
                        value: '```sql\n' + response.sql + '\n```\n',
                      },
                      {
                        supportHtml: true,
                        value: `[Go to Question](${window.location.origin}/questions/${quesID})`,
                      },
                    ],
                  });
                }
              });
            });
          }

          const tableNames = this.tableList.map((t) =>
            t.name.toLowerCase().trim()
          );
          const tableReadableNames = this.tableList.map((t) =>
            t.readable_table_name.toLowerCase().trim()
          );
          const tableReadableNamesWithoutQuotes = this.tableList.map((t) =>
            t.readable_table_name.toLowerCase().trim().replaceAll('"', '')
          );
          const tableNamesWithoutQuotes = this.tableList.map((t) =>
            t.readable_table_name.toLowerCase().trim().replaceAll('"', '')
          );
          let index = tableNames.indexOf(text.toLowerCase().trim());
          if (index >= 0) {
            return this.hoverTable(index, selection);
          }
          index = tableReadableNames.indexOf(text.toLowerCase().trim());
          if (index >= 0) {
            return this.hoverTable(index, selection);
          }
          index = tableReadableNamesWithoutQuotes.indexOf(
            text.toLowerCase().trim()
          );
          if (index >= 0) {
            return this.hoverTable(index, selection);
          }
          index = tableNamesWithoutQuotes.indexOf(text.toLowerCase().trim());
          if (index >= 0) {
            return this.hoverTable(index, selection);
          }
        },
      });
    },
    hoverTable(index, selection) {
      return new Promise((resolve) => {
        getColumns(this.tableList[index].id, session.token, (response) => {
          if (response) {
            resolve({
              range: new this.monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
              ),
              contents: [
                {
                  supportHtml: true,
                  value: `Table Description: ${response.description} `,
                },
                {
                  supportHtml: true,
                  value: this.getColumnsHoverTable(response.columns),
                },
                {
                  supportHtml: true,
                  value: `[Edit Column Descriptions](${window.location.origin}/data_references/databases/${response.database_id}/tables/${response.id})`,
                },
                {
                  supportHtml: true,
                  value: `[Explore Table](${window.location.origin}/questions/new?database_id=${response.database_id}&table_id=${response.id})`,
                },
              ],
            });
          }
        });
      });
    },

    getColumnsHoverTable(columns) {
      if (!columns) {
        return;
      }
      const table = columns.reduce((acc, column) => {
        return (
          acc +
          `<tr><td>${column.name}</td><td>${column.data_type}</td><td>${column.description}</td> </tr>`
        );
      }, '<table><thead><th>COLUMN NAME</th><th>DATA TYPE</th><th>DESCRIPTION</th></thead><tbody>');

      return table + '<tbody><table>';
    },
    setupMonaco() {
      let monaco = this.monaco;
      if (monaco) {
        monaco.editor.defineTheme('AGDraculaTheme', AGDraculaTheme);
        monaco.languages.setLanguageConfiguration('plaintext', {
          wordPattern: /'?\w[\w'-.:]*[?!,;:"]*/,
        });

        // monaco = this.setKeywordsHighlighting(monaco)
        monaco = this.setCompletion(monaco);
        this.setSnippetCompletion(monaco);
        this.setupHover(monaco);
        setSQLFormatter(monaco);
      }
    },
    setTableList(tables) {
      this.tableList = tables || [];
    },
  },
};
</script>
