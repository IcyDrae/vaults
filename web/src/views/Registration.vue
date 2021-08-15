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
    submit(values, { resetForm }) {
      console.log(values);

      resetForm();
    }
  }
}
</script>

<style scoped>

</style>
