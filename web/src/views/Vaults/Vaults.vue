<template>
  <div class="vaults">
    <div v-for="vault in vaults" :key="vault" class="vault">
      <p>{{ vault.vault_name }}</p>
      <p>37 Items</p>
      <p class="vault-description">{{ vault.vault_name }}</p>
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
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Vaults",
  data() {
    return {
      vaults: [],
      backendErrors: [],
      encryption: new Encryption()
    }
  },
  mounted() {
    this.fetchVaults();
  },
  computed: {
    ...mapGetters([
        "getUser",
        "getEncryptionKey"
    ])
  },
  methods: {
    /**
     * Requests the user's encrypted vaults.
     */
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
              this.vaults = this.decryptVaults(response.data.vaults);
            }
          })
          .catch(error => {
            this.backendErrors.push(error.response.data.errors)
          })
    },
    /**
     * Decrypts the given vaults & decodes them into an array.
     *
     * @param vaults
     * @returns {*[]}
     */
    decryptVaults(vaults) {
      let decryptedVaults = [];

      vaults.forEach((vault, index) => {
        vaults[index] = this.encryption.decrypt(vault.data, this.getEncryptionKey);

        let jsonDecodedVault = JSON.parse(vaults[index]);

        decryptedVaults.push(jsonDecodedVault);
      });

      return decryptedVaults;
    }
  }
}
</script>

<style scoped>

</style>
