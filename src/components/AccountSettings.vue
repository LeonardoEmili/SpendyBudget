<template>
  <div>
    <p style="font-size:14px;">Profile photo</p>

    <div>
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
        id="default-img"
        width="110px"
        height="110px"
        ref="img"
        src="../assets/user.png"
        class="rounded-circle"
        :style="borderStyle"
      />

      <input type="file" ref="file" v-on:change="uploadImage" style="display: none" />
      <b-button size="sm" variant="primary" id="my-btn" v-on:click="$refs.file.click()">
        <upload-icon></upload-icon>
        <span>Upload photo</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import * as utils from "../utils";
import * as functions from "../plugins/firebase";

// import Cropper from "cropperjs";

export default {
  name: "AccountSettings",
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
      }
    };
  },
  computed: {},
  methods: {
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.profPic = e.target.result;
        functions.uploadProfilePhoto(this.profPic);
      };
    }
  }
};
</script>

<style>
#my-btn {
  margin-left: 20px;
}
#my-btn span {
  margin-left: 10px;
  padding-right: 4px;
}
#default-img {
  padding: 6px;
}
</style>