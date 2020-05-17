<template>
  <div>
    <b-navbar class="custom-nav" type="dark">
      <b-navbar-brand to="/dashboard" class="small-nav">
        <img src="../assets/logo.png" height="50px" width="50px" alt="app logo" />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown variant right class="short-dropdown">
          <template v-slot:button-content>
            <img
              id="user-profile-picture"
              v-show="userProfPic"
              v-bind:src="userProfPic"
              height="30px"
              width="30px"
              class="rounded-circle"
            />

            <span v-show="!userProfPic" class="picture-navbar">AB</span>
            <span id="user-profile-visiblename">{{userName}}</span>
          </template>
          <b-dropdown-item class="my-dropdown" to="/settings" variant="dark">{{$t('settings')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" to="/about" variant="dark">{{$t('about_us')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" v-on:click="logout" variant="dark">{{$t('logout')}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

    <div id="settings-wrapper">
      <b-row>
        <b-col id="settings-list" cols="1">
          <div v-for="(item,index) of items" :key="item">
            <div
              class="settings"
              :class="item !== selectedItem ? 'hvr-underline-from-center':'hvr-underline'"
              v-on:click="selectedIndex = index"
            >{{$t(item)}}</div>
          </div>
        </b-col>
        <b-col>
          <h5 class="settings-title">{{$t(currentTitle)}}</h5>
          <component v-bind:is="selectedTab"></component>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import AccountSettings from "../components/AccountSettings";
import CategorySettings from "../components/CategorySettings";
import { fetchUserData, logout } from "../utils";

export default {
  name: "Settings",
  created() {
    fetchUserData(user => (this.user = user));
  },
  data() {
    return {
      items: ["account", "all_categories"],
      componentNames: ["accountSettings", "categorySettings"],
      titles: ["account_settings", "category_settings"],
      selectedIndex: 0,
      user: {}
    };
  },
  components: {
    accountSettings: AccountSettings,
    categorySettings: CategorySettings
  },
  computed: {
    userProfPic: function() {
      return this.user && this.user.profPic ? this.user.profPic : "";
    },
    userName: function() {
      return this.user.name || this.user.email || "";
    },
    currentTitle() {
      return this.titles[this.selectedIndex];
    },
    selectedTab() {
      return this.componentNames[this.selectedIndex];
    },
    selectedItem() {
      return this.items[this.selectedIndex];
    }
  },
  methods: {
    logout() {
      logout();
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

#settings-list {
  min-width: 200px;
  margin-right: 6vw;
}

.my-dropdown {
  margin-left: -22px;
}
</style>