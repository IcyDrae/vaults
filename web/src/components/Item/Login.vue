<template>
  <VeeValidateForm :validation-schema="schema"
                   :initial-values="{
                      login_name: this.loginData.login_name,
                      login_description: this.loginData.login_description,
                   }"
                   v-slot="{ errors, handleSubmit }" as="div">
    <form @submit="handleSubmit($event, handleForm)">
      <label>
        <span>Vault Name</span>
        <VeeValidateField name="login_name" type="text" />
        <p class="form-error">{{ errors.login_name }}</p>
      </label>

      <label>
        <span>Description</span>
        <VeeValidateField name="login_description" as="textarea" />
        <p class="form-error">{{ errors.login_description }}</p>
      </label>

<!--      <button class="btn">Create</button>-->

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
//import Encryption from "../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers("user");

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
      backendErrors: [],
      //encryption: new Encryption(),
      loginData: JSON.parse(this.$props.itemData),
    }
  },
  props: ["itemData"],
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
          .label("Login Name"),
      login_description: yup.string()
          .required()
          .label("Login Description"),
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
    handleForm(values, { resetForm }) {
      values = JSON.stringify(values);
      //let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(values, resetForm);
    },
    submitForm(values, resetForm) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/vwaults/create", {
                userId: this.getUser.id,
                data: values
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true
              })
          .then(response => {
            if(response.status === 201) {
              resetForm();

              this.$router.push("/vaults");
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
