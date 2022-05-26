<template>
  <div>
    <EditLogin v-if="this.$props.itemType === 'login'"></EditLogin>
    <EditNote v-if="this.$props.itemType === 'note'"></EditNote>
  </div>
</template>

<script>

import EditLogin from "../../../components/Item/Login/EditLogin";
import EditNote from "../../../components/Item/Note/EditNote";

export default {
  name: "EditItem",
  components: {
    EditLogin,
    EditNote
  },
  props: ["itemType"]
}
</script>
