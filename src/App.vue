<template>
  <!-- navbar -->
  <div id="app">
    <router-view />
    <b-card
    id = "footer"
    >
    <b-row id = "footer-row">
      <b-col>
    <b-card-text class="footer-text">
      SpendyBudget 2020
    </b-card-text>
      </b-col>
      <b-col>
      <b-button
      variant="link">
      <img 
        v-on:click="openGithub"
        src="./assets/github_logo.png" 
        width = "80px"
        alt="Github logo"/>
      </b-button>
      </b-col>
     
    </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  methods : {
    openGithub() {
      window.open("https://github.com/LeonardoEmili/SpendyBudget", "_blank");
    }
  }
}
</script>


<style scoped>
 #footer {
   background-color: darkslategrey;
  position: absolute;
    bottom: 0;
    left: 0;
    height: 100px;
    width: 100%;
    text-align: center;
 }
 #footer-row {
 }
 .footer-text {
   color: aliceblue;
 }
</style>