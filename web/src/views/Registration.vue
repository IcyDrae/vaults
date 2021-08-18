<template>
  <div>
    <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div">
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


        <br>
        <li v-for="(message, field) in errors" :key="field">
          {{ message }}
        </li>

        <button>Register</button>
      </form>
    </VeeValidateForm>
  </div>
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
  data() {
    // Validation schema using 'yup'.
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
    });

    return {
      schema
    };
  },
  methods: {
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
