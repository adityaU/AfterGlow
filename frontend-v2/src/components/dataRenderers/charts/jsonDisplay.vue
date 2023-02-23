<template>
  <div class="">
    <template v-if="isArray">
      <div class="tw-flex tw-items-center tw-gap-2">
        <ChevronRightIcon
          size="16"
          v-if="!isOpen"
          @click="isOpen = !isOpen"
          class="tw-cursor-pointer"
        />
        <ChevronDownIcon
          size="16"
          v-if="isOpen"
          @click="isOpen = !isOpen"
          class="tw-cursor-pointer"
        />
        <div>[</div>

        <template v-if="!isOpen">
          <div>...</div>
          <div>] ,</div>
        </template>
      </div>

      <template v-if="isOpen">
        <div
          :style="{ 'padding-left': level + 'em' }"
          v-for="element in jsonAttr.slice(0, 10)"
          :key="element"
        >
          <AGJsonDisplay
            :jsonAttr="element"
            :level="+level + 1"
            :jsonPath="jsonPath + '[*]'"
            @updateJsonPath="(v) => $emit('updateJsonPath', v)"
          />
        </div>
        <div class="note" v-if="jsonAttr.length > 10">
          ... has more than 10 elements. redacted for performance
        </div>
        ]
      </template>
    </template>
    <template v-if="isObject">
      <div :style="{ 'padding-left': level + 'em' }">
        <div class="tw-flex tw-items-center tw-gap-2">
          <ChevronRightIcon
            size="16"
            v-if="!isOpen"
            @click="isOpen = !isOpen"
            class="tw-cursor-pointer"
          />
          <ChevronDownIcon
            size="16"
            v-if="isOpen"
            @click="isOpen = !isOpen"
            class="tw-cursor-pointer"
          />
          <div>{</div>

          <template v-if="!isOpen">
            <div>...</div>
            <div>}</div>
            <template v-if="i + 1 != jsonAttr.length">,</template>
          </template>
        </div>
        <template v-if="isOpen">
          <div
            class="tw-flex"
            v-for="entry in Object.entries(jsonAttr)"
            :key="entry"
            :style="{ 'padding-left': level + 'em' }"
          >
            <div
              class="tw-flex-shrink-0 tw-font-semibold tw-flex"
              @click="getJsonPath(entry[0])"
            >
              <div class="tw-cursor-pointer tw-text-primary">
                {{ entry[0] }}
              </div>
              :
            </div>
            <AGJsonDisplay
              class="tw-pl-4"
              :jsonAttr="entry[1]"
              :level="level"
              :jsonPath="jsonPath + '.' + entry[0]"
              @updateJsonPath="(v) => $emit('updateJsonPath', v)"
            />
            ,
          </div>

          } ,
        </template>
      </div>
    </template>
    <template v-if="isData">
      <span v-if="isUrl">
        <a class="tw-text-primary tw-cursor-pointer" href="jsonAttr">
          "{{ jsonAttr }}"
        </a></span
      >
      <span class="tw-text-blue-700" v-if="isNumber"> {{ jsonAttr }}</span>
      <span class="tw-text-red-700" v-if="isBool"> {{ jsonAttr }}</span>
      <span class="tw-text-teal-700" v-if="isString">"{{ jsonAttr }}"</span>
      <span v-if="isNull">null</span>
    </template>
  </div>
</template>

<script>
import { isObject } from 'lodash';

import { defineAsyncComponent } from 'vue';

import { ChevronDownIcon, ChevronRightIcon } from 'vue-tabler-icons';

const AsyncComp = defineAsyncComponent(() => import('./jsonDisplay.vue'));
export default {
  name: 'AGApiResponseDisplay',
  props: ['jsonAttr', 'level', 'jsonPath'],

  beforeCreate: function () {
    this.$options.components = this.$options.components || {};
    this.$options.components.AGJsonDisplay = AsyncComp;
  },

  data() {
    return {
      isOpen: true,
    };
  },

  components: { ChevronRightIcon, ChevronDownIcon },

  mounted() {
    this.isOpen = true;
  },

  computed: {
    isUrl() {
      return (
        this.isData &&
        typeof this.jsonAttr == 'string' &&
        /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(this.jsonAttr)
      );
    },
    isNull() {
      return this.isData && this.jsonAttr === null;
    },
    isBool() {
      return this.isData && typeof this.jsonAttr == 'boolean';
    },
    isString() {
      return this.isData && typeof this.jsonAttr == 'string' && !this.isUrl;
    },
    isNumber() {
      return this.isData && typeof this.jsonAttr == 'number';
    },
    isObject() {
      return isObject(this.jsonAttr) && !this.isArray;
    },
    isArray() {
      return Array.isArray(this.jsonAttr);
    },
    isData() {
      return !this.isObject && !this.isArray;
    },
  },

  methods: {
    getJsonPath(path) {
      this.$emit('updateJsonPath', this.jsonPath + '.' + path);
    },
  },
};
</script>
