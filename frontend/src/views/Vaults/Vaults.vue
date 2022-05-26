<template>
  <div class="vaults">
    <div v-for="vault in vaults" :key="vault" class="vault">
      <div @click="$router.push({name: 'vaultDashboard', params: { id: vault.id }})">
        <p>{{ vault.vault_name }}</p>
        <p>{{ vault.items_amount }} Items</p>
        <p class="vault-description">{{ vault.vault_description }}</p>
      </div>
      <div class="settings">
        <router-link :to="{ name: 'editVault', params: { id: vault.id, vault_name: vault.vault_name, vault_description: vault.vault_description }}">
          <img src="@/assets/settings.png" alt="A settings icon.">
        </router-link>
      </div>
    </div>
    <div class="create-vault-cta">
      <router-link to="/vaults/create">
        <img src="@/assets/add.png" alt="An add icon.">
      </router-link>
    </div>
  </div>
  <li class="backend-errors" v-for="error in backendErrors" :key="error">
    {{ error }}
  </li>
  <router-view></router-view>
</template>

<script>

import {api} from "../../services/api";
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "Vaults",
  data() {
    return {
      backendErrors: [],
    }
  },
  mounted() {
    this.fetchVaultsOrFail();
  },
  computed: mapState([
    "vaults"
  ]),
  methods: {
    async fetchVaultsOrFail() {
      let request = await api.vault.fetchAll();

      if(request instanceof Error) {
        this.backendErrors.push(request.message);
      }
    }
  }
}
</script>

<style scoped>

</style>
