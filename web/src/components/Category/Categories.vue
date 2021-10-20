<template>
  <div class="navigation">
    <div class="create-category-cta">
      <button class="btn" @click="creating = true">Create folder</button>
      <CreateCategory v-if="creating"
                      @closeOverlay="creating = false">
      </CreateCategory>
    </div>
    <ul class="folders" v-for="category in categories" :key="category">
      <li>
        <a href="#">{{ category.category_name }}</a>
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

import CreateCategory from "./CreateCategory";
import { createNamespacedHelpers } from 'vuex';
import {Security} from "../../plugins/Security";
import {api} from "../../services/api";

const { mapState } = createNamespacedHelpers("user");

export default {
  name: "Categories",
  components: {
    CreateCategory
  },
  data() {
    return {
      backendErrors: [],
      security: new Security(),
      creating: false
    }
  },
  computed: mapState([
    "categories"
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