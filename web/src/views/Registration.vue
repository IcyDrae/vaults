<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="registration-form form">
    <form @submit="handleSubmit($event, submit)">
      <h1>Register an account!</h1>
      <label>
        <span>First Name</span>
        <VeeValidateField name="first_name" type="text" />
        <p class="form-error">{{ errors.first_name }}</p>
      </label>

      <label>
        <span>Last Name</span>
        <VeeValidateField name="last_name" type="text" />
        <p class="form-error">{{ errors.last_name }}</p>
      </label>

      <label>
        <span>Username</span>
        <VeeValidateField name="username" type="text" />
        <p class="form-error">{{ errors.username }}</p>
      </label>

      <label>
        <span>E-Mail</span>
        <VeeValidateField name="email" type="email" />
        <p class="form-error">{{ errors.email }}</p>
      </label>

      <label>
        <span>Password</span>
        <VeeValidateField name="password" type="password" />
        <p class="form-error">{{ errors.password }}</p>
      </label>

      <label>
        <span>Password confirmation</span>
        <VeeValidateField name="password_confirmation" type="password" />
        <p class="form-error">{{ errors.password_confirmation }}</p>
      </label>

      <div class="checkbox">
        <VeeValidateField name="terms_and_conditions" id="terms_and_conditions" type="checkbox" :value="true" checked-value="true" unchecked-value="false" />
        <label for="terms_and_conditions">Terms & Conditions</label>
        <p class="form-error">{{ errors.terms_and_conditions }}</p>
      </div>

      <button>Register</button>

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

export default {
  name: "Registration",
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
      first_name: yup.string()
                  .required()
                  .label("First name"),
      last_name: yup.string()
                  .required()
                  .label("Last name"),
      username: yup.string()
                .required()
                .label("Username"),
      email: yup.string()
              .required()
              .email()
              .label("E-Mail"),
      password: yup.string()
                .required()
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
                    "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
                )
                .label("Password"),
      password_confirmation: yup.string()
                              .required()
                              .oneOf([yup.ref('password'), null], 'Passwords must match')
                              .label("Password confirmation"),
      terms_and_conditions: yup.boolean()
          .required()
          .oneOf([true], "You must accept the terms and conditions")
          .label("Terms & Conditions")
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
    submit(values, { resetForm }) {
      // Create a 'password' array since the password field in the backend is a type of 'RepeatedType',
      // in which the two fields are children of the password field.
      values.password = {
          "password": values.password,
          "password_confirmation": values.password_confirmation
      };
      delete values.password_confirmation;

      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/register", {
            form: values,
          },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
          .then(response => {
            if(response.data.registration === true) {
              this.success = "Registration completed successfully! You can now proceed to login.";

              resetForm();

              this.$router.push("/login");
            }
          })
          .catch(error => {
            if (error.response.data.registration === false) {
              this.backendErrors.push(error.response.data.errors)
            }
          })
    }
  }
}
</script>

<style scoped>

</style>
