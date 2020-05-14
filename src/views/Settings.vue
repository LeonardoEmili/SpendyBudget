<template>
  <div id="settings-wrapper">
    <b-row style="min-width: 400px;">
      <b-col cols="2" style="min-width:200px;">
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

<style scoped>
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
  width: 50vw;
  margin: auto;
  min-width: 800px;
}
</style>