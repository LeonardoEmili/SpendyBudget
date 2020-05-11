<template>
  <div>
    <b-navbar type="light">
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" style="margin: 0; padding: 0">
          <b-nav-item-dropdown :text="userLanguage" right>
            <b-dropdown-item
              variant="dark"
              v-for="locale in locales"
              :key="locale.iso"
              v-on:click="userLocale=locale.iso"
            >
              <img
                :src="require('../assets/flags/' + locale.iso + '.png')"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 8px;"
              />
              <span :class="{ 'selected' : locale.iso == currentLocale}">{{locale.name}}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item to="/about">About Us</b-nav-item>
          <b-nav-item to="/login">Login</b-nav-item>
          <b-button variant="outline-success" style="padding: 0px 10px; margin-left: 10px;" pill>
            <b-nav-item to="/signup">Sign up</b-nav-item>
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <center>
      <div id="welcome-div">
        <h1>Same spending tracker, new style</h1>
        <p>A simpe expense tracker to help you manage your money.</p>
        <div style="margin-top:50px">
          <img src="../assets/chart1.png" width="240px" alt="." style="margin-right:50px" />

          <img src="../assets/chart2.png" width="240px" alt="." />
        </div>
      </div>
    </center>
  </div>
</template>

<script>
import { getUserLocale, locales, languageFromISO } from "../utils";

export default {
  name: "Index",
  mounted: function() {
    console.log(getUserLocale());
    //console.log(locales.includes(getUserLocale()));
  },
  data() {
    return {
      userLocale: ""
    };
  },
  computed: {
    locales: function() {
      return locales;
    },
    currentLocale: function() {
      return this.userLocale || getUserLocale();
    },
    userLanguage: function() {
      return languageFromISO(this.currentLocale);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
}
.selected {
  font-weight: bold;
}
</style>
