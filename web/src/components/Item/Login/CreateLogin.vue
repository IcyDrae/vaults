<template>
  <div class="item-detail edit-login">
    <LoginForm
        action="create"
        :action-handler="handleForm"
    ></LoginForm>
  </div>
</template>

<script>

import LoginForm from "./LoginForm";
import {api} from "../../../services/api";

export default {
  name: "CreateLogin",
  components: {
    LoginForm,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      login: Object
    }
  },
  methods: {
    /**
     *
     * @param values
     * @param resetForm
     */
    async handleForm(values, { resetForm }) {
      let response = await api.login.create(values, this.$route.params.id);

      if (response instanceof Error) {
        console.log(response)
        this.backendErrors.push(response);
      } else {
        this.login = response;
        resetForm();

        await this.$router.push({ name: "item", params: { itemId: this.login.id } });
      }
    }
  }
}
</script>
