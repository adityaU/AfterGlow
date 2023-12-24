<template>
  <teleport to="body">
    <AGModal
      class="!tw-fixed"
      size="small"
      :show="open"
      @update:show="(val) => $emit('update:show', val)"
    >
      <template #header>
        <div class="tw-flex tw-items-center tw-px-4 tw-gap-1 tw-py-2">
          <UserIcon size="48" class="icon-primary !tw-py-2 !tw-px-1" />
          <div class="tw-text-2xl tw-font-semibold tw-flex-1">
            {{ userLocal.full_name || userLocal.email }}
            <div class="note" v-if="userLocal.full_name">
              {{ userLocal.email }}
            </div>
          </div>

          <div
            class="tw-cursor-pointer tw-bg-primary tw-text-white tw-text-sm tw-px-2 tw-py-0.5 tw-rounded-full"
            v-if="permissionSet"
          >
            {{ permissionSet.name }}

            <q-menu
              flat="true"
              transition-show="scale"
              transition-hide="scale"
              max-height="800px"
              class="tw-rounded-2xl tw-border tw-overflow-hidden"
              @show="menuShow"
              @keydown="onKeydown"
            >
              <SelectOptions
                :options="permissionSets"
                :selected="permissionSet"
                :menuShow="menuShow"
                @select="saveUserPS"
                displayKey="name"
                areOptionObjects="true"
                hideOnClick="true"
                hideSearch="true"
              />
            </q-menu>
          </div>
        </div>
      </template>
      <template #body>
        <div class="tw-p-4">
          <div class="tw-p-2 divide-y">
            <div class="label tw-mt-2">Teams</div>
            <AGSearchSelect
              :selected="teamNames"
              :queryFunction="searchTeams"
              :options="teamNameOptions"
              @update:selected="selectTeam"
              disableLocalSearch="true"
              description="search for teams"
              class="tw-p-2 tw-pl-0"
            />
          </div>
          <div class="tw-p-2 divide-y tw-mt-2">
            <div class="tw-font-semibold tw-text-lg">Settings</div>

            <div class="label">Maximum Number of Rows in Exports/Reports</div>
            <AGInput
              v-model:value="downloadLimitSettings.value"
              v-if="downloadLimitSettings"
              :placeholder="
                'How many rows can ' + userLocal.full_name + ' download?'
              "
              type="number"
              debounce="300"
            />
            <div class="note">
              This overrides the Global and Organization Level Value
            </div>

            <AGBool
              v-model:value="canDownloadSetting.value"
              v-if="canDownloadSetting"
              label="Can Download Reports"
              class="label tw-mt-2"
            />
            <div class="note">
              Use this option to disable downloads for this user. This overrides
              the Global and Organization Level Value
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton
            class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')"
          >
            {{ this.userLocal.id ? 'Done' : 'Cancel' }}
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="userLocal.name ? '' : 'disabled'"
            @clicked="save() || true"
            v-if="!this.userLocal.id"
          >
            Create
          </AGButton>
        </div>
      </template>
    </AGModal>
  </teleport>
</template>
<script>
import AGModal from 'components/utils/modal.vue';
import AGButton from 'components/base/button.vue';
import AGBool from 'components/base/bool.vue';
import AGInput from 'components/base/input.vue';
import SelectOptions from 'components/base/selectOptions.vue';
import isEqual from 'lodash/isEqual';

import AGSearchSelect from 'components/base/searchSelect.vue';
import {
  removeUser,
  addUser,
  fetchTeamsByUser,
  fetchTeams,
} from 'src/apis/team';
import {
  fetchUserSettings,
  saveUserSettings,
  fetchPermissionSets,
  fetchUserPermissionSet,
  updateUserPermissionSetForUser,
  // saveUserWithPS,
} from 'src/apis/user';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';
import { UserIcon } from 'vue-tabler-icons';

