<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <div class="tw-flex ag-card tw-items-center tw-px-4 tw-py-2">
      <div class="tw-font-semibold tw-flex-1 tw-flex tw-flex-col">
        <div class="">Api Response</div>
        <div class="note">
          Click on any key in response to show it's content in tabular format or
          directly use Jmespath.
        </div>
      </div>
      <div :class="statusClass" class="tw-px-4 tw-py-0.5 tw-rounded">
        {{ apiResponse.status_code }}
      </div>
    </div>

    <div class="ag-card tw-py-2 tw-px-1" v-if="apiResponse">
      <div class="label tw-px-4">JMesPath</div>
      <AGInput
        class="tw-px-4"
        v-model:value="jsonPathLocal"
        placeholder="Enter JmesPath"
      />
      <div class="note tw-px-4">
        JmesPath is a way of extracting data from json response. You can read
        more about it.
        <a
          href="https://jmespath.org/tutorial.html"
          class="tw-cursor-pointer tw-text-primary"
          target="_blank"
        >
          here </a
        >. Use this field to customize the data extracted. Alternatively, You
        can click on any key in API response pane.
      </div>
    </div>
    <div class="tw-flex ag-card tw-px-4 tw-py-2 tw-h-full tw-overflow-auto">
      <div
        class="tw-cursor-pointer tw-text-primary tw-font-semibold tw-flex-shrink-0"
        @click="jsonPathLocal = ''"
      >
        root :
      </div>
      <AGJsonDisplay
        :jsonAttr="responseBody"
        level="1"
        jsonPath=""
        @updateJsonPath="(jp) => (jsonPathLocal = jp)"
      />
    </div>
  </div>
</template>

<script>
import AGJsonDisplay from 'components/dataRenderers/charts/jsonDisplay.vue';
import { isEqual } from 'lodash';
import { responseBody } from 'src/helpers/jsonPath';
import AGInput from 'components/base/input.vue';

export default {
  name: 'AGApiResponseViewer',
  props: ['apiResponse', 'jsonPath'],
  components: { AGJsonDisplay, AGInput },
  computed: {
    responseBody() {
      return responseBody(this.apiResponse);
    },
    statusClass() {
      if (
        this.apiResponse?.status_code >= 200 &&
        this.apiResponse?.status_code < 300
      ) {
        return 'tw-bg-green-700 tw-text-white';
      }
      if (
        this.apiResponse?.status_code >= 300 &&
        this.apiResponse?.status_code < 400
      ) {
        return 'tw-bg-blue-700 tw-text-white';
      }
      if (this.apiResponse?.status_code >= 400) {
        return 'tw-bg-red-700 tw-text-white';
      }

      return 'tw-bg-grey-700 tw-text-white';
    },
  },

  watch: {
    jsonPath() {
      if (!isEqual(this.jsonPath, this.jsonPathLocal)) {
        this.jsonPathLocal = this.jsonPath;
      }
    },
    jsonPathLocal() {
      if (!isEqual(this.jsonPath, this.jsonPathLocal)) {
        this.$emit('update:jsonPath', this.jsonPathLocal);
      }
    },
  },

  data() {
    return {
      jsonPathLocal: this.jsonPath || '$',
    };
  },
};
</script>
