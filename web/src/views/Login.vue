<template>
  <VeeValidateForm :validation-schema="schema"
                   v-slot="{ errors, handleSubmit }"
                   as="div"
                   class="login-form form">
    <form @submit="handleSubmit($event, submitForm)">
      <h1>Login</h1>
      <label>
        <span>E-Mail</span>
        <VeeValidateField name="login_email" type="email" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Master Password</span>
        <VeeValidateField name="login_master_password" type="password" />
        <p class="form-error">{{ errors.login_password }}</p>
      </label>

      <button class="btn">Login</button>

      <li class="backend-errors" v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>
    </form>
  </VeeValidateForm>
</template>

<script>

import * as VeeValidate from 'vee-validate';
import * as yup from 'yup';
import {api} from "../services/api";

export default {
  name: "Login",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    return {
      backendErrors: [],
    }
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      login_email: yup.string()
          .required()
          .email()
          .label("E-Mail"),
      login_master_password: yup.string()
          .required()
          .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
              "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
          )
          .label("Master Password"),
    });

    return {
      schema
    };
  },
  methods: {
    async submitForm(values, { resetForm }) {
      let response = await api.authentication.login(values);

      if (response instanceof Error) {
        this.backendErrors.push(response.response.data.errors)
      } else {
        resetForm();

        await this.$router.push("/vaults");
      }
    }
  }
}
</script>

<style scoped>

</style>
