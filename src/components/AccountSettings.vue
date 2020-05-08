<template>
  <div>
    <h6 class="my-headers">Profile photo</h6>

    <div id="photo-wrapper">
      <img
        v-show="user.profPic"
        width="110px"
        height="110px"
        ref="img"
        :src="user.profPic"
        class="rounded-circle"
        :style="borderStyle"
      />

      <img
        v-show="!user.profPic"
        id="default-img"
        width="110px"
        height="110px"
        ref="img"
        src="../assets/user.png"
        class="rounded-circle"
        :style="borderStyle"
      />

      <input type="file" ref="file" v-on:change="uploadImage" id="custom-input" />
      <b-button size="sm" variant="primary" id="custom-btn" v-on:click="$refs.file.click()">
        <upload-icon></upload-icon>
        <span>Upload photo</span>
      </b-button>
    </div>

    <h6 class="my-headers">General Settings</h6>

    <b-form v-on:submit.prevent="onSubmit">
      <b-row>
        <b-col class="my-cols">
          <b-form-group label="Name" class="custom-font">
            <b-form-input size="sm" type="text" v-model="user.name" placeholder="Your name"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col class="my-cols">
          <b-form-group label="Surname" class="custom-font">
            <b-form-input size="sm" type="text" v-model="user.surname" placeholder="Your surname"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="my-cols">
          <b-form-group label="Sex (optional)" size="sm" class="custom-font">
            <b-form-select v-model="user.gender" size="sm">
              <b-form-select-option value="null" disabled>Sex</b-form-select-option>
              <b-form-select-option value="M">Male</b-form-select-option>
              <b-form-select-option value="F">Female</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="my-cols">
          <b-form-group label="Date of birth (optional)" size="sm" class="custom-font">
            <b-form-datepicker
              size="sm"
              v-model="user.birthdate"
              :locale="locale"
              placeholder="Choose a date"
            ></b-form-datepicker>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="my-cols">
          <b-form-group label="Email address:" class="custom-font">
            <b-form-input
              size="sm"
              type="email"
              v-model="user.email"
              placeholder="example@gmail.com"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button id="submit-btn" block size="sm" type="submit">Update settings</b-button>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-form>
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
    //utils.fetchUserProfilePicture(profPic => (vm.profPic = profPic));
    utils.fetchUserData(user => {
      vm.user.profPic = user.profPic || vm.user.profPic;
      vm.user.name = user.name || vm.user.name;
      vm.user.surname = user.surname || vm.user.surname;
      vm.user.sex = user.sex || vm.user.sex;
      vm.user.birthdate = user.birthdate || vm.user.birthdate;
      vm.user.email = user.email || vm.user.email;
      vm.user.locale = user.locale || vm.user.locale;
    });
  },
  data() {
    return {
      cropper: null,
      user: {
        name: "GINO",
        surname: "LEGEND",
        profPic: null,
        gender: "F",
        birthdate: "2020-05-06"
      },
      borderStyle: {
        color: "blue",
        borderStyle: "dotted",
        borderWidth: "thin"
      }
    };
  },
  computed: {
    locale() {
      // ["it-IT", "us-US"]
      return "it-IT";
    }
  },
  methods: {
    onSubmit() {
      console.log(this.user);
    },
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.user.profPic = e.target.result;
        functions.uploadProfilePhoto(this.user.profPic);
      };
    }
  }
};
</script>

<style>
#custom-btn {
  margin-left: 20px;
}
#custom-btn span {
  margin-left: 10px;
  padding-right: 4px;
}
#default-img {
  padding: 6px;
}
.my-cols {
  padding-top: 2px;
  padding-bottom: 2px;
  min-width: 240px;
}
.my-headers {
  margin-top: 10px;
  margin-bottom: 20px;
}
#photo-wrapper {
  margin-bottom: 30px;
}
#custom-input {
  display: none;
}
.custom-font {
  font-size: 14px;
}
#submit-btn {
  margin-top: 20px;
}
</style>