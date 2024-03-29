import { boot } from 'quasar/wrappers'

import monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // monaco.languages.CompletionItemKind.Field
  // self.MonacoEnvironment = {
  //   getWorker(_, label) {
  //     if (label === 'json') {
  //       return new jsonWorker();
  //     }
  //     if (label === 'css' || label === 'scss' || label === 'less') {
  //       return new cssWorker();
  //     }
  //     if (label === 'html' || label === 'handlebars' || label === 'razor') {
  //       return new htmlWorker();
  //     }
  //     if (label === 'typescript' || label === 'javascript') {
  //       return new tsWorker();
  //     }
  //     return new editorWorker();
  //   },
  // };
})
