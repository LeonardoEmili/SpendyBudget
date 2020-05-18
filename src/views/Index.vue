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
                class="sel-flags"
              />
              <span :class="{ 'selected' : locale.iso == currentISO}">{{locale.name}}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item to="/about" class="border-right" id="about">{{$t('about_us')}}</b-nav-item>
          <b-nav-item to="/login">{{$t('login')}}</b-nav-item>
          <b-button
            variant="outline-success"
            id="register-btn"
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

    <div id="wrapper">
      {{$t()}}
      <h1>{{ $t('same_spending_tracker') }}</h1>
      <p id="description">{{$t('a_simple_expense_tracker')}}</p>

      <b-button
        pill
        variant="success"
        style="font-size: 20px; padding-left: 32px; padding-right: 32px; margin-top: 40px; margin-bottom: 40px"
      >Get Started</b-button>

      <div id="macbook-wrapper">
        <img src="../assets/img_macbook.png" height="530px" width="800px" />

        <div id="macbook-slider">
          <b-carousel v-model="slide" :interval="3000">
            <b-carousel-slide v-for="preview in previews" v-bind:key="preview">
              <template v-slot:img>
                <img :src="require('../assets/previews/' + preview)" width="631px" height="400px" />
              </template>
            </b-carousel-slide>
          </b-carousel>
          <div id="dot-frame">
            <div
              v-for="(item,index) in previews"
              v-bind:key="index"
              :class="index === slide ? 'selected-dot':'generic-dot'"
              v-on:click="slide=index"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 100px; max-width: 1200px; margin-left: auto; margin-right: auto;">
      <div
        style="position: relative; width: 380px; display: inline-block; margin-left: 10px; margin-right: 10px;"
      >
        <b-card
          class="shadow-sm mb-7 prova"
          style="margin-right: 40px; border-radius: 8px; height: 320px;"
        ></b-card>

        <div
          style="position: absolute; top: 0; left: 40px; right: 50px; padding-right: 30px; padding-top: 30px;"
        >
          <svgicon icon="benefit" width="70" height="70" color="#d32f2f" />
          <p style="color: #444; font-size: 20px; font-weight: bold; margin-top: 40px;">Easy monitor</p>
          <p
            style="line-height:1.8; font-size: 17px;"
          >Control over all of your expenses to help you save money.</p>
        </div>
      </div>

      <div
        style="position: relative; width: 380px; display: inline-block; margin-left: 10px; margin-right: 10px;"
      >
        <b-card
          class="shadow-sm mb-7 prova"
          style="margin-right: 40px; border-radius: 8px; height: 320px;"
        ></b-card>

        <div
          style="position: absolute; top: 0; left: 40px; right: 50px; padding-right: 30px; padding-top: 30px;"
        >
          <svgicon icon="chat" width="70" height="70" color="#388e3c" />
          <p
            style="color: #444; font-size: 20px; font-weight: bold; margin-top: 40px;"
          >Beautiful charts</p>
          <p
            style="line-height:1.8; font-size: 17px;"
          >Check your balance through by our interactive charts.</p>
        </div>
      </div>

      <div
        style="position: relative; width: 380px; display: inline-block; margin-left: 10px; margin-right: 10px;"
      >
        <b-card
          class="shadow-sm mb-7 prova"
          style="margin-right: 40px; border-radius: 8px; height: 320px;"
        ></b-card>

        <div
          style="position: absolute; top: 0; left: 40px; right: 50px; padding-right: 30px; padding-top: 30px;"
        >
          <svgicon icon="shield" width="70" height="70" color="#5c6bc0" />
          <p style="color: #444; font-size: 20px; font-weight: bold; margin-top: 40px;">Safe place</p>
          <p
            style="line-height:1.8; font-size: 17px;"
          >Our systems provide secure ways to store and manipulate data.</p>
        </div>
      </div>

      <p style="color: #666; margin-top: 80px; margin-bottom: 60px;">
        You’ve just started a new business or you wish to keep track of all your expenses on projects in a single place?
        Then you’ve come to the right place!
        Spendy is a simple and convenient service that allows keeping track of the money you spend on your startups and websites. Only your expenses and nothing else! We’ve decided not to overburden this service with invoices, income, and document flow, but rather concentrate only on expenses. Why would we do such a thing? Many startups are built by people from the ground up using their own money. Thus, it is important to remember how much money you’ve take out from the ‘family’ budget. When starting out it is vital to keep track of how much you spent and on what.
        Spendy is suitable for any type of project, since you yourself choose the categories of your expenses, and their number is unlimited. Give this system a try and decide whether you’d like stay with us or choose another system.
      </p>
    </div>
  </div>
</template>

<script>
import * as utils from "../utils";
import "../compiled-icons/";

export default {
  name: "Index",
  created() {
    window.addEventListener("scroll", this.handleScroll);
    // Initialize the locale to be used
    // TODO: check if this conditions still holds (probably not)
    this.userLocaleIndex = utils.locales.findIndex(
      locale => locale.iso === utils.getCurrentLocale()
    );
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  data() {
    return {
      previews: ["dashboard.png", "settings.png"],
      userLocaleIndex: 0,
      slide: 0,
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
    handleScroll() {
      // Any code to be executed when the window is scrolled
      if (window.scrollY > 400) {
        //let cards = document.getElementsByClassName("prova");
      }
    },
    updateLocale: function(index) {
      this.userLocaleIndex = index;
      utils.changeLanguage(this.currentISO);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#wrapper {
  max-width: 800px;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-bottom: 50px;
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

.generic-dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  border: 3px solid #3f51b5;
  display: inline-block;
  margin: auto 8px;
}

.selected-dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background-color: #3f51b5;
  display: inline-block;
  margin: auto 8px;
}

.generic-dot:hover {
  cursor: pointer;
}

.selected-dot:hover {
  cursor: pointer;
}

#dot-frame {
  margin-top: 80px;
}

#description {
  margin-top: 10px;
  font-size: 18px;
}

.sel-flags {
  margin-left: -15px;
  margin-right: 8px;
}

#about {
  margin-left: 10px;
}

#register-btn {
  padding: 0px 10px;
  margin-left: 20px;
}

.prova {
  mask-image: none;
  -webkit-mask-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgba(0, 0, 0, 1)),
    to(rgba(0, 0, 0, 0.1))
  );
}
</style>