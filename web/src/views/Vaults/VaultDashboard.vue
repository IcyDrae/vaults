<template>
  <div class="dashboard">
<!--    <router-link :to="{ name: 'createLogin', params: { id: this.$route.params.id } }">Create Login</router-link>
    <router-view></router-view>-->
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
      <div class="logins-container">
        <div v-for="login in logins" :key="login"
             class="login" @click="this.$router.push({ name: 'item', params: { loginId: login.id, type: login.item_type } })">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>{{ login.login_name }}</p>
        </div>

      </div>
    </div>
    <div class="account">
<!--      <form action="#">
        <label>
          <span>Username or E-Mail</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Website</span>
          <input type="text">
        </label>
        <label>
          <span>Notes</span>
          <textarea cols="30" rows="10"></textarea>
        </label>
      </form>-->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Dashboard",
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
    /**
     * Requests the user's encrypted vaults.
     */
    fetchVaultItems() {
      axios
          .get(process.env.VUE_APP_API_HOSTNAME + `/vaults/${this.$route.params.id}/${this.getUser.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            data: null,
            withCredentials: true
          })
          .then(response => {
            if(response.status === 200) {
              this.logins = this.decryptLogins(response.data);
              console.log(this.logins)
            }
          })
          .catch(error => {
            console.log(error);
            this.backendErrors.push(error.message);
          })
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
        "login_description": object.data.login_description,
        "item_type": object.data.item_type
      };
    }
  }
}
</script>

<style scoped>

</style>
