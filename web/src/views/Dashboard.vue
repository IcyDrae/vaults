<template>
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
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
    }
  },
  beforeRouteEnter(to, from, next) {
    document.querySelector("#app").classList.add("dashboard-view")
    next();
  },
  beforeRouteLeave(to, from, next) {
    document.querySelector("#app").classList.remove("dashboard-view")
    next();
  },
}
</script>

<style scoped>

</style>
