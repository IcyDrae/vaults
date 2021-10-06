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

import http from "../../services/http";
import * as VeeValidate from "vee-validate";
import * as yup from "yup";
import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapGetters } = createNamespacedHelpers("user");

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
      encryption: new Encryption(),
      login: Object
    }
  },
  computed: {
    ...mapGetters([
        "getUser",
        "getEncryptionKey"
    ])
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
    ...mapActions([
      "addItem"
    ]),
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      values.item_type = "login";
      values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);
    },
    submitForm(values, resetForm) {
      http.request({
        method: "post",
        url: "/logins/create",
        data: {
          vaultId: this.$route.params.id,
          userId: this.getUser.id,
          data: values
        }
      }).then(response => {
        this.successHandler(response, resetForm);
      }).catch(error => {
        this.errorHandler(error);
      });
    },
    /**
     * Decrypts the given logins & decodes them into an array.
     *
     * @param response
     * @returns {{}}
     */
    decryptLogin(response) {
      let decryptedLogins = {};

      let login = response.data;

      login = this.encryption.decrypt(login, this.getEncryptionKey);
      login = JSON.parse(login);

      response.data = login;

      decryptedLogins = this.restructureLoginObject(response);

      return decryptedLogins;
    },
    /**
     * Makes a new login array with the decrypted data.
     *
     * @param object
     */
    restructureLoginObject(object) {
      return {
        "id": object.id,
        "name": {
          "label": "Name",
          "value": object.data.login_name,
          "type": "text"
        },
        "login_username": {
          "label": "Username",
          "value": object.data.login_username,
          "type": "text"
        },
        "login_email": {
          "label": "E-Mail",
          "value": object.data.login_email ?? "",
          "type": "text"
        },
        "login_website": {
          "label": "Website",
          "value": object.data.login_website,
          "type": "text"
        },
        "login_password": {
          "label": "Password",
          "value": object.data.login_password,
          "type": "password"
        },
        "login_description": {
          "label": "Description",
          "value": object.data.login_description ?? "",
          "type": "textarea"
        },
        "item_type": object.data.item_type
      };
    },
    successHandler(response, resetForm) {
      if(response.status === 201) {
        this.login = this.decryptLogin(response.data);
        this.addItem(this.login);

        resetForm();

        this.$router.push({ name: "item", params: { itemId: this.login.id, itemData: JSON.stringify(this.login) } });
      }
    },
    errorHandler(error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>

</style>
