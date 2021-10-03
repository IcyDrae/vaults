<template>
  <div>
    <div>
      <form>
        <h1>{{ loginData.login_name.value }}</h1>
        <label v-for="property in loginData" :key="property.id">
          <span>{{ property.label }}</span>
          <input :name="property.label"
                 :type="property.type"
                 :value="property.value" readonly />
        </label>
      </form>
    </div>
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
}
</script>

<style scoped>

</style>
