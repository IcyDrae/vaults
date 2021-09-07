<template>
  <VeeValidateForm :validation-schema="schema"
                   v-slot="{ errors, handleSubmit }"
                   as="div"
                   class="login-form form">
    <form @submit="handleSubmit($event, submit)">
      <label>
        <span>E-Mail</span>
        <VeeValidateField name="login_email" type="email" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Password</span>
        <VeeValidateField name="login_password" type="password" />
        <p class="form-error">{{ errors.login_password }}</p>
      </label>

      <button>Login</button>

      <li class="backend-errors" v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>

      <p class="backend-success">{{ success }}</p>
    </form>
  </VeeValidateForm>
</template>

<script>

import * as VeeValidate from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers("user");

export default {
  name: "Login",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    return {
      success: "",
      backendErrors: []
    }
  },
  computed: {
    ...mapGetters([
        "getUser"
    ])
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
  methods: {
    ...mapActions([
       "setUser"
    ]),
    /**
     * The main submit handler.
     *
     * @param values
     * @param resetForm
     */
    submit(values, { resetForm }) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/login", {
                form: values,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true
              })
          .then(response => {
            if(response.data.authenticated === true) {
              this.success = "You are now logged in!";

              // Set the global user object.
              let user = JSON.parse(response.data.user);

              if (this.isObjectEmpty(this.getUser)) {
                this.setUser({
                  "id": user.id,
                  "firstName": user.firstName,
                  "lastName": user.lastName,
                  "email": user.email,
                  "username": user.username,
                  "roles": user.roles,
                  "registeredAt": user.registeredAt
                })
              }

              resetForm();
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
