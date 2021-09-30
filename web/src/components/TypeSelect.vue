<template>
  <div class="type-select">
    <VeeValidateField v-slot="{ value }" name="create_item" as="select">
      <option value="" disabled>Create item</option>
      <option v-for="type in types"
              :key="type"
              :value="type"
              :selected="value && value.includes(type)"
              @click="selectTriggered(type)">
        {{ type }}
      </option>
    </VeeValidateField>
  </div>
</template>

<script>

import * as VeeValidate from "vee-validate";

export default {
  name: "TypeSelect",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    return {
      types: {
        login: "Login",
        note: "Note"
      }
    }
  },
  methods: {
    selectTriggered(value) {
      console.log(value);
    }
  }
}
</script>

<style scoped>

</style>
