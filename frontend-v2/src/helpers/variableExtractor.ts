import { fetchQuestionVariables } from 'src/apis/questions';
import { randomID } from './random';

class VariableExtractor {
  allVariables: any;
  variablesLocal: any;
  resolve: any;
  code: string;
  noMatch: any;
  constructor(code, existingVariables) {
    this.allVariables = [];
    this.variablesLocal = existingVariables;
    this.resolve = [];
    this.code = code;
    this.noMatch = false;
  }

  findAndSetupQuestionVariables(id, index) {
    fetchQuestionVariables(id, this.setupQuestionVariables(index));
  }

  setupQuestionVariables(index) {
    return (variables, _loading) => {
      if (!variables) {
        return;
      }
      const variableNames = this.variablesLocal.map((v) => v.name);
      variables.forEach((v) => {
        this.allVariables.push(v.name);
        if (variableNames.indexOf(v.name) < 0) {
          const generatedID = randomID() * 1000000000;
          this.variablesLocal.push({
            name: v.name,
            id: generatedID,
            var_type: v.var_type,
            default: v.default,
          });
        }
      });
      this.resolve[index] = true;
      this.cleanupOldVariables();
    };
  }
  cleanupOldVariables() {
    if (this.resolve.indexOf(false) >= 0 && this.noMatch) {
      return;
    }
    const variableNames = this.variablesLocal.map((v) => v.name);
    variableNames.forEach((v, i) => {
      if (this.allVariables.indexOf(v) < 0) {
        this.variablesLocal.splice(i, 1);
      }
    });
  }
  setUpVariables() {
    if (!this.code) {
      return;
    }
    this.allVariables = [];
    this.noMatch = false;
    const matches = this.code.match(/{{\W*.+?\W*}}/g);
    const variableNames = this.variablesLocal.map((v) => v.name);
    this.resolve = matches?.map(() => false) || [];

    matches?.forEach((m, i) => {
      const varName = m.replaceAll('{', '').replaceAll('}', '').trim();
      const quesMatch = varName.match(/ques:(\d+)/);
      if (quesMatch) {
        this.findAndSetupQuestionVariables(quesMatch[1], i);
      } else {
        this.allVariables.push(varName);
        if (variableNames.indexOf(varName) < 0) {
          const generatedID = randomID() * 1000000000;
          this.variablesLocal.push({
            name: varName,
            id: generatedID,
            var_type: 'String',
            default: '0',
          });
        }
        this.resolve[i] = true;
        this.cleanupOldVariables();
      }
    });

    this.noMatch = true;
    this.cleanupOldVariables();
  }
}

export { VariableExtractor };
