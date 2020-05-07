<template>
  <b-container style="; margin: 6vh auto; width: 50vw; min-width: 500px;">
    <b-row style="min-width: 400px;">
      <b-col cols="3" style>
        <div v-for="item of items" :key="item">
          <div
            :class="item !== 'Account' ? 'hvr-underline-from-center':'hvr-underline'"
            style="padding-bottom: 5px; margin-bottom: 25px;"
          >{{item}}</div>
        </div>
      </b-col>
      <b-col>
        <h5 style="margin-bottom: 30px;">Account Settings</h5>
        <p style="font-size:14px;">Profile photo</p>

        <div style="width:400px;">
          <img
            v-show="profPic"
            width="110px"
            height="110px"
            ref="img"
            :src="profPic"
            class="rounded-circle"
            :style="borderStyle"
          />

          <img
            v-show="!profPic"
            style="padding:6px;"
            width="104px"
            height="104px"
            ref="img"
            src="../assets/user.png"
            class="rounded-circle"
            :style="borderStyle"
          />

          <input type="file" ref="file" v-on:change="uploadImage" style="display: none" />
          <b-button
            size="sm"
            variant="primary"
            style="margin-left:20px;"
            v-on:click="$refs.file.click()"
          >
            <upload-icon></upload-icon>
            <span style="margin-left: 10px; padding-right: 4px;">Upload photo</span>
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import Cropper from "cropperjs";
import * as functions from "../plugins/firebase";
import * as utils from "../utils";

export default {
  name: "Settings",
  created() {
    let vm = this;
    utils.fetchUserProfilePicture(profPic => (vm.profPic = profPic));
  },
  data() {
    return {
      cropper: null,
      profPic: null,
      borderStyle: {
        color: "blue",
        borderStyle: "dotted"
      },
      items: ["Account", "All categories"]
    };
  },
  methods: {
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewImg = e.target.result;
        functions.uploadProfilePhoto(this.previewImg);
      };
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
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  overflow: hidden;
}
.hvr-underline {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  display: inline-block;
  border-bottom: 4px solid #2098d1;
  padding-bottom: 5px;
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
</style>
