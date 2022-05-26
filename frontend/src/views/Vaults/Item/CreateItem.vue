<template>
  <div>
    <CreateLogin v-if="type === 'login'"></CreateLogin>
    <CreateNote v-if="type === 'note'"></CreateNote>
  </div>
</template>

<script>

import CreateLogin from "../../../components/Item/Login/CreateLogin";
import CreateNote from "../../../components/Item/Note/CreateNote";

export default {
  name: "CreateItem",
  props: ["type"],
  components: {
    CreateLogin,
    CreateNote
  },
}
</script>

<style scoped>

</style>
