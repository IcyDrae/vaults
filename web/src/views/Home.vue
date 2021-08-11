<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    axios
        .get('https://api.password-manager.dev.local:444/test')
        .then(response => {
          console.log(response.data)
        })
  }
}
</script>
