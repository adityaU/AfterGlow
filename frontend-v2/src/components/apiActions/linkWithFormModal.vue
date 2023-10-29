<template>
  <AGApiActionLink
    :link="link"
    :queryKey="queryKey"
    :variables="variables"
    v-model:showForm="showForm"
  />
  <AGFormModal
    v-model:open="showForm"
    :variables="variables"
    :queryKey="queryKey"
    :form="link?.details?.display_settings?.form"
    :apiAction="link"
    v-if="link?.details?.display_settings?.renderForm"
  />
</template>
<script>
import AGApiActionLink from 'components/apiActions/link.vue';
import AGFormModal from 'components/apiActions/formRendererModal.vue';

import { queryStore } from 'stores/query';
import { extractFormattingSetting } from 'src/helpers/conditionMatching';
import { formattedValue } from 'src/helpers/formatting';
import { findDataType } from 'src/helpers/dataTypes';

export default {
  name: 'AGApiActionLinkWithFormModal',
  components: { AGApiActionLink, AGFormModal },
  props: ['link', 'queryKey', 'settings', 'colDetails', 'queryVariables'],
  data() {
    return {
      showForm: false,
    };
  },
  computed: {
    variables() {
      const query = queryStore().get(this.queryKey);
      const payload = query && query.payload;
      let variables =
        (payload &&
          payload.variables &&
          payload.variables.map((v) => {
            return { name: v.name, value: v.value };
          })) ||
        [];
      this.queryVariables?.forEach((vari) => {
        console.log(vari);
      });

      this.link.vars &&
        this.link.vars.cols &&
        this.link.vars.cols.forEach((c, i) => {
          variables.push({
            name: c,
            value: this.link.vars.row && this.link.vars.row[i],
          });
          variables.push({
            name: 'formatted:' + c,
            value: this.formattedValue(
              c,
              this.link.vars.row && this.link.vars.row[i]
            ),
          });
        });

      return variables;
    },
  },
  methods: {
    formattedValue(colName, value) {
      const dataType = findDataType(this.colDetails, colName);
      if (!this.settings) {
        return value;
      }
      const setting = this.settings.filter((s) => s.name === colName);
      if (setting.length === 0) {
        return value;
      }
      if (!setting[0].formattingSettings) {
        return value;
      }
      const formattingSetting = extractFormattingSetting(
        setting[0].formattingSettings,
        value,
        dataType
      );
      return formattedValue(value, formattingSetting, dataType);
    },
  },
};
</script>
