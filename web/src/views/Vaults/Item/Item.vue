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
        <div class="input-cta-container">
          <span v-if="property.type === 'password'"
                ref="togglePassword"
                id="toggle-password"
                class="input-cta hide-password"
                @click="togglePasswordVisibility"></span>
          <span class="input-cta copy" @click="copyToClipboard(property.label)">Copy</span>
        </div>
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

    toggle.classList.remove("show-password");
    toggle.classList.add("hide-password");

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

      if (toggle.classList.contains("hide-password")) {
        toggle.classList.remove("hide-password");
        toggle.classList.add("show-password");
      } else if(toggle.classList.contains("show-password")) {
        toggle.classList.remove("show-password");
        toggle.classList.add("hide-password");
      }
    },
    copyToClipboard(referenceName) {
      let element = this.$refs[referenceName];
      let typeAttribute = element.getAttribute("type");

      if (typeAttribute === "password") {
        element.setAttribute("type", "text");
      }

      element.select();
      document.execCommand("copy");

      if (typeAttribute === "password") {
        element.setAttribute("type", "password");
      }
    }
  }
}
</script>

<style scoped>

</style>
