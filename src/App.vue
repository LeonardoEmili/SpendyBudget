<template>
  <!-- navbar -->
  <div id="app">
    <!-- Currently loaded page (through the router) -->
    <router-view />

    <v-footer absolute padless dark>
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

    <!--
    <b-card id="footer">
      <b-row>
        <b-col>
          <b-card-text class="footer-text">SpendyBudget 2020</b-card-text>
        </b-col>
        <b-col>
          <b-button variant="link">
            <img
              v-on:click="openGithub"
              src="./assets/github_logo.png"
              width="80px"
              alt="Github logo"
            />
          </b-button>
        </b-col>
      </b-row>
    </b-card>-->
  </div>
</template>

<script>
import { signInSilently } from "./plugins/firebase";

export default {
  methods: {
    openGithub() {
      window.open("https://github.com/LeonardoEmili/SpendyBudget", "_blank");
    }
  },

  mounted: function() {
    signInSilently();
  }
};
</script>


<style scoped>
#footer {
  background-color: #24292e;
}

.footer-text {
  color: aliceblue;
}
</style>