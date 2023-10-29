
<template>
  <div class="tw-flex tw-flex-col tw-w-full">
    <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase tw-text-right tw-py-2"
      v-if="organizations?.length > 0" @click="((openOrgNewModal = true) || true) && (editingOrg = null)"> + Add New
      Organization </div>
    <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-2 tw-w-full">
      <AGLoader class="tw-my-6" text="Fetching organizations" v-if="loading" />
      <div class="tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-rounded-sm tw-shadow-sm tw-border-l-4"
        :class="organization.is_deactivated ? 'tw-bg-default/10' : 'tw-bg-white'" v-for="organization in organizations"
        :key="organization">
        <AffiliateIcon size="32" class="icon-primary tw-rounded-sm tw-shadow-sm" />
        <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
          <div class="tw-leading-3 tw-font-semibold"> {{ organization.name }}</div>
          <div class="note tw-leading-2">{{ organization.google_domain }}</div>
        </div>
        <div class="tw-flex tw-gap-2 tw-text-sm">
          <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase"
            @click="((editingOrg = organization) || true) && (openOrgEditModal = true)">Edit </div>
          <div class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase" v-if="!organization.is_deactivated"
            @click="(organization.is_deactivated = true) && save(organization)">Deactivate </div>
          <div class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase" v-if="organization.is_deactivated"
            @click="((organization.is_deactivated = false) || true) && save(organization)">Activate </div>
        </div>
      </div>
      <div
        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-white tw-p-4 tw-rounded-sm tw-shadow-sm tw-border "
        v-if="organizations?.length === 0">
        <div class=""> You do not have any organizations yet. </div>
        <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase"
          @click="((openOrgNewModal = true) || true) && (editingOrg = null)"> Add New Organization </div>

      </div>
    </div>

    <AGOrgModal v-model:open="openOrgNewModal" @refresh="fetchOrganizations()" :key="editingOrg" />
    <AGOrgModal v-model:open="openOrgEditModal" @refresh="fetchOrganizations()" :org="editingOrg" :key="editingOrg" />
  </div>
</template>
<script>
import { AffiliateIcon } from 'vue-tabler-icons'
import AGLoader from 'components/utils/loader.vue'
import { fetchOrganizations, saveOrganization } from 'src/apis/organization'
import AGOrgModal from 'components/settings/orgModal.vue'
export default {
  name: "AGSettingsOrganizations",
  components: { AGLoader, AffiliateIcon, AGOrgModal },
  mounted() {
    this.fetchOrganizations()
  },

  data() {
    return {
      loading: false,
      organizations: [],
      editingOrg: null,
      openOrgNewModal: false,
      openOrgEditModal: false
    }
  },
  methods: {
    fetchOrganizations() {

      fetchOrganizations(this.setOrganizations)
    },
    setOrganizations(organizations, loading) {
      this.organizations = organizations || []
      this.loading = loading
    },
    save(org) {
      saveOrganization(org, () => { 'pass' })
    }
  }
}
</script>
