<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div">
    <form @submit="handleSubmit($event, handleForm)">
      <h1>Create a login!</h1>
      <label>
        <span>Login Name</span>
        <VeeValidateField name="login_name" type="text" />
        <p class="form-error">{{ errors.login_name }}</p>
      </label>

      <label>
        <span>Username</span>
        <VeeValidateField name="login_username" type="text" />
        <p class="form-error">{{ errors.login_username }}</p>
      </label>

      <label>
        <span>E-Mail Address</span>
        <VeeValidateField name="login_email" type="text" />
        <p class="form-error">{{ errors.login_email }}</p>
      </label>

      <label>
        <span>Website</span>
        <VeeValidateField name="login_website" type="text" />
        <p class="form-error">{{ errors.login_website }}</p>
      </label>

      <label>
        <span>Password</span>
        <VeeValidateField name="login_password" type="password" />
        <p class="form-error">{{ errors.login_password }}</p>
      </label>

      <label>
        <span>Description</span>
        <VeeValidateField name="login_description" as="textarea" />
        <p class="form-error">{{ errors.login_description }}</p>
      </label>

      <button class="btn">Create</button>

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
import {api} from "../../services/api";

export default {
  name: "CreateLogin",
  components: {
    // Rename the components from VeeValidate so there may be no conflicts with native HTML elements.
    VeeValidateForm: VeeValidate.Form,
    VeeValidateField: VeeValidate.Field,
  },
  data() {
    return {
      success: "",
      backendErrors: [],
      login: Object
    }
  },
  setup() {
    /**
     * Validation rules using 'yup'.
     */
    const schema = yup.object({
      login_name: yup.string()
          .required()
          .label("Name"),
      login_username: yup.string()
          .required()
          .label("Username"),
      login_email: yup.string()
          .email()
          .label("E-Mail"),
      login_website: yup.string()
          .required()
          .label("Website"),
      login_password: yup.string()
          .required()
          .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/,
              "The password must Contain at least 16 characters, one uppercase, one lowercase, one number and one special case character."
          )
          .label("Password"),
      login_description: yup.string()
          .label("Description"),
    });

    return {
      schema
    };
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

        await this.$router.push({ name: "item", params: { itemId: this.login.id, itemData: JSON.stringify(this.login) } });
      }
    }
  }
}
</script>
