<template>
  <div v-if="!currentUser.loading">
    <div class="tw-flex tw-mx-6 tw-my-3 tw-flex-col tw-gap-2">
      <div
        class="tw-py-2 tw-px-4 tw-bg-white tw-border tw-rounded-2xl tw-w-full"
      >
        <AGUserConfiguration
          :key="currentUser.getDetails"
          v-if="currentUser.getDetails.id"
        />
      </div>
    </div>
  </div>
  <AGLoader v-else />
</template>
<script>
import { authMixin } from 'src/mixins/auth';
import AGUserConfiguration from 'components/user/configuration.vue';
import AGLoader from 'components/utils/loader.vue';

import { currentUserStore } from 'src/stores/currentUser';

const currentUser = currentUserStore();

export default {
  name: 'AGSnippetsPage',
  components: { AGUserConfiguration, AGLoader },
  mixins: [authMixin],
  data() {
    return {
      currentUser: currentUser,
    };
  },
};
</script>
