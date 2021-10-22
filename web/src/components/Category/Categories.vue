<template>
  <div class="categories">
    <div class="navigation">
      <div class="create-category-cta">
        <button class="btn" @click="creating = true">Create folder</button>
      </div>
      <CreateCategory v-if="creating === true"
                      @closeOverlay="creating = false">
      </CreateCategory>
      <ul class="folders">
        <li v-for="category in categories"
            :key="category"
            @click="$emit('folderClicked', category.id); this.setActiveCategory(category.id)"
            :class="{ active: category.active }">
          <a href="#">{{ category.category_name }}</a>
        </li>
      </ul>
      <ul>
        <li @click="$emit('allClicked'); this.removeActiveCategory()">
          <a href="#">
            All items
          </a>
        </li>
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
  </div>
</template>

<script>

import CreateCategory from "./CreateCategory";
import { createNamespacedHelpers } from 'vuex';
import {Security} from "../../plugins/Security";
import {api} from "../../services/api";

const { mapState, mapActions } = createNamespacedHelpers("user");

export default {
  name: "Categories",
  components: {
    CreateCategory
  },
  data() {
    return {
      creating: Boolean,
      backendErrors: [],
      security: new Security()
    }
  },
  computed: mapState([
    "categories"
  ]),
  mounted() {
    this.fetchCategories();
  },
  methods: {
    ...mapActions([
        "setActiveCategory",
        "removeActiveCategory"
    ]),
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
