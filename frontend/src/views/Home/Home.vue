<template>
  <div class="home">
    <div class="hero-section section">
      <div class="hero-section-text">
        <h1>The cloud-based password manager for your personal needs</h1>
        <p><i>vaults</i> is the easiest and safest way to store your passwords & generate new ones while having access to them from anywhere.</p>

        <button class="btn" @click="$router.push('/register')">Try it out</button>
      </div>

      <img src="@/assets/homepage/svgs/undraw_vault_re_s4my.svg" alt="">
    </div>

    <div class="features-section section">
      <h1>Surf safely on the internet using these features...</h1>
      <div class="features">
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-privat-2-80.png" alt="A lock, symbolizing secure storage.">
          <h2>Highly secure</h2>
          <p>Your passwords only leave your device after being encrypted using military-grade security.</p>
        </div>
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-cloud-sync-50.png" alt="A cloud icon, showing the data is synchronized.">
          <h2>Synced everywhere</h2>
          <p>Access your data securely from every device, be it mobile or desktop. Your data is automatically synchronized.</p>
        </div>
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-dokumente-50.png" alt="A documents icon.">
          <h2>Documents storage</h2>
          <p>Create and save notes besides your normal logins- keep track of your most important things such as Wi-Fi passwords, memberships, bank cards etc.</p>
        </div>
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-open-source-50.png" alt="The Open Source Initiative logo.">
          <h2>Open source software</h2>
          <p>The safest software is the most transparent software. Our source code is openly accessible for everyone to check for vulnerabilities.</p>
        </div>
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-password-96.png" alt="An icon showing a secure, hidden password.">
          <h2>Secure password generation</h2>
          <p>Create cryptographically secure passwords to protect your accounts from getting hacked.</p>
        </div>
        <div class="feature">
          <img src="@/assets/homepage/features/icons8-checkmark-192.png" alt="A checkmark.">
          <h2>Free to use</h2>
          <p>This password manager is completely free of charge.</p>
        </div>
      </div>
    </div>

    <div class="tutorial-section section">
      <h1>How to get started...</h1>
      <div class="step">
        <p>- Sign up using a unique, long and hard to guess password. <br> This is called the master password and it's the key to all your data.
          Keep this secure at all times as it is not recoverable and you cannot change it.</p>
        <img src="@/assets/homepage/svgs/undraw_security_on_re_e491.svg" alt="An illustration showing a man standing near a shield with a checkmark on it.">
      </div>
      <div class="step">
        <p>- Create one or multiple vaults. You can have a personal vault and a vault for work-only accounts or however you wish.</p>
      </div>
      <div class="step">
        <p>- Create a login for a website and fill in your data, generating a secure password for it on demand.
        You can also create notes and use them for your other important things such as bank cards, memberships, etc.</p>
      </div>
      <div class="step">
        <img src="@/assets/homepage/svgs/undraw_secure_server_re_8wsq.svg" alt="An illustration of a woman near a rack of servers and a shield between them.">
        <p>Remember, your vault and all the items you put inside it get encrypted everytime before leaving your device & getting stored on our servers;
          ensuring only you know what you have stored, and only you can decrypt it using your master password!</p>
      </div>
      <button class="btn" @click="$router.push('/register')">Sign up here</button>
    </div>

    <footer class="section">
      <div class="footer-items">
        <img src="@/assets/icons8-github-192.png" alt="GitHub platform Logo" @click="redirectToRepository">
        <p>Terms and conditions</p>
        <p>Privacy policy</p>
        <p>Imprint</p>
        <router-link to="/attributions">Attributions</router-link>
      </div>
    </footer>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods: {
    redirectToRepository() {
      window.open("https://github.com/MatrixEternal/vaults", "_blank")
    }
  }
}
</script>
