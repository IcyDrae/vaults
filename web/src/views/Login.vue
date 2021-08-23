<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="login-form">
    <form @submit="handleSubmit($event, submit)">
      <label>
        E-Mail
        <VeeValidateField name="login_email" type="email" />
      </label>

      <label>
        Password
        <VeeValidateField name="login_password" type="password" />
      </label>

      <br>
      <li v-for="(message, field) in errors" :key="field">
        {{ message }}
      </li>

      <li v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>

      <li v-if="success">
        {{ success }}
      </li>

      <button>Login</button>
    </form>
  </VeeValidateForm>
</template>

<script>

import * as VeeValidate from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';

export default {
  name: "Login",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
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
      login_password: yup.string()
          .required()
          .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
              "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
          )
          .label("Password"),
    });

    return {
      schema
    };
  },
  data() {
    return {
      success: "",
      backendErrors: []
    }
  },
  methods: {
    /**
     * The main submit handler.
     *
     * @param values
     * @param resetForm
     */
    submit(values, /*{ resetForm }*/) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/login", {
                data: values,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
          .then(response => {
            if(response.data.login === true) {
              this.success = "You are now logged in!";

              //resetForm();
            }
          })
          .catch(error => {
            if (error.response.data.login === false) {
              this.backendErrors.push(error.response.data.errors)
            }
          })
    }
  }
}
</script>

<style scoped>

</style>
