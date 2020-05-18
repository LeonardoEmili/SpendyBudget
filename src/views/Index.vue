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

          <b-nav-item to="/about" class="border-right" style="margin-left: 10px;">{{$t('about_us')}}</b-nav-item>
          <b-nav-item to="/login">{{$t('login')}}</b-nav-item>
          <b-button
            variant="outline-success"
            style="padding: 0px 10px; margin-left: 20px;"
            pill
            v-on:mouseover="hovering = true"
            v-on:mouseleave="hovering = false"
          >
            <b-nav-item to="/signup">
              <span :class="{ 'hovering' : hovering}">{{$t('sign_up')}}</span>
            </b-nav-item>
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <center>
      <div id="welcome-div">
        {{$t()}}
        <h1>{{ $t('same_spending_tracker') }}</h1>
        <p>{{$t('a_simple_expense_tracker')}}</p>

        <div id="macbook-wrapper">
          <img src="../assets/img_macbook.png" height="530px" width="800px" />

          <div id="macbook-slider">
            <b-carousel :interval="3000">
              <b-carousel-slide>
                <template v-slot:img>
                  <img src="../assets/prova5.png" width="631px" height="400px" />
                </template>
              </b-carousel-slide>
              <b-carousel-slide>
                <template v-slot:img>
                  <img src="../assets/prova8.png" width="631px" height="400px" />
                </template>
              </b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
    </center>
  </div>
</template>

<script>
import * as utils from "../utils";

export default {
  name: "Index",
  created() {
    // Initialize the locale to be used
    // TODO: check if this conditions still holds (probably not)
    this.userLocaleIndex = utils.locales.findIndex(
      locale => locale.iso === utils.getCurrentLocale()
    );
  },
  data() {
    return {
      userLocaleIndex: 0,
      hovering: false
    };
  },
  computed: {
    locales: function() {
      return utils.locales;
    },
    currentISO: function() {
      return (
        utils.locales[this.userLocaleIndex].iso || utils.getCurrentLocale()
      );
    },
    userLanguage: function() {
      return utils.languageFromISO(this.currentISO);
    }
  },
  methods: {
    updateLocale: function(index) {
      this.userLocaleIndex = index;
      utils.changeLanguage(this.currentISO);
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
.hovering {
  color: white;
}

#macbook-slider {
  width: 631px;
  height: 400px;
  position: absolute;
  top: 42px;
  left: 85px;
}

#macbook-wrapper {
  position: relative;
  width: 800px;
  height: 530px;
}
</style>
