<template>
  <div class="item-detail edit-login">
    <NoteForm
        action="edit"
        :action-handler="handleForm"
        :delete-handler="deleteNote"
    ></NoteForm>
  </div>
</template>

<script>

import NoteForm from "./NoteForm";
import {api} from "../../../services/api";
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers("app_state");

export default {
  name: "EditNote",
  components: {
    NoteForm,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      showModal: false
    }
  },
  methods: {
    ...mapActions([
        "setItemView"
    ]),
    /**
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let response = await api.note.update(values, this.$route.params.itemId);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        let updatedNote = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: updatedNote.id } });
      }
    },
    async deleteNote() {
      let response = await api.note.delete(this.$route.params.itemId);

      if (response instanceof Error) {
        this.backendErrors.push(response);
      } else {
        this.showModal = false;
        this.setItemView(false);

        await this.$router.push({ name: "vaultDashboard", params: { id: this.$route.params.id } });
      }
    }
  }
}
</script>

<style scoped>

</style>
