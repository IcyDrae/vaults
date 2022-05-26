<template>
  <div class="item-detail edit-login">
    <NoteForm
        action="create"
        :action-handler="handleForm"
    ></NoteForm>
  </div>
</template>

<script>

import NoteForm from "./NoteForm";
import {api} from "../../../services/api";

export default {
  name: "CreateNote",
  components: {
    NoteForm,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      note: Object
    }
  },
  methods: {
    /**
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let response = await api.note.create(values, this.$route.params.id);

      if (response instanceof Error) {
        console.log(response)
        this.backendErrors.push(response);
      } else {
        this.note = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: this.note.id } });
      }
    }
  }
}
</script>
