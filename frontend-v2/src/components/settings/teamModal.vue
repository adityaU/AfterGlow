<template>
  <teleport to="body">
    <AGModal class="!tw-fixed" size="small" :show="open" @update:show="(val) => $emit('update:show', val)">
      <template #header>
        <div class="tw-p-2 tw-text-2xl tw-font-semibold">Team Settings</div>
      </template>
      <template #body>
        <div class="tw-p-2 divide-y">
          <div class="label">Name</div>
          <AGInput v-model:value="teamLocal.name" placeholder="What do you call it?" debounce="300" />

          <div class="label tw-mt-2">Description</div>
          <AGInput v-model:value="teamLocal.description" placeholder="What is it about?" debounce="300" />

          <template v-if="teamLocal.id">
            <div class="label tw-mt-2">Users</div>
            <AGSearchSelect :selected="userEmails" :queryFunction="searchUsers" :options="emailOptions"
              @update:selected="selectUser" disableLocalSearch="true" description="search for users"
              class="tw-p-2 tw-pl-0" />

            <div class="label tw-mt-2">Accessible Databases</div>
            <AGSearchSelect :selected="databaseNames" :queryFunction="searchDatabases" :options="dbNameOptions"
              @update:selected="selectDb" disableLocalSearch="true" description="Search for databases"
              class="tw-p-2 tw-pl-0" />
          </template>
        </div>
      </template>
      <template #footer>
        <div class="tw-flex tw-justify-end tw-gap-1 tw-p-2">
          <AGButton class="tw-text-default hover:tw-bg-secondary tw-p-2"
            @clicked="($emit('update:open', false) || true) && $emit('refresh')">
            {{ this.teamLocal.id ? 'Done' : 'Cancel' }}
          </AGButton>
          <AGButton
            class="tw-text-white hover:tw-bg-primary/80 disabled:tw-bg-secondary disabled:tw-text-default tw-bg-primary tw-p-2"
            :class="teamLocal.name ? '' : 'disabled'" @clicked="save() || true" v-if="!this.teamLocal.id">
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
import AGInput from 'components/base/input.vue';
import isEqual from 'lodash/isEqual';

import AGSearchSelect from 'components/base/searchSelect.vue';
import {
  createTeam,
  saveTeam,
  removeUser,
  removeDatabase,
  addUser,
  addDatabase,
} from 'src/apis/team';
import { fetchUsersForTeam, fetchUsers } from 'src/apis/user';
import { fetchDatabasesForTeam, fetchDatabases } from 'src/apis/database';
import { sessionStore } from 'stores/session';
import cloneDeep from 'lodash/cloneDeep';

import { fetchRecipients } from 'src/apis/recipients';
export default {
  name: 'AGShareTeam',
  components: { AGModal, AGButton, AGSearchSelect, AGInput },
  props: ['open', 'team'],

  watch: {
    open() {
      if (this.open) {
        this.team && fetchUsersForTeam(this.team.id, this.setTeamUsers);
        fetchUsers(this.setUsers);
        this.team && fetchDatabasesForTeam(this.team.id, this.session.token, this.setTeamDatabases);
        fetchDatabases(this.session.token, this.setDatabases);
      }
    },
    teamLocal: {
      deep: true,
      handler(newv, oldv) {
        if (!isEqual(this.team, this.teamLocal)) {
          if (this.teamLocal.id) {

            saveTeam(this.teamLocal, (_t, loading) => {
              'pass';
            });
          }
          this.$emit('update:team', this.teamLocal);
        }
      },
    },
    team: {
      deep: true,
      handler() {
        if (!isEqual(this.team, this.teamLocal)) {
          this.teamLocal = cloneDeep(this.team || {});
        }
      },
    },
  },

  computed: {
    userEmails() {
      return this.users.map((u) => u.email);
    },

    databaseNames() {
      return this.databases?.map((u) => u.name);
    },
  },

  data() {
    return {
      teamLocal: cloneDeep(this.team || {}),
      id: cloneDeep(this.team?.id) || null,
      session: sessionStore(),
      usersLoaded: false,
      users: [],
      allUsers: [],
      userEmailIDMapping: {},
      emailOptions: [],
      userQ: null,
      databasesLoaded: false,
      databases: [],
      allDatabases: [],
      databaseNameIDMapping: {},
      dbNameOptions: [],
      dbQ: null,
    };
  },

  methods: {
    setTeamDatabases(databases) {
      this.databases = databases;
    },
    setTeamUsers(users) {
      this.users = users;
    },
    setDatabases(databases, loading) {
      this.allDatabases = databases;
      databases?.forEach((d) => {
        this.databaseNameIDMapping[d.name] = d;
      });
      if (!loading) {
        this.databasesLoaded = true;
      }
    },
    setUsers(users, loading) {
      this.allUsers = users;
      users?.forEach((u) => {
        this.userEmailIDMapping[u.email] = u;
      });
      if (!loading) {
        this.usersLoaded = true;
      }
    },
    save() {
      if (this.teamLocal.id) {
        return;
      }
      createTeam(this.teamLocal, (_t, loading) => {
        if (!loading) {
          this.$emit('refresh');
          this.$emit('update:open', false);
        }
      });
    },
    searchUsers(q) {
      this.userQ = q;
      this.emailOptions = this.allUsers
        .filter((u) => u.email.toLowerCase().match(q.toLowerCase()))
        .map((u) => u.email);
      this.emailOptions.push(q);
    },
    searchDatabases(q) {
      this.dbNameOptions = this.allDatabases
        .filter((d) => d.name.toLowerCase().match(q.toLowerCase()))
        .map((u) => u.name);
    },
    selectDb(selected) {
      const names = this.databases.map((u) => u.name);
      const toBeAdded = selected.filter((s) => names.indexOf(s) < 0);
      const toBeDeleted = names.filter((e) => selected.indexOf(e) < 0);
      toBeDeleted.forEach((name) => {
        const db = this.databaseNameIDMapping[name];
        if (db) {
          removeDatabase(this.teamLocal.id, db.id, () => {
            'pass';
          });
        }
      });

      toBeAdded.forEach((name) => {
        const db = this.databaseNameIDMapping[name];
        if (db) {
          addDatabase(this.teamLocal.id, db.id, () => {
            'pass';
          });
        }
      });
      this.databases = selected
        ?.map((s) => this.databaseNameIDMapping[s])
        .filter((d) => d);
    },
    selectUser(selected) {
      const emails = this.users.map((u) => u.email);
      const toBeAdded = selected.filter((s) => emails.indexOf(s) < 0);
      const toBeDeleted = emails.filter((e) => selected.indexOf(e) < 0);
      toBeDeleted.forEach((email) => {
        const user = this.userEmailIDMapping[email];
        if (user) {
          removeUser(this.teamLocal.id, user.id, () => {
            'pass';
          });
        }
      });

      toBeAdded.forEach((email) => {
        const user = this.userEmailIDMapping[email];
        if (user) {
          addUser(this.teamLocal.id, user.id, () => {
            'pass';
          });
        }
      });

      this.users = selected
        ?.map((s) => this.userEmailIDMapping[s])
        .filter((u) => u);
    },
  },
};
</script>
