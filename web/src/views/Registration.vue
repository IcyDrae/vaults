<template>
  <VeeValidateForm :validation-schema="schema" v-slot="{ errors, handleSubmit }" as="div" class="registration-form form">
    <form @submit="handleSubmit($event, handleForm)">
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
import axios from "axios";
import Encryption from "../encryption-flow/Encryption";
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapGetters } = createNamespacedHelpers("user");

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
      encryption: new Encryption()
    }
  },
  computed: {
    ...mapGetters([
        "getEncryptionKey",
        "getAuthenticationHash"
    ])
  },
  methods: {
    ...mapActions([
        "setEncryptionKey",
        "setAuthenticationHash"
    ]),
    /**
     * The main form handler.
     *
     * @param values
     * @param resetForm
     * @returns {Promise<void>}
     */
    async handleForm(values, { resetForm }) {
      let derived = await this.deriveFromMasterPassword(values);

      this.persistDerivedValues(derived.encryptionKey, derived.authenticationHash);

      this.resetMasterPassword(values);

      this.createMasterPasswordArray(values);

      this.submitForm(values, resetForm);
    },
    /**
     * Hash the master password into an encryption key and an authentication hash.
     *
     * @param values
     * @returns Object
     */
    async deriveFromMasterPassword(values) {
      let encryptionKey = await this.encryption.hash(values.master_password, values.email, 100100);
      let authenticationHash = await this.encryption.hash(values.master_password, encryptionKey, 1);

      return {
        encryptionKey,
        authenticationHash
      };
    },
    /**
     * Persist the derived values to the global storage.
     *
     * @param encryptionKey
     * @param authenticationHash
     */
    persistDerivedValues(encryptionKey, authenticationHash) {
      this.setAuthenticationHash(authenticationHash);
      this.setEncryptionKey(encryptionKey);
    },
    /**
     * Sets the password & password confirmation to the authentication hash.
     *
     * @param values
     */
    resetMasterPassword(values) {
      values.master_password = this.getAuthenticationHash.toString("hex");
      values.master_password_confirmation = this.getAuthenticationHash.toString("hex")
    },
    /**
     * Create a "master_password" array since the password field in the backend is a type of "RepeatedType",
     * in which the two fields are children of the password field. In the end deleting the remaining "master_password_confirmation".
     *
     * @param values
     */
    createMasterPasswordArray(values) {
      values.master_password = {
        "password": values.master_password,
        "password_confirmation": values.master_password_confirmation
      };

      delete values.master_password_confirmation;
    },
    /**
     * Submit the form to the API.
     *
     * @param values
     * @param resetForm
     */
    submitForm(values, resetForm) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/register", {
            form: values,
          },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              })
          .then(response => {
            if(response.status === 201) {
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
