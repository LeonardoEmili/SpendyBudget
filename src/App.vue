<template>
  <!-- navbar -->
  <v-app>
    <b-overlay :show="showProgress" spinner-variant="primary">
      <div id="app">
        <!-- Currently loaded page (through the router) -->
        <router-view id="router-view" />
        <div v-show="footerVisible" ref="footer">
          <v-footer padless dark absolute>
            <v-card class="flex" flat tile id="footer">
              <v-card-title>
                <div>
                  <v-card-text class="py-2 white--text">
                    <strong>SpendyBudget</strong>
                    {{ new Date().getFullYear() }}
                  </v-card-text>
                </div>

                <v-spacer></v-spacer>

                <v-btn class="mx-4 white--text" v-on:click="openGithub" icon>
                  <v-icon large>mdi-github</v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
          </v-footer>
        </div>
      </div>
    </b-overlay>
  </v-app>
</template>

<script>
import { signInSilently } from "./plugins/firebase";
import { initUserData, initLanguage } from "./utils";
import { app } from "./main";

export default {
  created() {
    initUserData();
    initLanguage();
    app.showProgress = true;
    signInSilently(() => (app.showProgress = false));
  },
  data() {
    return {
      footerVisible: true,
    };
  },
  computed: {
    showProgress() {
      return app.showProgress;
    }
  },
  methods: {
    openGithub() {
      window.open("https://github.com/LeonardoEmili/SpendyBudget", "_blank");
    }
  }
};
</script>


<style>
#footer {
  background-color: #24292e;
  height: 70px;
}

.when-keyboard {
  visibility: hidden;
}

#app {
  position: relative;
  min-height: 100vh;
  background-color: whitesmoke;
}

#router-view {
  padding-bottom: 70px;
}

.picture-navbar {
  margin-right: 10px;
  border-radius: 50%;
  background: #00695c;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  padding: 8px;
}

html::-webkit-scrollbar {
  display: none;
}

.small-nav {
  padding: 0;
}

.custom-nav {
  background-color: #088ac7;
  margin-bottom: 20px;
}

#user-profile-picture {
  margin-right: 10px;
}

#user-profile-visiblename {
  color: white;
  margin-right: 4px;
}
</style>