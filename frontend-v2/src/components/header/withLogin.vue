<template>
  <nav
    class="slide-transition tw-flex tw-flex-col tw-bg-white tw-text-default/80 tw-justify-between tw-leading-4 tw-border-r"
    v-if="session.token != '' && !permissions.loading" @mouseenter="expanded = true" @mouseleave="expanded = false"
    :class="expanded ? 'tw-w-[254px]' : 'tw-w-[50px]'">
    <ul class="tw-flex tw-flex-col tw-items-start tw-justify-center tw-divide-y">
      <li class="tw-px-4 tw-py-2 tw-mx-auto">
        <router-link :to="{ path: '/questions/new', query: { data: null } }"><img src="/assets/images/logo.png"
            class="tw-h-12" :class="expanded ? 'tw-h-[35px] tw-w-[40px]' : 'tw-h-[24px] tw-w-[28px]'
              " /></router-link>
      </li>
      <li class="tw-w-full">
        <div :class="!expanded ? 'tw-flex tw-items-center tw-justify-center' : ''"
          class="tw-flex menu-item tw-px-4 tw-gap-2 tw-py-2 tw-items-center tw-cursor-pointer"
          @click="dashboardsMenuOpen = !dashboardsMenuOpen">
          <LayoutBoardIcon :size="iconSize" :class="expanded ? 'icon-primary' : ''" />
          <div v-if="expanded">Dashboards</div>

          <ChevronDownIcon size="16" v-if="!dashboardsMenuOpen && expanded" />
          <ChevronRightIcon size="16" v-if="dashboardsMenuOpen && expanded" />
        </div>
        <Transition>
          <div class="tw-bg-secondary" v-if="dashboardsMenuOpen && expanded">
            <router-link :to="'/dashboards/' + dashboard.id" v-for="dashboard in dashboards" :key="dashboard">
              <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item" v-close-popup>
                <LayoutBoardIcon size="28" class="icon-primary" />
                <span class="tw-w-[150px] tw-truncate">
                  {{ dashboard.title }}
                </span>
              </div>
            </router-link>
            <router-link to="/dashboards" v-close-popup>
              <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                <StackIcon size="28" class="icon-primary" />
                All Dashboards
              </div>
            </router-link>
          </div>
        </Transition>
      </li>
      <li class="hover:tw-text-default tw-w-full">
        <router-link to="/questions" class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
          :class="!expanded ? 'tw-flex tw-items-center tw-justify-center' : ''">
          <CircleLetterQIcon :size="iconSize" :class="expanded ? 'icon-primary' : ''" />
          <div v-if="expanded">Questions</div>
        </router-link>
      </li>
      <li class="hover:tw-text-default tw-w-full" v-if="permissions.canCreateQuestion">
        <router-link class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
          :class="!expanded ? 'tw-flex tw-items-center tw-justify-center' : ''"
          :to="{ path: '/questions/new', query: { data: null } }">
          <CirclePlusIcon :size="iconSize" :class="expanded ? 'icon-primary' : ''" />

          <div v-if="expanded">New Question</div>
        </router-link>
      </li>
      <li class="hover:tw-text-default tw-w-full" v-if="permissions.canCreateQuestion">
        <router-link to="/data_references/databases "
          :class="!expanded ? 'tw-flex tw-items-center tw-justify-center' : ''"
          class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2" v-if="!permissions.canEditQuestion">
          <DatabaseIcon :size="iconSize" :class="expanded ? 'icon-primary' : ''" />
          Data Reference
        </router-link>
      </li>

      <li class="tw-w-full">
        <div class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-px-4 tw-py-2 menu-item"
          v-if="permissions.canCreateQuestion" :class="!expanded ? 'tw-flex tw-items-center tw-justify-center' : ''"
          @click="moreMenuOpen = !moreMenuOpen">
          <CategoryIcon :size="iconSize" :class="expanded ? 'icon-primary' : ''" />
          <div v-if="expanded">More</div>
          <ChevronDownIcon size="16" v-if="!moreMenuOpen && expanded" />
          <ChevronRightIcon size="16" v-if="moreMenuOpen && expanded" />
        </div>
        <Transition>
          <div class="tw-bg-secondary" v-if="moreMenuOpen && expanded">
            <router-link to="/data_references/databases">
              <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item" v-close-popup>
                <DatabaseIcon size="28" class="icon-primary" />
                Data Reference
              </div>
            </router-link>
            <router-link to="/snippets/">
              <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item" v-close-popup
                v-if="permissions.canEditQuestion">
                <CodePlusIcon size="28" class="icon-primary" />
                Manage Snippets
              </div>
            </router-link>
          </div>
        </Transition>
      </li>
    </ul>
    <ul class="tw-flex tw-items-center tw-justify-center tw-w-full">
      <li class="tw-w-full" :class="!expanded ? 'tw-items-center' : ''" @click="userMenuOpen = !userMenuOpen">
        <Transition name="slide-opposite">
          <div class="tw-bg-secondary" v-if="userMenuOpen && expanded">
            <router-link to="/settings">
              <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" v-close-popup v-if="permissions.isAdmin">
                <SettingsIcon size="28" class="icon-primary" />
                Settings
              </div>
            </router-link>
            <router-link to="/user/configuration">
              <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" v-close-popup
                v-if="permissions.canEditQuestion">
                <UserIcon size="28" class="icon-primary" /> User Configurations
              </div>
            </router-link>
            <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" v-close-popup @click="logout">
              <LogoutIcon size="28" class="icon-primary" />
              Logout
            </div>
          </div>
        </Transition>
        <div class="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-px-2 tw-py-2 tw-cursor-pointer">
          <img class="tw-rounded-full tw-border-4" :class="expanded ? 'tw-h-[40px] tw-w-[40px]' : 'tw-h-[28px] tw-w-[28px]'
            " :src="currentUser.profile_pic" v-if="currentUser.profile_pic" />
          <div
            class="tw-rounded-full tw-border-4 tw-flex tw-items-center tw-justify-center tw-bg-secondary tw-font-semibold tw-text-default"
            :class="expanded ? 'tw-h-[40px] tw-w-[40px]' : 'tw-h-[28px] tw-w-[28px]'" v-if="!currentUser.profile_pic"> {{
              currentUserInitials }}</div>
          <div class="tw-flex tw-items-center tw-cursor-pointer" v-if="expanded">
            <div>{{ currentUser.full_name || currentUser.email }}</div>

            <ChevronDownIcon size="16" v-if="!userMenuOpen && expanded" />
            <ChevronRightIcon size="16" v-if="userMenuOpen && expanded" />
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
import { fetchDashboards } from 'src/apis/dashboards';
import { sessionStore } from 'stores/session';
import { currentUserStore } from 'stores/currentUser';
import { sidebarState } from 'src/stores/sidebarStore';
import {
  LayoutBoardIcon,
  SettingsIcon,
  ChevronDownIcon,
  DatabaseIcon,
  CodePlusIcon,
  UserIcon,
  CirclePlusIcon,
  ChevronRightIcon,
  StackIcon,
  CategoryIcon,
  CircleLetterQIcon,
  LogoutIcon,
} from 'vue-tabler-icons';
const session = sessionStore();
export default {
  name: 'AGWithLoginHeader',
  components: {
    LayoutBoardIcon,
    SettingsIcon,
    CirclePlusIcon,
    CategoryIcon,
    StackIcon,
    ChevronDownIcon,
    DatabaseIcon,
    CodePlusIcon,
    ChevronRightIcon,
    UserIcon,
    CircleLetterQIcon,
    LogoutIcon,
  },

  computed: {
    currentUser() {
      return this.permissions.getDetails;
    },
    iconSize() {
      return this.expanded ? 28 : window.screen.width > 1920 ? 28 : 24;
    },
    currentUserInitials() {
      return this.currentUser?.email && this.currentUser.email[0].toUpperCase();
    },
  },

  watch: {
    expanded() {
      this.sidebarState.setExpanded(this.expanded);
    },
  },

  data() {
    const currentUser = currentUserStore();
    return {
      sidebarState: sidebarState(),
      dashboards: [],
      permissions: currentUser,
      session: session,
      dashboardsMenuOpen: false,
      moreMenuOpen: false,
      userMenuOpen: false,
      expanded: false,
    };
  },

  mounted() {
    fetchDashboards(session.token, (dashboards, _loading) => {
      this.dashboards = dashboards;
    }, 5);
  },
  methods: {
    logout() {
      this.session.logout();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>
<style lang="scss" scoped>
.v-enter-active {
  transition: all 0.3s linear;
}

.v-leave-active {
  transition: all 0.3s linear;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-opposite-enter-active {
  transition: all 0.3s linear;
}

.slide-opposite-leave-active {
  transition: all 0.3s linear;
}

.slide-opposite-enter-from,
.slide-opposite-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
