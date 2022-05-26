<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="register-form form">
    <form @submit="handleSubmit($event, submitForm)">
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
        <span>Master Password</span>
        <VeeValidateField name="master_password" type="password" />
        <p class="form-error">{{ errors.master_password }}</p>
      </label>

      <label>
        <span>Master Password confirmation</span>
        <VeeValidateField name="master_password_confirmation" type="password" />
        <p class="form-error">{{ errors.master_password_confirmation }}</p>
      </label>

      <div class="checkbox">
        <VeeValidateField name="terms_and_conditions" id="terms_and_conditions" type="checkbox" :value="true" checked-value="true" unchecked-value="false" />
        <label for="terms_and_conditions">Terms & Conditions</label>
        <p class="form-error">{{ errors.terms_and_conditions }}</p>
      </div>

      <button class="btn">Register</button>

      <li class="backend-errors" v-for="error in backendErrors" :key="error">
        {{ error }}
      </li>

      <p class="backend-success">{{ success }}</p>
    </form>
  </VeeValidateForm>
</template>

<script>

import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import {api} from "../services/api";

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
      master_password: yup.string()
                .required()
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
                    "The master password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
                )
                .label("Master Password"),
      master_password_confirmation: yup.string()
                              .required()
                              .oneOf([yup.ref('master_password'), null], 'Passwords must match')
                              .label("Master Password confirmation"),
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
      backendErrors: [],
    }
  },
  methods: {
    /**
     * Submit the form to the API.
     *
     * @param values
     * @param resetForm
     */
    async submitForm(values, { resetForm }) {
      let response = await api.authentication.register(values);

      if (response instanceof Error) {
        this.backendErrors.push(response.response.data.errors);
      } else {
        resetForm();

        await this.$router.push("/login");
      }
    }
  }
}
</script>

<style scoped>

</style>
