<template>
  <div>
    <b-navbar type="dark" style="background-color: #088ac7; margin-bottom: 20px;">
      <b-navbar-brand class="small-nav">
        <img src="../assets/logo.png" height="50px" width="50px" alt="app logo" />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown variant right class="short-dropdown">
          <template v-slot:button-content>
            <img
              v-if="userProfPic.length > 0"
              v-bind:src="userProfPic"
              height="40px"
              width="40px"
              class="rounded-circle picture-navbar"
            />

            <span class="picture-navbar">AB</span>
            <span style="color: white">{{userName}}</span>
          </template>
          <b-dropdown-item class="my-dropdown" to="/settings" variant="dark">{{$t('settings')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" to="/about" variant="dark">{{$t('about_us')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" v-on:click="logout" variant="dark">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

    <div id="settings-wrapper">
      <b-row style="min-width: 400px;">
        <b-col cols="1" style="min-width:200px; margin-right: 6vw;">
          <div v-for="(item,index) of items" :key="item">
            <div
              class="settings"
              :class="item !== selectedItem ? 'hvr-underline-from-center':'hvr-underline'"
              v-on:click="selectedIndex = index"
            >{{item}}</div>
          </div>
        </b-col>
        <b-col>
          <h5 class="settings-title">{{currentTitle}}</h5>
          <component v-bind:is="selectedTab"></component>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import AccountSettings from "../components/AccountSettings";
import CategorySettings from "../components/CategorySettings";

export default {
  name: "Settings",
  data() {
    return {
      items: ["Account", "All categories"],
      componentNames: ["accountSettings", "categorySettings"],
      titles: ["Account Settings", "Category Settings"],
      selectedIndex: 0
    };
  },
  components: {
    accountSettings: AccountSettings,
    categorySettings: CategorySettings
  },
  computed: {
    currentTitle() {
      return this.titles[this.selectedIndex];
    },
    selectedTab() {
      return this.componentNames[this.selectedIndex];
    },
    selectedItem() {
      return this.items[this.selectedIndex];
    }
  }
};
</script>

<style>
/* Underline From Center */
.hvr-underline-from-center {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  position: relative;
  overflow: hidden;
}
.hvr-underline {
  display: inline-block;
  border-bottom: 4px solid #2098d1;
}
.hvr-underline-from-center:before {
  content: "";
  position: absolute;
  z-index: -1;
  left: 51%;
  right: 51%;
  bottom: 0;
  background: #2098d1;
  height: 4px;
  -webkit-transition-property: left, right;
  transition-property: left, right;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
.hvr-underline-from-center:hover:before,
.hvr-underline-from-center:focus:before,
.hvr-underline-from-center:active:before {
  left: 0;
  right: 0;
}

.settings {
  cursor: pointer;
  padding-bottom: 5px;
  margin-bottom: 25px;
}

.settings-title {
  margin-bottom: 30px;
}

#settings-wrapper {
  width: 60vw;
  margin: auto;
  min-width: 800px;
}
</style>