<template>
  <div class="dashboard">
    <Categories @folder-clicked="folderItemsHandler"></Categories>
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
import Categories from "../../components/Category/Categories";
import CreationTypeSelector from "../../components/Item/CreationTypeSelector";

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "VaultDashboard",
  components: {
    Categories,
    CreationTypeSelector
  },
  data() {
    return {
      folderId: "",
      backendErrors: [],
      security: new Security()
    }
  },
  computed: {
    ...mapState({
      items(state) {
        let self = this,
            items = {};

        if (self.folderId) {
          items = state.items.filter(item => item.login_category.value === self.folderId);
        } else {
          items = state.items;
        }

        return items;
      }
    }),
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
    folderItemsHandler(id) {
      this.folderId = id;
      this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });
    },
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
