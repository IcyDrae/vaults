<template>
  <div>
    <VeeValidateForm @submit="submit" :validation-schema="schema" v-slot="{ errors }">
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
    </VeeValidateForm>
  </div>
</template>

<script>

import * as VeeValidate from 'vee-validate';
import * as yup from 'yup';

export default {
  name: "Registration",
  components: {
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    const schema = yup.object({
      first_name: yup.string().required().label("First name"),
      last_name: yup.string().required().label("Last name"),
      email: yup.string().required().email().label("E-Mail"),
      password: yup.string().required().min(16).label("Password"),
      password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').label("Password confirmation"),
    });

    return {
      schema
    };
  },
  methods: {
    submit(values) {
      console.log(values);
    }
  }
}
</script>

<style scoped>

</style>
