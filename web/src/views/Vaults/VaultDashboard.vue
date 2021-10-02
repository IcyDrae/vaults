<template>
  <div class="dashboard">
    <div class="navigation">
      <ul class="folders">
        <li>
          <a href="#">Social Networks</a>
        </li>
        <li>
          <a href="#">Online Banking</a>
        </li>
        <li>
          <a href="#">Shopping</a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#">Favourites</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Trash</a>
        </li>
      </ul>
    </div>
    <div class="logins">
      <CreationTypeSelector v-bind:vaultId="$route.params.id"></CreationTypeSelector>
      <div class="logins-container">
        <div v-for="login in logins" :key="login"
             class="login"
             @click="this.$router.push({
             name: 'item',
             params: {
               loginId: login.id,
               itemData: JSON.stringify(login)
             }
             })">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>{{ login.login_name }}</p>
        </div>
      </div>
    </div>
    <div class="account">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import http from "../../services/http";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
import CreationTypeSelector from "../../components/Item/CreationTypeSelector";

const { mapActions, mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Dashboard",
  components: {
    CreationTypeSelector
  },
  data() {
    return {
      logins: [],
      backendErrors: [],
      encryption: new Encryption()
    }
  },
  computed: {
    ...mapGetters([
        "getUser",
        "getEncryptionKey"
    ])
  },
  beforeRouteEnter(to, from, next) {
    document.querySelector("#app").classList.add("dashboard-view")
    next();
  },
  beforeRouteLeave(to, from, next) {
    document.querySelector("#app").classList.remove("dashboard-view")
    next();
  },
  mounted() {
    this.fetchVaultItems();
  },
  methods: {
    ...mapActions([
        "setItems"
    ]),
    /**
     * Requests the user's encrypted vaults.
     */
    fetchVaultItems() {
      let url = `/vaults/${this.$route.params.id}/${this.getUser.id}`;

      http.request({
        method: "get",
        url: url
      }).then(response => {
        this.successHandler(response);
      }).catch(error => {
        this.errorHandler(error);
      });
    },
    successHandler(response) {
      if(response.status === 200) {
        let decryptedLogins = this.decryptLogins(response.data);

        Object.values(decryptedLogins).forEach((login) => {
          this.logins.push(login);
        });

        this.setItems(this.logins);
      }
    },
    errorHandler(error) {
      console.log(error);
      this.backendErrors.push(error.message);
    },
    /**
     * Decrypts the given logins & decodes them into an array.
     *
     * @param results
     * @returns {{}}
     */
    decryptLogins(results) {
      let decryptedLogins = {};

      results.forEach((result, index) => {
        let login = result.data;

        login = this.encryption.decrypt(login, this.getEncryptionKey);
        login = JSON.parse(login);

        result.data = login;

        decryptedLogins[index] = this.restructureLoginObject(result);
      });

      return decryptedLogins;
    },
    /**
     * Makes a new login array with the decrypted data.
     *
     * @param object
     */
    restructureLoginObject(object) {
      return {
        "id": object.id,
        "login_name": object.data.login_name,
        "login_username": object.data.login_username,
        "login_email": object.data.login_email ?? "",
        "login_website": object.data.login_website,
        "login_password": object.data.login_password,
        "login_description": object.data.login_description ?? "",
        "item_type": object.data.item_type
      };
    }
  }
}
</script>

<style scoped>

</style>
