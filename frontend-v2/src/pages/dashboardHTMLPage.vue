
<template>
  <div class="tw-h-full" v-html="html">

  </div>

</template>

<script>

import { useRoute } from 'vue-router';
import { fetchDashboardHTML } from 'src/apis/dashboards'
import { authMixin } from 'src/mixins/auth';
export default {
  name: 'dashboardPage',
  components: {},
  mixins: [authMixin],
  data() {
    return {
      html: null,
    }
  },
  async created() {
    const route = useRoute();
    const query = route.query;
    let dashboardID = route.params.id || null
    if (dashboardID) {
      fetchDashboardHTML(dashboardID, query.token, this.setHTML)
    }
  },

  methods: {
    setHTML(html) {
        this.html = html
    }
  }
}
</script>
