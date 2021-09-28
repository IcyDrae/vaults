<template>
  <div>
    <Login v-if="type === 'login'"></Login>
    <Note v-if="type === 'note'"></Note>
  </div>
</template>

<script>

import Login from "../../../components/Item/Login";
import Note from "../../../components/Item/Note";

export default {
  name: "ItemsCollection",
  props: ["type"],
  components: {
    Login,
    Note
  },
  data() {
    return {
      success: "",
      backendErrors: [],
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
