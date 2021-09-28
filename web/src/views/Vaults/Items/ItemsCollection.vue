<template>
  <div>
    {{ type }}
  </div>
</template>

<script>

import axios from "axios";
import Encryption from "../../../encryption-flow/Encryption";
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers("user");

export default {
  name: "ItemsCollection",
  props: ["type"],
  components: {

  },
  data() {
    return {
      success: "",
      backendErrors: [],
      encryption: new Encryption()
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getEncryptionKey"
    ])
  },
  methods: {
    /**
     *
     * @param values
     * @param resetForm
     */
    handleForm(values, { resetForm }) {
      values = JSON.stringify(values);
      let encryptedValues = this.encryption.encrypt(values, this.getEncryptionKey);

      this.submitForm(encryptedValues, resetForm);
    },
    submitForm(values, resetForm) {
      axios
          .post(process.env.VUE_APP_API_HOSTNAME + "/logins/create", {
                vaultId: this.$route.params.id,
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
