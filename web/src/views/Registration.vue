<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="registration-form">
    <form @submit="handleSubmit($event, submit)">
      <label>
        First Name
        <VeeValidateField name="first_name" type="text" />
      </label>

      <label>
        Last Name
        <VeeValidateField name="last_name" type="text" />
      </label>

      <label>
        Username
        <VeeValidateField name="username" type="text" />
      </label>

      <label>
        E-Mail
        <VeeValidateField name="email" type="email" />
      </label>

      <label>
        Password
        <VeeValidateField name="password" type="password" />
      </label>

      <label>
        Password confirmation
        <VeeValidateField name="password_confirmation" type="password" />
      </label>

      <label>
        Terms & Conditions
        <VeeValidateField name="terms_and_conditions" type="checkbox" :value="true" checked-value="true" unchecked-value="false" />
      </label>

      <br>
      <li v-for="(message, field) in errors" :key="field">
        {{ message }}
      </li>

      <button>Register</button>
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
          .label("Terms & Condition")
    });

    return {
      schema
    };
  },
  data() {
    return {}
  },
  methods: {
    /**
     * The main submit handler.
     *
     * @param values
     */
    submit(values, /*{ resetForm }*/) {
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
            console.log(response.config.data)
      })

      //resetForm();
    }
  }
}
</script>

<style scoped>

</style>
