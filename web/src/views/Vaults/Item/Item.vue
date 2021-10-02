<template>
  <div>
    <Login v-if="type === 'login'" v-bind:itemData="itemData"></Login>
    <Note v-if="type === 'note'" v-bind:itemData="itemData"></Note>
  </div>
</template>

<script>

import Login from "../../../components/Item/Login/Login";
import Note from "../../../components/Item/Note/Note";

export default {
  name: "Item",
  props: ["type", "itemData"],
  components: {
    Login,
    Note
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
