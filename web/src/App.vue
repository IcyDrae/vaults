<template>
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
      <p>Facebook</p>
      <p>Instagram</p>
      <p>Medium</p>
      <p>Reddit</p>
      <p>Discord</p>
      <p>Slack</p>
      <p>Twitter</p>
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
