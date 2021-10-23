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
        <li @click="$emit('allClicked'); this.removeActiveCategory()">
          <p>All items</p>
        </li>
        <li v-for="category in categories"
            :key="category"
            @click="$emit('folderClicked', category.id); this.setActiveCategory(category.id)"
            :class="{ active: category.active }">
          <p>{{ category.category_name }}</p>
          <span title="Delete folder"
                :class="{ active: category.active }"
                @click="showModal = true; selectedCategory = category.id">
            &#10005;
          </span>
        </li>
      </ul>
    </div>
    <transition name="modal">
      <DeletePrompt v-if="showModal"
                    :prompt-text="deletePromptText"
                    @deletionConfirmed="deleteCategory(selectedCategory)"
                    @deletionCancelled="showModal = false">
      </DeletePrompt>
    </transition>
  </div>
</template>

<script>

import CreateCategory from "./CreateCategory";
import { createNamespacedHelpers } from 'vuex';
import {Security} from "../../plugins/Security";
import {api} from "../../services/api";
import DeletePrompt from "../DeletePrompt";

const { mapState, mapActions } = createNamespacedHelpers("user");

export default {
  name: "Categories",
  components: {
    CreateCategory,
    DeletePrompt
  },
  data() {
    return {
      creating: Boolean,
      showModal: false,
      selectedCategory: "",
      backendErrors: [],
      security: new Security(),
      deletePromptText: "You are about to delete this folder and all the items it contains. This cannot be undone. Are you sure?"
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
    },
    async deleteCategory(id) {
      let response = await api.category.delete(id);

      if (response instanceof Error) {
        this.backendErrors.push(response.message);
      } else {
        this.showModal = false;
      }
    }
  }
}
</script>
