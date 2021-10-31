<template>
  <div class="dashboard">
    <Categories
        @folder-clicked="folderItemsHandler"
        @all-clicked="allItemsHandler">
    </Categories>
    <div class="logins" :class="{ active: this.getItemView === true }">
      <CreationTypeSelector></CreationTypeSelector>
      <div class="logins-container">
        <div v-for="item in items" :key="item"
             class="login"
             @click="this.$router.push({
             name: 'item',
             params: {
               itemId: item.id
             }
             })">
          <div>
            <img src="@/assets/item_placeholder.png" alt="Placeholder image for a securely stored item.">
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
const { mapActions, mapGetters } = createNamespacedHelpers("app_state");

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
    ...mapGetters([
        "getItemView"
    ]),
    ...mapState({
      items(state) {
        let self = this,
            items = {};

        if (self.folderId) {
          items = state.items.filter(item => item.category === self.folderId);
        } else {
          items = state.items.filter(item => item.vault_id == self.$route.params.id);
        }

        return items;
      }
    })
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
        "triggerBurgerMenu",
        "setItemView"
    ]),
    folderItemsHandler(id) {
      this.folderId = id;
      this.folderHandler();
    },
    allItemsHandler() {
      this.folderId = "";
      this.folderHandler();
    },
    folderHandler() {
      this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });

      this.triggerBurgerMenu();
      this.setItemView(false);
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