export default {
  name: 'AGShareUser',
  components: {
    AGModal,
    AGButton,
    AGSearchSelect,
    AGInput,
    AGBool,
    UserIcon,
    SelectOptions,
  },
  props: ['open', 'user'],

  watch: {
    permissionSets() {
      const psIDs = this.userLocal?.permission_sets?.data?.map((ps) => ps.id);
      if (psIDs) {
        const psID = psIDs[0];
        const ps = this.permissionSets.filter((ps) => ps.id === psID);
        this.permissionSet = ps[0];
      }
    },
    userLocal: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.user, this.userLocal)) {
          this?.userLocal.id &&
            this.userLocal?.id != this.user.id &&
            fetchUserSettings(this.userLocal.id, this.setSettings);
          if (this.userLocal.id) {
            saveUser(this.userLocal, (_t, loading) => {
              'pass';
            });
          }
          this.$emit('update:user', this.userLocal);
        }
      },
    },
    downloadLimitSettings: {
      deep: true,
      handler() {
        if (this.downloadLimitSettings?.id) {
          saveUserSettings(this.downloadLimitSettings, () => {
            'pass';
          });
        }
      },
    },
    canDownloadSetting: {
      deep: true,
      handler() {
        if (this.canDownloadSetting?.id) {
          saveUserSettings(this.canDownloadSetting, () => {
            'pass';
          });
        }
      },
    },
    user: {
      deep: true,
      handler() {
        if (!isEqual(this.user, this.userLocal)) {
          this.userLocal = cloneDeep(this.user || {});
        }
      },
    },
  },

  computed: {
    teamNames() {
      return this.teams.map((u) => u.name);
    },
  },

  mounted() {
    if (this.open) {
      fetchTeamsByUser(this.id, this.setTeams);
      fetchTeams(this.setAllTeams);
      fetchPermissionSets(this.setPermissionSets);
      fetchUserPermissionSet(this.id, this.setUserPermissionSet),
        this.userLocal?.id &&
          fetchUserSettings(this.userLocal.id, this.setSettings);
    }
  },

  data() {
    return {
      userLocal: cloneDeep(this.user || {}),
      id: cloneDeep(this.user?.id) || null,
      session: sessionStore(),
      teams: [],
      allTeams: [],
      teamIDMapping: {},
      teamNameOptions: [],
      downloadLimitSettings: null,
      canDownloadSetting: null,
      permissionSets: [],
      permissionSet: null,
    };
  },

  methods: {
    setPermissionSets(ps, _loading) {
      this.permissionSets = ps;
    },
    setSettings(settings, _loading) {
      settings?.forEach((s) => {
        if (s.name === 'MAX_DOWNLOAD_LIMIT') {
          this.downloadLimitSettings = s;
        }
        if (s.name === 'DOWNLOAD_ALLOWED') {
          this.canDownloadSetting = s;
        }
      });
    },

    setAllTeams(teams, loading) {
      // this.allTeams = teams;
      this.allTeams = teams || [];

      teams?.forEach((u) => {
        this.teamIDMapping[u.name.trim()] = u;
      });
    },
    setTeams(teams, loading) {
      // this.allTeams = teams;
      this.teams = teams || [];
    },
    setUserPermissionSet(ps, _loading) {
      this.permissionSet = ps[0] || {};
    },
    save() {
      if (this.userLocal.id) {
        return;
      }
      createUser(this.userLocal, (_t, loading) => {
        if (!loading) {
          this.$emit('refresh');
          this.$emit('update:open', false);
        }
      });
    },
    searchTeams(q) {
      this.teamNameOptions = this.allTeams
        .filter((u) => u.name.toLowerCase().match(q.toLowerCase()))
        .map((u) => u.name);
    },

    saveUserPS(ps) {
      this.permissionSet = ps;
      updateUserPermissionSetForUser(this.userLocal.id, ps.id, () => {
        'pass';
      });
    },
    selectTeam(selected) {
      const names = this.teams.map((u) => u.name);
      const toBeAdded = selected.filter((s) => names.indexOf(s) < 0);
      const toBeDeleted = names.filter((e) => selected.indexOf(e) < 0);
      toBeDeleted.forEach((name) => {
        const team = this.teamIDMapping[name.trim()];
        if (team) {
          removeUser(team.id, this.userLocal.id, () => {
            'pass';
          });
        }
      });

      toBeAdded.forEach((name) => {
        const team = this.teamIDMapping[name.trim()];
        if (team) {
          addUser(team.id, this.userLocal.id, () => {
            'pass';
          });
        }
      });

      this.teams = selected
        ?.map((s) => this.teamIDMapping[s.trim()])
        .filter((u) => u);
    },
  },
};
</script>
