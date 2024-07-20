<template>
  <div class="tw-flex tw-flex-col tw-mx-3 tw-bg-white tw-rounded-2xl tw-w-full tw-border tw-p-4 tw-py-8">
    <div v-for="variable in systemVariables" :key="variable.slug" class="tw-grid tw-grid-cols-11 tw-mb-2">
      <div class="tw-col-span-5 tw-pr-1">
        <AGInput label="Name" placeholder="Variable name" class="tw-mb-1 tw-rounded-r-none" v-model:value="variable.name"
          debounce="300" />
      </div>
      <div class="tw-col-span-5 tw-pl-1">
        <AGInput label="Value" placeholder="Variable Value" class="tw-mb-1" v-model:value="variable.value"
          debounce="300" />
      </div>
      <AGButton class="tw-border-0 tw-text-red-500 tw-px-0" @click="deleteVariable(variable.id)">
        DELETE
      </AGButton>
    </div>
    <div>
      <AGButton class="tw-mt-2 tw-text-primary tw-border-primary" @click="addVariable">
        +Add Variable</AGButton>
    </div>
    <div v-if="error" class="tw-text-red-500 tw-mt-2">{{ error }}</div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import AGInput from 'src/components/base/agInput.vue';
import AGButton from 'src/components/base/button.vue';
import {
  fetchSystemVariables,
  createSystemVariable,
  updateSystemVariable,
  deleteSystemVariable,
} from 'src/apis/systemVariables';

export default {
  components: {
    AGInput,
    AGButton,
  },
  setup() {
    const systemVariables = ref([]);
    const error = ref('');

    const fetchVariables = async () => {
      fetchSystemVariables((data, err) => {
        if (!err) {
          systemVariables.value = data.map((v, i) => ({
            ...v,
            originalName: v.name,
            originalValue: v.value,
            slug: i,
          }));
        } else {
          console.error('Error fetching system variables:', err);
        }
      });
    };

    const addVariable = () => {
      const newVariable = {
        id: null,
        name: '',
        value: '',
        originalName: '',
        originalValue: '',
        slug: systemVariables.value.length,
      };
      systemVariables.value.push(newVariable);
    };

    const deleteVariable = async (id) => {
      if (id) {
        deleteSystemVariable(id, (success, err) => {
          if (success) {
            systemVariables.value = systemVariables.value.filter(
              (v) => v.id !== id
            );
          } else {
            console.error('Error deleting variable:', err);
          }
        });
      } else {
        systemVariables.value = systemVariables.value.filter(
          (v) => v.id !== id
        );
      }
    };

    const createVariable = (variable) => {
      createSystemVariable(variable, (data, err) => {
        if (!err) {
          const index = systemVariables.value.findIndex(
            (v) => v.name === variable.name
          );
          systemVariables.value[index] = {
            id: data.id,
            name: systemVariables.value[index].name,
            value: systemVariables.value[index].value,
            originalName: systemVariables.value[index].name,
            originalValue: systemVariables.value[index].value,
            slug: systemVariables.value[index].slug,
          };
          error.value = '';
        } else {
          if (err.includes('duplicate')) {
            error.value = 'Error: Duplicate name. Please use a unique name.';
          } else {
            console.error('Error creating variable:', err);
            error.value = 'Error creating variable. Please try again.';
          }
        }
      });
    };

    const updateVariable = (variable) => {
      updateSystemVariable(variable, (data, err) => {
        if (!err) {
          const index = systemVariables.value.findIndex(
            (v) => v.id === variable.id
          );
          systemVariables.value[index] = {
            id: data.id,
            name: systemVariables.value[index].name,
            value: systemVariables.value[index].value,
            originalName: systemVariables.value[index].name,
            originalValue: systemVariables.value[index].value,
            slug: systemVariables.value[index].slug,
          };
          error.value = '';
        } else {
          if (err.includes('duplicate')) {
            error.value = 'Error: Duplicate name. Please use a unique name.';
          } else {
            console.error('Error updating variable:', err);
            error.value = 'Error updating variable. Please try again.';
          }
        }
      });
    };

    watch(
      systemVariables,
      (variables) => {
        variables.forEach((variable) => {
          if (
            variable.name &&
            variable.value &&
            (variable.name !== variable.originalName ||
              variable.value !== variable.originalValue)
          ) {
            if (variable.id) {
              updateVariable(variable);
            } else {
              createVariable(variable);
            }
          }
        });
      },
      { deep: true }
    );

    onMounted(fetchVariables);

    return {
      systemVariables,
      addVariable,
      deleteVariable,
      error,
    };
  },
};
</script>
