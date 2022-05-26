<template>
  <div class="item-detail">
    <form>
      <p class="back" @click="$router.push({ name: 'vaultDashboard', params: { id: this.$route.params.id } }); this.setItemView(false)">Back</p>
      <div class="detail-head">
        <h1>{{ item.name.value }}</h1>
        <p @click="this.$router.push({
        name: 'editItem',
        params: {
          itemType: this.item.item_type,
        }
        })">Edit</p>
      </div>

      <div class="category-label">
        <p v-if="item.category != 0">
          {{ category.category_name }}
        </p>
      </div>

      <div v-for="(property, index) in itemFiltered" :key="property.id">
        <label>
          <span>{{ property.label }}</span>
          <input :ref="property.label"
                 :name="index"
                 :type="property.type"
                 :value="property.value" readonly />
        </label>
        <div class="input-cta-container">
          <span v-if="property.type === 'password'"
                ref="togglePassword"
                id="toggle-password"
                class="input-cta hide-password"
                @click="togglePasswordVisibility"></span>
          <span class="input-cta copy" @click="this.copyToClipboard(property.label)">Copy</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers("user");
const { mapActions : mapActionsApp } = createNamespacedHelpers("app_state");

export default {
  name: "Item",
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      category: function(state) {
        let self = this;

        return state.categories.find(category => category.id === self.item.category);
      },
      item: function(state) {
        let self = this;

        return state.items.find(item => item.id == self.$route.params.itemId);
      }
    }),
    /**
     * Watches for changes for the $props.itemData, excludes specific properties.
     */
    itemFiltered() {
      let dataArray = Object.entries(this.item);

      let filtered = dataArray.filter((key) => {
        return key[0] !== "id"
            && key[0] !== "item_type"
            && key[0] !== "category"
            && key[0] !== "vault_id";
      });

      return Object.fromEntries(filtered);
    }
  },
  beforeMount() {
    this.setItemView(true);
  },
  beforeUpdate() {
    let itemType = this.item.item_type;

    if (itemType === "login" && this.$refs.Password) {
      let password = this.$refs.Password;
      let toggle = this.$refs.togglePassword;

      toggle.classList.remove("show-password");
      toggle.classList.add("hide-password");

      if (password.getAttribute("type") === "text") {
        password.setAttribute("type", "password");
      }
    }
  },
  methods: {
    ...mapActionsApp([
        "setItemView"
    ]),
    togglePasswordVisibility() {
      let password = this.$refs.Password;

      if (password.getAttribute("type") === "password") {
        password.setAttribute("type", "text");
      } else {
        password.setAttribute("type", "password");
      }

      this.toggleInputText();
    },
    toggleInputText() {
      let toggle = this.$refs.togglePassword;

      if (toggle.classList.contains("hide-password")) {
        toggle.classList.remove("hide-password");
        toggle.classList.add("show-password");
      } else if(toggle.classList.contains("show-password")) {
        toggle.classList.remove("show-password");
        toggle.classList.add("hide-password");
      }
    }
  }
}
</script>

<style scoped>

</style>
