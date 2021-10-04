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
      <CreationTypeSelector></CreationTypeSelector>
      <div class="logins-container">
        <div v-for="item in items" :key="item"
             class="login"
             @click="this.$router.push({
             name: 'item',
             params: {
               itemId: item.id,
               itemData: JSON.stringify(item)
             }
             })">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>{{ item.name.value }}</p>
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
      items: [],
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
        let decryptedItems = this.decryptItems(response.data);

        Object.values(decryptedItems).forEach((item) => {
          this.items.push(item);
        });

        this.setItems(this.items);
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
    decryptItems(results) {
      let decryptedItems = {};

      results.forEach((result, index) => {
        let item = result.data;

        item = this.encryption.decrypt(item, this.getEncryptionKey);
        item = JSON.parse(item);

        result.data = item;

        
        decryptedItems[index] = this.restructureLoginObject(result);
      });

      return decryptedItems;
    },
    /**
     * Makes a new login array with the decrypted data.
     *
     * @param object
     */
    restructureLoginObject(object) {
      return {
        "id": object.id,
        "name": {
          "label": "Name",
          "value": object.data.login_name,
          "type": "text"
        },
        "login_username": {
          "label": "Username",
          "value": object.data.login_username,
          "type": "text"
        },
        "login_email": {
          "label": "E-Mail",
          "value": object.data.login_email ?? "",
          "type": "text"
        },
        "login_website": {
          "label": "Website",
          "value": object.data.login_website,
          "type": "text"
        },
        "login_password": {
          "label": "Password",
          "value": object.data.login_password,
          "type": "password"
        },
        "login_description": {
          "label": "Description",
          "value": object.data.login_description ?? "",
          "type": "textarea"
        },
        "item_type": object.data.item_type
      };
    }
  }
}
</script>

<style scoped>

</style>
