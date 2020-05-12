<template>
  <div>
    <h6 class="my-headers">Profile photo</h6>

    <div id="photo-wrapper">
      <img
        v-show="profPic"
        width="110px"
        height="110px"
        ref="img"
        :src="profPic"
        class="rounded-circle"
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

      <input type="file" ref="file" v-on:change="uploadImage" accept="image/*" id="custom-input" />
      <b-button size="sm" variant="primary" id="custom-btn" v-on:click="$refs.file.click()">
        <upload-icon></upload-icon>
        <span>Upload photo</span>
      </b-button>
    </div>

    <vue-croppie id="my-croppie" ref="croppieRef"></vue-croppie>

    <b-form v-on:submit.prevent="onSubmit" id="account-form">
      <h6 class="my-headers">General Settings</h6>
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

      <h6 class="my-headers">Localization settings</h6>

      <b-row>
        <b-col class="my-cols">
          <b-form-group label="Account currency" size="sm" class="custom-font">
            <b-form-select v-model="user.currency" size="sm">
              <b-form-select-option value="null" disabled>Sex</b-form-select-option>
              <b-form-select-option value="M">Male</b-form-select-option>
              <b-form-select-option value="F">Female</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="my-cols">
          <b-form-group label="Language" size="sm" class="custom-font">
            <b-form-select v-model="user.locale" size="sm">
              <b-form-select-option
                v-for="locale in locales"
                :value="locale.iso"
                :key="locale.iso"
              >{{locale.name}}</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <b-row>
      <b-col>
        <b-button
          id="submit-btn"
          block
          size="sm"
          type="submit"
          v-on:click="onSubmit"
        >Update settings</b-button>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>

<script>
import * as utils from "../utils";
import * as functions from "../plugins/firebase";

export default {
  name: "AccountSettings",
  created() {
    let vm = this;
    utils.fetchUserName(name => (vm.user.name = name));
    utils.fetchUserSurname(surname => (vm.user.surname = surname));
    utils.fetchUserProfilePicture(profPic => (vm.profPic = profPic));
    utils.fetchUserGender(gender => (vm.user.gender = gender));
    utils.fetchUserBirthdate(birthdate => (vm.user.birthdate = birthdate));
    utils.fetchUserEmail(email => (vm.user.email = email));
    utils.fetchUserLocale(locale => (vm.user.locale = locale));
  },
  data() {
    return {
      profPic: null,
      user: {
        name: "",
        surname: "",
        email: "",
        gender: "",
        birthdate: "",
        locale: ""
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
    },
    locales() {
      return utils.locales;
    }
  },
  methods: {
    onSubmit() {
      utils.updateLocalUser(this.user);
      functions.updateUserData(this.user);
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const croppie = this.$refs.croppieRef;
      utils.resizeImage(file, croppie, result => {
        this.profPic = result;
        functions.uploadProfilePhoto(result);
        utils.updateLocalUser({ profPic: result });
      });
    }
  }
};
</script>

<style scoped>
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
  font-size: 16px;
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

#account-form {
  max-width: 550px;
}

#my-croppie {
  opacity: 0;
  width: 0px;
  height: 0px;
  margin-top: -10px;
}
</style>