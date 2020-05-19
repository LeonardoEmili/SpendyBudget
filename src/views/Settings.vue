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

            <span v-show="!userProfPic" class="picture-navbar">{{nameInitials}}</span>
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
              class="settings-list-item"
              :class="item !== selectedItem ? '':'selected-tile'"
              v-on:mouseover="improveHover(0)"
              v-on:mouseleave="improveHover(6)"
              v-on:click="selectedIndex = index"
            >
              <div
                class="settings"
                :class="item !== selectedItem ? 'hvr-underline-from-center':'hvr-underline'"
              >{{$t(item)}}</div>
            </div>
          </div>
        </b-col>
        <b-col id="main-content-wrapper">
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
    },
    nameInitials: function() {
      if (!this.user.name || !this.user.surname) {
        return "";
      }
      return (
        this.user.name[0].toUpperCase() + this.user.surname[0].toUpperCase()
      );
    }
  },
  methods: {
    logout() {
      logout();
    },
    improveHover(radius) {
      // Since there are only two tiles its straightforward to merge their border, otherwise an index would be required
      let items = document.getElementsByClassName("settings-list-item");
      let topItem = items[0];
      let bottomElement = items[1];
      // Merge borders of top and bottom elements
      topItem.style.borderBottomRightRadius = radius + "px";
      topItem.style.borderBottomLeftRadius = radius + "px";

      bottomElement.style.borderTopRightRadius = radius + "px";
      bottomElement.style.borderTopLeftRadius = radius + "px";
    }
  }
};
</script>

<style>
.selected-tile {
  background-color: #fafafa;
  color: #39a1d2;
}

.settings {
  cursor: pointer;
  padding-top: 16px;
  padding-bottom: 16px;
}

.settings-title {
  margin-bottom: 30px;
}

#settings-wrapper {
  width: 60vw;
  margin: 20px auto 0px auto;
  min-width: 800px;
}

.my-dropdown {
  margin-left: -22px;
}

#settings-list {
  padding-right: 160px;
  padding-top: 0px;
}

.settings-list-item {
  padding-left: 20px;
  padding-right: 160px;
  border-radius: 6px;
}

.settings-list-item:hover {
  background-color: #fafafa;
  color: #39a1d2;
  cursor: pointer;
}

#main-content-wrapper {
  padding-left: 50px;
  padding-top: 30px;
  padding-right: 30px;
  background-color: #fafafa;
  border-radius: 14px;
}
</style>