<template>
  <div class="vaults">
    <div v-for="vault in vaults" :key="vault" class="vault">
      <p>{{ vault.vault_name }}</p>
      <p>{{ vault.logins_amount }} Items</p>
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
            console.log(error.message);
            this.backendErrors.push(error.message);
          })
    },
    /**
     * Decrypts the given vaults & decodes them into an array.
     *
     * @param vaults
     * @returns {{}}
     */
    decryptVaults(vaults) {
      let decryptedVaults = {};

      vaults.forEach((vault, index) => {
        vault.data.data = this.encryption.decrypt(vault.data.data, this.getEncryptionKey);
        vault.data.data = JSON.parse(vault.data.data);

        decryptedVaults[index] = this.restructureVaultObject(vault);
      });

      return decryptedVaults;
    },
    /**
     * Makes a new vault array with the decrypted data.
     *
     * @param vault
     */
    restructureVaultObject(vault) {
      return {
        "id": vault.data.id,
        "vault_name": vault.data.data.vault_name,
        "vault_description": vault.data.data.vault_description,
        "logins_amount": vault.logins_amount
        };
    }
  }
}
</script>

<style scoped>

</style>
