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

    <p style="font-size: 36px; margin-top: 0px; text-align: center;">
      <span style="font-weight: bold;">{{$t('our')}}</span>
      <span>&nbsp;Team</span>
    </p>

    <div style="max-width: 700px; margin-left: auto; margin-right: auto; margin-top: 20px;">
      <b-row>
        <b-col v-for="(developer,index) in developers" :key="index">
          <b-card
            class="mx-auto custom-card"
            style="max-width: 330px; text-align: center; border-radius: 20px; padding: 0;"
          >
            <img
              height="160px"
              width="160px"
              class="rounded-circle"
              :src="'https://github.com/' + developer.githubName + '.png?size=160'"
              style="display:block; margin: auto;"
            />
            <h5 style="margin-top: 20px;">{{developer.name}}</h5>

            <p style="font-size: 15px; color: #666;">
              {{$t(developer.position)}}
              <br />
              {{new Date().getFullYear() - developer.year}} {{$t('years_old')}}
            </p>

            <v-divider class="mx-4"></v-divider>

            <v-btn class="mx-4" icon v-on:click="openGithubProfile(developer.githubName)">
              <v-icon>mdi-github</v-icon>
            </v-btn>
            <v-btn class="mx-4" icon v-on:click="openLinkedinProfile(developer.linkedinName)">
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
            <v-btn v-show="developer.website" class="mx-4" icon v-on:click="openWebsite(developer.website)">
              <v-icon>mdi-web</v-icon>
            </v-btn>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <p style="font-size: 32px; margin-top: 40px; text-align: center;">{{$t('the_project')}}</p>

    <div style="max-width: 1000px; text-align: center; margin: auto; padding-top: 20px;">
      <p>{{$t('spendybduget_is_a_simple_spending_tracker_etc')}}</p>
      <p>{{$t('the_project_was_carried_etc')}}</p>
    </div>
  </div>
</template>

<script>
import * as utils from "../utils";

export default {
  name: "AboutUs",
  created() {
    this.userLocaleIndex = utils.locales.findIndex(
      locale => locale.iso === utils.getCurrentLocale()
    );
  },
  data() {
    return {
      developers: [
        {
          name: "Leonardo Emili",
          year: 1998,
          githubName: "LeonardoEmili",
          linkedinName: "leonardoemili",
          position: "student_at_sapienza"
        },
        {
          name: "Alessio Luciani",
          year: 1999,
          githubName: "AlessioLuciani",
          linkedinName: "alessioluciani",
          position: "student_at_sapienza",
          website: "https://www.aluc.dev"
        }
      ],
      userLocaleIndex: 0,
      hovering: false
    };
  },
  methods: {
    updateLocale: function(index) {
      this.userLocaleIndex = index;
      utils.changeLanguage(this.currentISO);
    },
    openGithubProfile(username) {
      window.open("https://github.com/" + username);
    },
    openLinkedinProfile(username) {
      window.open("https://www.linkedin.com/in/" + username);
    },
    openWebsite(url) {
      window.open(url);
    }
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
  }
};
</script>

<style scoped>
.sel-flags {
  margin-left: -15px;
  margin-right: 8px;
}
.selected {
  font-weight: bold;
}

.hovering {
  color: white;
}

#register-btn {
  padding: 0px 10px;
  margin-left: 20px;
}
#about {
  margin-left: 10px;
}

.icons-contact {
  color: black;
}

.custom-card {
  padding: 15px; /* JUST TO LOOK COOL */
  border: 1px solid #eee; /* JUST TO LOOK COOL */
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px;
  transition: all 0.3s ease-in-out;
}

.custom-card:hover {
  box-shadow: rgba(0, 0, 0, 0.22) 0px 19px 43px;
  transform: translate3d(0px, -1px, 0px);
}
</style>