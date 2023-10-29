<template>
  <div>
    <WithLoginHeader />
    <div class="tw-flex tw-mx-6 tw-my-3 tw-flex-col tw-gap-2">
      <div
        class="tw-py-2 tw-px-4 tw-bg-white tw-border tw-rounded-sm tw-shadow-sm tw-w-full"
      >
        <AGUserConfiguration
          :key="currentUser.getDetails"
          v-if="currentUser.getDetails.id"
        />
      </div>
    </div>

    <AGFooter />
  </div>
</template>
<script>
import { authMixin } from 'src/mixins/auth';
import WithLoginHeader from 'components/header/withLogin.vue';
import AGFooter from 'components/footer/static.vue';
import AGUserConfiguration from 'components/user/configuration.vue';

import { currentUserStore } from 'src/stores/currentUser';

const currentUser = currentUserStore();

export default {
  name: 'AGSnippetsPage',
  components: { WithLoginHeader, AGUserConfiguration, AGFooter },
  mixins: [authMixin],
  data() {
    return {
      currentUser: currentUser,
    };
  },
};
</script>
