<template>
 <div class="tw-flex tw-flex-col tw-w-full"> 
    <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase tw-text-right tw-py-2" v-if="teams?.length > 0" @click="openTeamModal = true" > + Add New Team </div> 
  <div class="tw-flex tw-flex-col tw-mx-3 tw-gap-1 tw-w-full">
    <AGLoader class="tw-my-6" text="Fetching teams" v-if="loading" />
    <div class="tw-border tw-flex tw-items-center tw-py-2 tw-px-4 tw-gap-2 tw-bg-white tw-rounded-sm tw-shadow-sm"  v-for="team in teams" :key="team">
      <UsersIcon size="32" class="icon-primary tw-rounded-sm tw-shadow-sm" />
      <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
        <div class="tw-leading-3 tw-font-semibold"> {{team.name}}</div>
        <div class="note tw-leading-2" >{{team.description}}</div>
      </div>
      <div class="tw-flex tw-text-sm tw-flex-col tw-flex-1 tw-items-center">
        <div class="note">{{team.accessible_databases.data.length}} Accessible Databases</div> 
        <div class="note"> {{team.users.data.length}} Users </div> 
      </div>
      <div class="tw-flex tw-gap-2 tw-text-sm tw-flex-1  tw-justify-end">
        <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase" @click="(openTeamEditModal = true) && (editingTeam = team)">Edit </div> 
        <div class="tw-cursor-pointer tw-font-semibold tw-text-red-700 tw-uppercase" @click="openDeleteTeamModal = true" > Delete </div> 
      </div>
      <AGDeleteEntityModal v-model:open="openDeleteTeamModal" entityName="team" :entityID="team.id" @deleted="fetchTeams" />
    </div>

    <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-white tw-p-4 tw-rounded-sm tw-shadow-sm tw-border " v-if="teams?.length === 0">
      <div class=""> You do not have any teams yet. </div> 
      <div class="tw-cursor-pointer tw-font-semibold tw-text-primary tw-uppercase" @click="openTeamModal = true"> + Add New Team </div> 
    </div>
  </div>
      <AGTeamModal v-model:open="openTeamModal" @refresh="fetchTeams()" />
      <AGTeamModal v-model:open="openTeamEditModal" @refresh="fetchTeams()" :team="editingTeam" />
 </div>
</template>
<script>


import {UsersIcon} from 'vue-tabler-icons'
import AGLoader from 'components/utils/loader.vue'
import AGDeleteEntityModal from 'components/utils/deleteEntityModal.vue'
import AGTeamModal from 'components/settings/teamModal.vue'
import {fetchTeams} from 'src/apis/team'
export default {
  name: "AGSettingsteams",
  components: {AGLoader, UsersIcon, AGDeleteEntityModal, AGTeamModal},
  mounted(){
    this.fetchTeams()
  },

  data(){
    return {
      loading: false,
      teams: [],
      openDeleteTeamModal: false,
      openTeamModal: false,
      openTeamEditModal: false,
      editingTeam: null,
    }
  },
  methods: {
    fetchTeams(){   
      fetchTeams(this.setTeams)
    },
    setTeams(teams, loading){
      this.teams = teams || []
      this.loading = loading
    }
  }
}
</script>
