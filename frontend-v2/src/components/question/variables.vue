<template>
  <div class="tw-flex-1 tw-flex tw-items-center">
    <div class="tw-flex tw-items-center tw-flex-1">
      <template v-for="variable in variablesLocal" :key="variable">
        <div class="tw-flex tw-items-center tw-m-1">
          <div class="tw-flex tw-items-center tw-cursor-pointer tw-leading-4">
            <div class="tw-flex">
              <div
                class="tw-bg-primary/90 tw-text-white tw-px-2 tw-py-1 tw-rounded-l-sm"
              >
                {{ variable.name }}
              </div>
              <div
                class="tw-bg-primary tw-text-white tw-px-2 tw-py-1 tw-rounded-r-sm"
                :class="currentUser.canEditQuestion ? '' : 'tw-rounded-sm'"
                v-if="
                  variable.var_type === 'String' ||
                  variable.var_type === 'Integer'
                "
              >
                {{ variable.value != null ? variable.value : variable.default }}
              </div>
              <AGDatetimePicker
                class="tw-bg-primary tw-text-white tw-px-2 tw-py-1 tw-rounded-r-sm tw-border-0"
                v-model:value="variable.value"
                type="datetime"
                :clearCount="variable.clearCount"
                v-if="variable.var_type === 'Date'"
              />
              <q-menu
                flat="true"
                transition-show="jump-down"
                transition-hide="jump-up"
                max-height="400px"
                class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
                @show="menuShow"
                @keydown="onKeydown"
                fit
                v-if="
                  variable.var_type === 'String' ||
                  variable.var_type === 'Integer'
                "
              >
                <AGInput
                  :placeholder="'Enter ' + variable.name"
                  v-model:value="variable.value"
                />
              </q-menu>
            </div>
          </div>
          <div
            class="tw-rounded-r-sm tw-bg-primary/60 tw-py-1 tw-px-2 tw-cursor-pointer"
            v-if="currentUser.canEditQuestion"
            @click="
              (openVariableEditingModal = true) && (editingVariable = variable)
            "
          >
            <EditIcon size="16" class="tw-stroke-white" />
          </div>
        </div>
      </template>
    </div>

    <div
      class="tw-text-right tw-flex tw-gap-2"
      v-if="variablesLocal?.length > 0"
    >
      <div
        class="tw-uppercase tw-cursor-pointer tw-font-semibold tw-text-primary"
        @click="clearVars"
      >
        clear
      </div>
      <div
        class="tw-uppercase tw-cursor-pointer tw-font-semibold tw-text-primary"
        @click="resetVars"
      >
        reset
      </div>
    </div>
    <AGVariableEditingModal
      v-model:open="openVariableEditingModal"
      v-model:variable="editingVariable"
      @done="variableEditDone"
    />
  </div>
</template>
<script>
import AGInput from 'components/base/input.vue';
import AGDatetimePicker from 'components/base/inputDatePicker.vue';
import AGVariableEditingModal from 'components/question/variableEditingModal.vue';

import { EditIcon } from 'vue-tabler-icons';
import { currentUserStore } from 'stores/currentUser';
import { randomID } from 'src/helpers/random';

const currentUser = currentUserStore();
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { fetchQuestionVariables } from 'src/apis/questions';
import { sessionStore } from 'src/stores/session';
import { fetchSnippet } from 'src/apis/snippet';
export default {
  name: 'AGQuestionVariables',
  components: { AGDatetimePicker, AGInput, EditIcon, AGVariableEditingModal },
  props: ['variables', 'code', 'variablesUpdated'],

  mounted() {
    this.setUpVariables();
  },

  watch: {
    code() {
      if (this.code != this.codeLocal) {
        this.codeLocal = this.code;
      }
    },

    codeLocal() {
      this.setUpVariables();
    },

    variables: {
      deep: true,
      handler() {
        if (!isEqual(this.variablesLocal, this.variables)) {
          this.variablesLocal = this.variables;
          // this.codeLocal = this.code;
        }
      },
    },

    variablesLocal: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.variablesLocal, this.variables)) {
          this.$emit('update:variables', this.variablesLocal);
        }
      },
    },
  },

  data() {
    return {
      variablesLocal: this.variables || [],
      currentUser: currentUser,
      openVariableEditingModal: false,
      editingVariable: null,
      resolve: [],
      allVariables: [],
      noMatch: false,
      codeLocal: this.code || '',
      snippetsMapping: {},
      questionsVariablesMapping: {},
    };
  },
  methods: {
    variableEditDone() {
      this.variablesLocal = this.variablesLocal.filter(
        (v) => v.id != this.editingVariable.id
      );
      this.variablesLocal.push(this.editingVariable);
    },

    findAndSetupQuestionVariables(id, index) {
      this.fetchQuestionVariables(id, this.setupQuestionVariables(id, index));
    },

    setupQuestionVariables(id, index) {
      return (variables, _loading) => {
        if (!variables) {
          return;
        }
        this.questionsVariablesMapping[id] = variables || [];
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
    },
    cleanupOldVariables() {
      if (this.resolve.indexOf(false) >= 0 && !this.noMatch) {
        return;
      }
      const variableNames = this.variablesLocal.map((v) => v.name);
      variableNames.forEach((v, i) => {
        if (this.allVariables.indexOf(v) < 0) {
          this.variablesLocal.splice(i, 1);
        }
      });
      this.variablesLocal = [
        ...new Map(
          this.variablesLocal.map((item) => [item?.name, item])
        ).values(),
      ];
      if (!this.variablesUpdated) {
        this.$emit('update:variablesUpdated', true);
      }
    },

    updateCodeLocal(id, replaceText) {
      return (snippet, loading) => {
        if (loading) {
          return;
        }

        this.snippetsMapping[id] = snippet || {};

        this.codeLocal = this.codeLocal.replaceAll(
          replaceText,
          snippet?.text || ''
        );
      };
    },

    fetchQuestionVariables(id, fn) {
      const qv = this.questionsVariablesMapping[id];
      if (qv) {
        fn(qv, false);
        return;
      }
      fetchQuestionVariables(id, fn);
    },
    fetchSnippet(id, fn) {
      const snippet = this.snippetsMapping[id];
      if (snippet) {
        fn(snippet, false);
        return;
      }
      fetchSnippet(id, fn);
    },
    setUpVariables() {
      debounce(() => {
        if (!this.codeLocal) {
          return;
        }
        // find snippets
        const snippetMatches = [
          ...this.codeLocal.matchAll(/{{\w*sn:.+:(\d+)?\W*}}/g),
        ];
        if (snippetMatches.length > 0) {
          //expand snippets first.
          snippetMatches.forEach((m) => {
            this.fetchSnippet(m[1], this.updateCodeLocal(m[1], m[0]));
          });
          return;
        }

        this.allVariables = [];
        this.noMatch = false;
        const matches = this.codeLocal.match(/{{\W*.+?\W*}}/g);
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
      }, 500)();
    },
    resetVars() {
      this.variablesLocal.forEach((v) => {
        v.value = null;
      });
    },

    clearVars() {
      this.variablesLocal.forEach((v) => {
        v.value = '';
      });
    },
  },
};
</script>
