<template>
  <div class="vaults">
    <div v-for="vault in vaults" :key="vault" class="vault">
      <p>{{ vault.name }}</p>
      <p>37 Items</p>
      <p class="vault-description">{{ vault.description }}</p>
    </div>
    <div class="create-vault-cta">
      <router-link to="/vaults/create">
        <img src="@/assets/add.png" alt="An add icon.">
      </router-link>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>

import axios from "axios";
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Vaults",
  data() {
    return {
      vaults: JSON,
      backendErrors: [],
    }
  },
  mounted() {
    this.fetchVaults();
  },
  computed: {
    ...mapGetters([
      "getUser",
    ])
  },
  methods: {
    fetchVaults() {
      axios
          .get(process.env.VUE_APP_API_HOSTNAME + "/vaults", {
            headers: {
              "Content-Type": "application/json",
            },
            data: null,
            params: {
              userId: this.getUser.id
            },
            withCredentials: true
          })
          .then(response => {
            if(response.status === 200) {
              this.vaults = response.data.vaults;
            }
          })
          .catch(error => {
            if (error.response.data.registration === false) {
              this.backendErrors.push(error.response.data.errors)
            }
          })
    }
  }
}
</script>

<style scoped>

</style>
