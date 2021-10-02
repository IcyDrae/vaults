<template>
  <div class="type-select">
    <select v-model="selected" name="create_item">
      <option value="" disabled>Create item</option>
      <option v-for="(type, index) in types"
              :key="type"
              @click="selectorHandler(index)">
        {{ type }}
      </option>
    </select>
  </div>
</template>

<script>

export default {
  name: "CreationTypeSelector",
  data() {
    return {
      selected: "",
      types: {
        login: "Login",
        note: "Note"
      }
    }
  },
  methods: {
    selectorHandler(value) {
      this.selected = "";
      this.$router.push({ name: 'createItem', params: { type: value } });
    },
  }
}
</script>
