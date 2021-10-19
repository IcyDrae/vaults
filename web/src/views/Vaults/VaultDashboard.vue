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

import {api} from "../../services/api";
import {Security} from "../../plugins/Security";
import { createNamespacedHelpers } from 'vuex';
import CreationTypeSelector from "../../components/Item/CreationTypeSelector";

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "Dashboard",
  components: {
    CreationTypeSelector
  },
  data() {
    return {
      backendErrors: [],
      security: new Security()
    }
  },
  computed: mapState([
    "items"
  ]),
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
    async fetchVaultItems() {
      let response = await api.vault.getItems(this.$route.params.id);

      if (response instanceof Error) {
        this.backendErrors.push(response.message);
      }
    }
  }
}
</script>

<style scoped>

</style>
