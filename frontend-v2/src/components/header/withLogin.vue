<template>
  <nav
    class="tw-flex tw-bg-white tw-items-center tw-border-b tw-text-default/80 tw-justify-between tw-leading-4 tw-px-4"
  >
    <ul class="tw-flex tw-items-center">
      <li class="tw-p-1 tw-py-2">
        <router-link :to="{ path: '/questions/new', query: { data: null } }"
          ><img src="/assets/images/logo.png" class="tw-h-12"
        /></router-link>
      </li>
      <li class="tw-px-2 hover:tw-text-default">
        <div class="tw-flex tw-items-center tw-cursor-pointer">
          <div>Dashboards</div>

          <ChevronDownIcon size="16" />
        </div>
        <q-menu
          flat="true"
          transition-show="jump-down"
          transition-hide="jump-up"
          max-height="500px"
          class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-auto"
          @show="menuShow"
          @keydown="onKeydown"
        >
          <router-link
            :to="'/dashboards/' + dashboard.id"
            v-for="dashboard in dashboards"
            :key="dashboard"
          >
            <div
              class="menu-item tw-py-2 tw-flex tw-items-center tw-border-b-0"
              v-close-popup
            >
              <LayoutBoardIcon size="28" class="icon-primary" />
              {{ dashboard.title }}
            </div>
          </router-link>
          <router-link
            to="/dashboards"
            class="menu-item tw-border-t tw-py-3"
            v-close-popup
          >
            All Dashboards</router-link
          >
        </q-menu>
      </li>
      <li class="tw-px-2 hover:tw-text-default">
        <router-link to="/questions"> Questions </router-link>
      </li>
      <li
        class="tw-px-2 hover:tw-text-default"
        v-if="permissions.canCreateQuestion"
      >
        <router-link :to="{ path: '/questions/new', query: { data: null } }">
          New Question</router-link
        >
      </li>
      <li
        class="tw-px-2 hover:tw-text-default"
        v-if="!permissions.canEditQuestion"
      >
        <router-link to="/data_references/databases">
          Data Reference
        </router-link>
      </li>

      <li class="tw-p-2 tw-py-4" v-else>
        <div class="tw-flex tw-items-center tw-cursor-pointer">
          More
          <ChevronDownIcon size="16" />
        </div>
        <q-menu
          flat="true"
          transition-show="jump-down"
          transition-hide="jump-up"
          max-height="500px"
          class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
          @show="menuShow"
          @keydown="onKeydown"
        >
          <router-link to="/data_references/databases">
            <div
              class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]"
              v-close-popup
            >
              <DatabaseIcon size="28" class="icon-primary" />
              Data Reference
            </div>
          </router-link>
          <router-link to="/snippets/">
            <div
              class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]"
              v-close-popup
              v-if="permissions.canEditQuestion"
            >
              <CodePlusIcon size="28" class="icon-primary" />
              Manage Snippets
            </div>
          </router-link>
        </q-menu>
      </li>
    </ul>
    <ul class="tw-flex tw-items-center">
      <li class="tw-p-2 tw-py-4">
        <div class="tw-flex tw-items-center tw-cursor-pointer">
          <div>{{ currentUser.full_name || currentUser.email }}</div>

          <ChevronDownIcon size="16" />
        </div>
        <q-menu
          flat="true"
          transition-show="jump-down"
          transition-hide="jump-up"
          max-height="500px"
          class="tw-rounded-sm tw-shadow-sm tw-border tw-overflow-hidden"
          @show="menuShow"
          @keydown="onKeydown"
        >
          <router-link to="/settings">
            <div
              class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]"
              v-close-popup
              v-if="permissions.isAdmin"
            >
              <SettingsIcon size="28" class="icon-primary" />
              Settings
            </div>
          </router-link>
          <div
            class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]"
            v-close-popup
            @click="logout"
          >
            Logout
          </div>
        </q-menu>
      </li>
    </ul>
  </nav>
</template>

<script>
import { fetchDashboards } from 'src/apis/dashboards';
import { sessionStore } from 'stores/session';
import { currentUserStore } from 'stores/currentUser';
import {
  LayoutBoardIcon,
  SettingsIcon,
  ChevronDownIcon,
  DatabaseIcon,
  CodePlusIcon,
} from 'vue-tabler-icons';
const session = sessionStore();
export default {
  name: 'AGWithLoginHeader',
  components: {
    LayoutBoardIcon,
    SettingsIcon,
    ChevronDownIcon,
    DatabaseIcon,
    CodePlusIcon,
  },

  computed: {
    currentUser() {
      return this.permissions.getDetails;
    },
  },

  data() {
    const currentUser = currentUserStore();
    return {
      dashboards: [],
      permissions: currentUser,
      session: session,
    };
  },

  mounted() {
    fetchDashboards(session.token, (dashboards, _loading) => {
      this.dashboards = dashboards;
    });
  },
  methods: {
    logout() {
      this.session.logout();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>
