<template>
  <div class="vaults">
    <div v-for="vault in vaults" :key="vault" class="vault">
      <p>{{ vault.vault_name }}</p>
      <p>{{ vault.logins_amount }} Items</p>
      <p class="vault-description">{{ vault.vault_description }}</p>
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
              this.vaults = this.decryptVaults(response.data);
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
     * @param results
     * @returns {{}}
     */
    decryptVaults(results) {
      let decryptedVaults = {};

      results.forEach((result, index) => {
        let vault = result.vault;

        vault.data = this.encryption.decrypt(vault.data, this.getEncryptionKey);
        vault.data = JSON.parse(vault.data);

        decryptedVaults[index] = this.restructureVaultObject(result);
      });

      return decryptedVaults;
    },
    /**
     * Makes a new vault array with the decrypted data.
     *
     * @param object
     */
    restructureVaultObject(object) {
      return {
        "id": object.vault.id,
        "vault_name": object.vault.data.vault_name,
        "vault_description": object.vault.data.vault_description,
        "logins_amount": object.logins_amount
        };
    }
  }
}
</script>

<style scoped>

</style>
