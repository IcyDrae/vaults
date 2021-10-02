<template>
  <div>
    <div v-for="property in loginData" :key="property.id">
      {{ property }}
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
    }
  },
  props: ["itemData"],
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
}
</script>

<style scoped>

</style>
