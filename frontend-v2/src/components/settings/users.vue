
<template>
  <div class="tw-flex tw-flex-col tw-w-full">
    <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase tw-text-right tw-py-2"
      @click="openUserNewModal = true"> + Add New Users </div>
    <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-2 tw-w-full">
      <AGLoader class="tw-my-6" text="Fetching users" v-if="loading" />
      <div class="tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-border-l-4 tw-rounded-sm tw-py-4 tw-px-4"
        :class="user.is_deactivated ? 'tw-bg-default/10' : 'tw-bg-white'" v-for="user in users" :key="user">
        <userIcon size="32" class="icon-primary" />
        <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
          <div class="tw-leading-3 tw-font-semibold"> {{ user.full_name || user.email }}</div>
          <div class="note tw-leading-2" v-if="user.full_name">{{ user.email }}</div>
        </div>
        <div class="tw-flex tw-gap-2 tw-text-sm">
          <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase" v-if="!user.is_deactivated"
            @click="((editingUser = user) || true) && (openUserEditModal = true)">Edit </div>
          <div class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase" v-if="!user.is_deactivated"
            @click="((user.is_deactivated = true) || true) && deactivate(user)">Deactivate </div>
          <div class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase" v-if="user.is_deactivated"
            @click="((user.is_deactivated = false) || true) && activate(user)">Activate </div>
        </div>
      </div>
      <AGUserEditModal v-model:open="openUserEditModal" @refresh="fetchUsers()" :key="editingUser" :user="editingUser" />
      <AGCreateUsersModal v-model:open="openUserNewModal" @refresh="fetchUsers()" />
    </div>
  </div>
</template>
<script>


import { UserIcon } from 'vue-tabler-icons'
import AGLoader from 'components/utils/loader.vue'
import AGUserEditModal from 'components/settings/editUserModal.vue'
import AGCreateUsersModal from 'components/settings/createUsers.vue'
import { fetchUsers, deactivateUser, activateUser } from 'src/apis/user'
export default {
  name: "AGSettingsUsers",
  components: { AGLoader, UserIcon, AGUserEditModal, AGCreateUsersModal },
  mounted() {
    this.fetchUsers()
  },

  data() {
    return {
      loading: false,
      users: [],
      editingUser: null,
      openUserEditModal: false,
      openUserNewModal: false,
    }
  },
  methods: {
    fetchUsers() {
      fetchUsers(this.setUsers)
    },
    setUsers(users, loading) {
      this.users = users || []
      this.loading = loading
    },
    deactivate(user) {
      deactivateUser(user.id, () => { 'pass' })
    },
    activate(user) {
      activateUser(user.id, () => { 'pass' })
    }
  }
}
</script>
