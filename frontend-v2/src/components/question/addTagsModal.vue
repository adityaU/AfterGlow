<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="small"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
      :loading="loading"
      :loadingMessage="loadingMessage"
      bodyClass="tw"
    >
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">Add Tags</div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <div class="note">
            Tip: You can create new tags by typing the name of tag in search of
            select box and then clicking add from dropdown
          </div>
          <Multiselect
            :classes="multiselectCss"
            mode="tags"
            :object="true"
            :modelValue="
              tagsLocal?.map((item) => ({
                value: item.id,
                label: item.name,
              })) || []
            "
            @update:modelValue="
              tagsLocal = $event.map((option) => option.value)
            "
            placeholder="Search emails or teams"
            :close-on-select="false"
            :filter-results="false"
            :min-chars="1"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            :options="searchTags"
            createOption
            @create="addNewTag"
          />
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="$emit('update:open', false)"
          >
            Cancel
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            @clicked="($emit('save') || true) && $emit('update:open', false)"
          >
            Save
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>
</template>
<script>
import AGModal from 'components/utils/modal.vue';
import AGButton from 'components/base/button.vue';
import isEqual from 'lodash/isEqual';

import Multiselect from '@vueform/multiselect';

import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';
import { fetchTags, createTag, searchTags } from 'src/apis/tags';
import { fetchRecipients } from 'src/apis/recipients';
import { autoTextColor, getRandomColor } from 'src/helpers/colorGenerator';
import multiselectCss from 'src/helpers/multiselectCss';
export default {
  name: 'AGSharetags',
  components: { AGModal, AGButton, Multiselect },
  props: ['open', 'tags', 'tagsName'],

  watch: {
    q() {
      if (!this.q) {
        this.addTagOption = null;
        return;
      }
      const allTagNames = this.allTags.map((t) => t.name);
      if (allTagNames.indexOf('q') < 0) {
        this.addTagOption = {
          name: this.q,
        };
      } else {
        this.addTagOption = null;
      }
    },
    tagsLocal: {
      deep: true,
      handler(newv, oldv) {
        this.$emit('update:tags', this.tagsLocal);
      },
    },
    tags: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(oldv, newv)) {
          this.tagsLocal = this.tags;
        }
      },
    },
  },
  data() {
    return {
      emailOptions: [],
      tagsLocal: cloneDeep(this.tags || {}),
      session: sessionStore(),
      allTags: [],
      q: '',
      addTagOption: null,
      multiselectCss: multiselectCss,
    };
  },

  mounted() {
    fetchTags(this.setAllTags);
  },

  methods: {
    autoTextColor(color) {
      return autoTextColor(color);
    },
    setAllTags(tags, _loading) {
      this.allTags = tags;
    },
    select(v) {
      const selectedTags = this.tagsLocal.map((t) => t.name);
      const index = selectedTags.indexOf(v.name);
      if (index < 0) {
        this.tagsLocal.push(v);
      } else {
        this.tagsLocal.splice(index, 1);
      }
    },
    updateAllTags(tag, _loading) {
      if (tag) {
        this.allTags.push(tag);
        this.select(tag);
      }
    },
    async addNewTag(tag) {
      if (!tag) return true;
      await createTag(
        {
          name: tag.value,
        },
        (tag) => {
          this.tagsLocal.push(tag);
        }
      );
      return false;
    },
    searchTags(q) {
      return searchTags(q, (tags) => {
        return tags.map((tag) => {
          return { value: tag, label: tag.name };
        });
      });
    },
  },
};
</script>
