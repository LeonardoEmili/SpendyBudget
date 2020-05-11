<template>
  <div>
    <b-navbar type="light">
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="userLanguage" right>
            <b-dropdown-item
              variant="dark"
              v-for="(locale, index) in locales"
              :key="locale.iso"
              v-on:click="updateLocale(index)"
            >
              <img
                :src="require('../assets/flags/' + locale.iso + '.png')"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 8px;"
              />
              <span :class="{ 'selected' : locale.iso == currentISO}">{{locale.name}}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item to="/about" class="border-right" style="margin-left: 10px;">About us</b-nav-item>
          <b-nav-item to="/login">Login</b-nav-item>
          <b-button variant="outline-success" style="padding: 0px 10px; margin-left: 20px;" pill>
            <b-nav-item to="/signup">Sign up</b-nav-item>
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <center>
      <div id="welcome-div">
        {{$t()}}
        <h1>{{ $t('same_spending_tracker') }}</h1>
        <p>{{$t('a_simple_expense_tracker')}}</p>
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
import i18n from "../plugins/i18n-vue";

export default {
  name: "Index",
  created() {
    // Initialize the locale to be used
    this.userLocaleIndex = locales.findIndex(
      locale => locale.iso === getUserLocale()
    );
  },
  data() {
    return {
      userLocaleIndex: 0
    };
  },
  computed: {
    locales: function() {
      return locales;
    },
    currentISO: function() {
      return locales[this.userLocaleIndex].iso || getUserLocale();
    },
    userLanguage: function() {
      return languageFromISO(this.currentISO);
    }
  },
  methods: {
    updateLocale: function(index) {
      this.userLocaleIndex = index;
      i18n.locale = this.currentISO;
      localStorage.setItem("userLocale", i18n.locale);
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
