<template>
  <div class="item-detail">
    <form>
      <h1>{{ loginData.login_name.value }}</h1>
      <div v-for="(property, index) in loginData" :key="property.id">
        <label>
          <span>{{ property.label }}</span>
          <input :ref="property.label"
                 :name="index"
                 :type="property.type"
                 :value="property.value" readonly />
        </label>
        <span v-if="property.type === 'password'"
              ref="togglePassword"
              id="toggle-password"
              class="hide-password"
              @click="togglePasswordVisibility"></span>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name: "Item",
  props: ["itemData"],
  data() {
    return {
    }
  },
  computed: {
    /**
     * Watches for changes for the $props.itemData, excludes specific properties.
     */
    loginData() {
      let data = JSON.parse(this.$props.itemData);

      let dataArray = Object.entries(data);

      let filtered = dataArray.filter((key) => {
        return key[0] !== "id" && key[0] !== "item_type";
      });

      return Object.fromEntries(filtered);
    }
  },
  beforeUpdate() {
    let password = this.$refs.Password;
    let toggle = this.$refs.togglePassword;

    toggle.className = "hide-password";

    if (password.getAttribute("type") === "text") {
      password.setAttribute("type", "password");
    }
  },
  methods: {
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

      if (toggle.className === "hide-password") {
        toggle.className = "show-password";
      } else {
        toggle.className = "hide-password";
      }
    }
  }
}
</script>

<style scoped>

</style>
