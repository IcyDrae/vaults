<template>
  <div class="head">
    <img src="@/assets/logo.png" alt="Logo">
  </div>
  <div class="dashboard">
    <div class="navigation">
        <ul class="folders">
          <li>
            <a href="#">Social Networks</a>
          </li>
          <li>
            <a href="#">Online Banking</a>
          </li>
          <li>
            <a href="#">Shopping</a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="#">Favourites</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#">Trash</a>
          </li>
        </ul>
    </div>
    <div class="logins">
      <div class="logins-container">
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Facebook</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Instagram</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Medium</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Reddit</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Discord</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Slack</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Twitter</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Reddit</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Discord</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Slack</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Twitter</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Reddit</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Discord</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Slack</p>
        </div>
        <div class="login">
          <div>
            <img src="@/assets/instagram.png" alt="Instagram">
          </div>
          <p>Twitter</p>
        </div>

      </div>
    </div>
    <div class="account">
      <form action="#">
        <label>
          <span>Username or E-Mail</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Password</span>
          <input type="text">
        </label>
        <label>
          <span>Website</span>
          <input type="text">
        </label>
        <label>
          <span>Notes</span>
          <textarea cols="30" rows="10"></textarea>
        </label>
      </form>
    </div>
  </div>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/registration">Registration</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/logout">Logout</router-link>
  </div>
  <router-view/>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers("user");

export default {
  name: 'App',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  mounted() {
  },
  methods: {
    ...mapActions([
    ])
  }
}

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=STIX+Two+Math&display=swap');
@import "./styles/index.scss";

</style>
