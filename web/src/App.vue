<template>
  <div class="head">
    <p>somelogo</p>
  </div>
  <div class="dashboard">
    <div class="navigation">
      <div class="folders">
        <p>Social Networks</p>
        <p>Online Banking</p>
        <p>Shopping</p>
      </div>
      <p>Settings</p>
      <p>Trash</p>
    </div>
    <div class="logins">
      <div>
        <p>Facebook</p>
      </div>
      <div>
        <p>Instagram</p>
      </div>
      <div>
        <p>Medium</p>
      </div>
      <div>
        <p>Reddit</p>
      </div>
      <div>
        <p>Discord</p>
      </div>
      <div>
        <p>Slack</p>
      </div>
      <div>
        <p>Twitter</p>
      </div>
    </div>
    <div class="login">
      <form action="#">
        <label>
          Username or E-Mail
          <input type="text">
        </label>
        <label>
          Password
          <input type="text">
        </label>
        <label>
          Website
          <input type="text">
        </label>
        <label>
          Notes
          <textarea cols="30" rows="10"></textarea>
        </label>
      </form>
    </div>
  </div>
<!--  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/registration">Registration</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/logout">Logout</router-link>
  </div>
  <router-view/>-->
</template>

<style lang="scss">
@import "./styles/index.scss";

</style>
