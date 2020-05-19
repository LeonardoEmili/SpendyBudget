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

      <b-button pill variant="success" id="cta-get-started" to="/signup">{{$t('get_started')}}</b-button>

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
    <div id="cards-container">
      <div class="fade-cards" v-for="(card,index) in cards" :key="index">
        <b-card class="shadow-sm mb-7 opacity-gradient-bg custom-cards"></b-card>
        <div class="custom-cards-content">
          <svgicon :icon="card.icon" width="70" height="70" :color="card.color" />
          <p class="custom-cards-title">{{$t(card.title)}}</p>
          <p class="custom-cards-description">{{$t(card.description)}}</p>
        </div>
      </div>
    </div>
    <div id="bottom-description">
      <p>
        <span>{{$t('you_wish_to_keep_track_etc')}}</span>
        <br />
        <span>{{$t('then_you_have_come_to_the_right_place')}}</span>
      </p>

      <p>
        <span>{{$t('spendybduget_is_a_simple_spending_tracker_etc')}}</span>
        <br />
        <span>{{$t('the_project_was_carried_etc')}}</span>
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
    this.onScrollAttached = true;
    // Initialize the locale to be used
    // TODO: check if this conditions still holds (probably not)
    this.userLocaleIndex = utils.locales.findIndex(
      locale => locale.iso === utils.getCurrentLocale()
    );
  },
  mounted() {
    if (this.onScrollAttached && window.scrollY > 450) {
      window.removeEventListener("scroll", this.handleScroll);
      this.onScrollAttached = false;
      this.fadeCards();
    }
  },
  destroyed() {
    if (this.onScrollAttached) {
      // Remove the onscroll listener
      window.removeEventListener("scroll", this.handleScroll);
    }
  },
  data() {
    return {
      previews: ["dashboard.png", "settings.png"],
      cards: [
        {
          icon: "benefit",
          color: "#d32f2f",
          title: "second_card_title",
          description: "first_card_description"
        },
        {
          icon: "chat",
          color: "#388e3c",
          title: "first_card_title",
          description: "second_card_description"
        },
        {
          icon: "shield",
          color: "#5c6bc0",
          title: "third_card_title",
          description: "third_card_description"
        }
      ],
      userLocaleIndex: 0,
      slide: 0,
      onScrollAttached: false,
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
    fadeCards() {
      let cards = document.getElementsByClassName("fade-cards");
      cards[0].className += " animated animatedFadeInUp fadeInUp";
      cards[1].className += " animated animatedFadeInUp fadeInUp";
      cards[2].className += " animated animatedFadeInUp fadeInUp";
    },
    handleScroll() {
      // Any code to be executed when the window is scrolled
      if (this.onScrollAttached && window.scrollY > 450) {
        window.removeEventListener("scroll", this.handleScroll);
        this.onScrollAttached = false;
        this.fadeCards();
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

#cta-get-started {
  font-size: 20px;
  padding: 5px 30px;
  margin-top: 40px;
  margin-bottom: 40px;
  color: white;
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

#bottom-description {
  color: #666;
  max-width: 1200px;
  margin: auto;
  padding: 40px 100px 60px 100px;
  text-align: center;
}

#description {
  margin-top: 10px;
  font-size: 18px;
}

#cards-container {
  margin-top: 100px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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

.opacity-gradient-bg {
  mask-image: none;
  -webkit-mask-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgba(255, 255, 255, 1)),
    to(rgba(255, 255, 255, 0.1))
  );
}

.custom-cards {
  margin-right: 40px;
  border-radius: 8px;
  height: 320px;
}

.custom-cards-content {
  position: absolute;
  top: 0;
  left: 40px;
  right: 50px;
  padding-right: 30px;
  padding-top: 30px;
}

.custom-cards-title {
  color: #444;
  font-size: 20px;
  font-weight: bold;
  margin-top: 40px;
}

.custom-cards-description {
  line-height: 1.8;
  font-size: 17px;
  color: #444;
}

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@-webkit-keyframes fadeInUp {
  from {
    transform: translate3d(0, 40px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: both;
}

.animatedFadeInUp {
  opacity: 0;
}

.fadeInUp {
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
}

.fade-cards {
  position: relative;
  width: 380px;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
  opacity: 0;
}
</style>