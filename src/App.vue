<template>
  <!-- navbar -->
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
</template>

<script>
import { signInSilently, initUserData } from "./plugins/firebase";

export default {
  created() {
    initUserData();
  },
  data() {
    return {
      footerVisible: true
    };
  },
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
  height: 70px;
}

.when-keyboard {
  visibility: hidden;
}

#app {
  position: relative;
  min-height: 100vh;
}

#router-view {
  padding-bottom: 70px;
}
</style>