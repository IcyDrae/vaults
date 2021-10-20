<template>
  <div class="navigation">
    <div class="create-category-cta">
      <button class="btn" @click="$router.push('/category/create')">Create folder</button>
    </div>
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
</template>

<script>

import { createNamespacedHelpers } from 'vuex';
import {Security} from "../plugins/Security";
import {api} from "../services/api";

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "Categories",
  data() {
    return {
      backendErrors: [],
      security: new Security()
    }
  },
  computed: mapState([
    "items"
  ]),
  mounted() {
    this.fetchCategories();
  },
  methods: {
    /**
     * Requests the user's encrypted vaults.
     */
    async fetchCategories() {
      let response = await api.category.fetchAll();

      if (response instanceof Error) {
        this.backendErrors.push(response.message);
      }
    }
  }
}
</script>

<style scoped>

</style>