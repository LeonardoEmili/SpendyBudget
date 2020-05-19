<template>
  <div>
    <h6 class="my-headers">{{$t('profile_photo')}}</h6>

    <div id="photo-wrapper">
      <img
        v-show="profPic"
        width="100px"
        height="100px"
        ref="img"
        :src="profPic"
        class="rounded-circle"
      />

      <div
        v-show="!profPic"
        id="upload-photo-wrapper"
        :style="borderStyle"
        v-on:click="$refs.file.click()"
      >
        <img
          id="default-img"
          width="100px"
          height="100px"
          ref="img"
          src="../assets/user.png"
          class="rounded-circle"
          :style="borderStyle"
        />

        <span id="upload-photo-text">{{$t('upload_your_photo')}}</span>
      </div>

      <input type="file" ref="file" v-on:change="uploadImage" accept="image/*" id="custom-input" />
      <b-button size="sm" variant="primary" id="custom-btn" v-on:click="$refs.file.click()">
        <upload-icon></upload-icon>
        <span>{{$t('upload_photo')}}</span>
      </b-button>
    </div>

    <vue-croppie id="my-croppie" ref="croppieRef"></vue-croppie>

    <ValidationObserver v-slot="{ handleSubmit }">
      <b-form v-on:submit.prevent="handleSubmit(onSubmit)" id="account-form">
        <h6 class="my-headers">{{$t('general_settings')}}</h6>
        <b-row>
          <b-col class="my-cols">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-group class="custom-font">
                <label>{{$t('name')}}</label>
                <b-form-input
                  size="sm"
                  type="text"
                  v-model="user.name"
                  placeholder="Your name"
                  :state="errors[0]? false : null"
                ></b-form-input>
                <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col class="my-cols">
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-group class="custom-font">
                <label>{{$t('surname')}}</label>
                <b-form-input
                  size="sm"
                  type="text"
                  v-model="user.surname"
                  placeholder="Your surname"
                  :state="errors[0]? false : null"
                ></b-form-input>
                <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="my-cols">
            <b-form-group label="" size="sm" class="custom-font">
              <label>{{$t('sex_optional')}}</label>
              <b-form-select v-model="user.gender" size="sm">
                <b-form-select-option value="null" disabled></b-form-select-option>
                <b-form-select-option value="M">Male</b-form-select-option>
                <b-form-select-option value="F">Female</b-form-select-option>
                <b-form-select-option value="O">Other</b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col class="my-cols">
            <ValidationProvider rules="birthdate" v-slot="{ errors }">
              <b-form-group size="sm" class="custom-font">
                <label>{{$t('date_of_birth_optional')}}</label>
                <b-form-datepicker
                  size="sm"
                  v-model="user.birthdate"
                  :locale="locale"
                  placeholder="Choose a date"
                  :state="errors[0]? false : null"
                ></b-form-datepicker>
                <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="my-cols">
            <b-form-group class="custom-font">
              <label>{{$t('email_address')}}</label>
              <b-form-input
                size="sm"
                type="email"
                v-model="user.email"
                placeholder="example@gmail.com"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col></b-col>
        </b-row>

        <h6 class="my-headers">{{$t('localization_settings')}}</h6>

        <b-row>
          <b-col class="my-cols">
            <b-form-group size="sm" class="custom-font">
              <label>{{$t('account_currency')}}</label>
              <b-form-select v-model="user.currency" size="sm">
                <b-form-select-option
                  v-for="currency in currencies"
                  :value="currency.iso"
                  :key="currency.iso"
                >{{$t(currency.name)}}</b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col class="my-cols">
            <b-form-group size="sm" class="custom-font">
              <label>{{$t('language')}}</label>
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

        <b-row>
          <b-col>
            <b-button
              id="submit-btn"
              block
              size="sm"
              type="submit"
              :variant="btnVariant"
            >{{$t('update_settings')}}</b-button>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-form>
    </ValidationObserver>
  </div>
</template>

<script>
import * as utils from "../utils";
import * as functions from "../plugins/firebase";
import { app } from "../main";

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
    utils.fetchUserCurrency(currency => (vm.user.currency = currency));
  },
  data() {
    return {
      profPic: null,
      validFields: false,
      user: {
        name: "",
        surname: "",
        email: "",
        gender: "",
        birthdate: "",
        locale: "",
        currency: ""
      },
      borderStyle: {
        color: "#088ac7",
        borderStyle: "dashed",
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
    },
    currencies() {
      return utils.currencies;
    },
    updatedFields() {
      return (
        this.user.name !== app.user.name ||
        this.user.surname !== app.user.surname ||
        this.user.locale !== app.user.locale ||
        this.user.email !== app.user.email ||
        this.user.gender !== app.user.gender ||
        this.user.birthdate !== app.user.birthdate ||
        this.user.currency !== app.user.currency
      );
    },
    btnVariant: function() {
      let missingRequiredFields =
        !this.user.name || !this.user.surname || !this.user.email;

      let userComesFromFuture =
        this.user.birthdate !== "" &&
        new Date() < new Date(this.user.birthdate);

      return !missingRequiredFields &&
        this.updatedFields &&
        !userComesFromFuture
        ? "success"
        : "";
    }
  },
  methods: {
    onSubmit() {
      // No need to check for required fields (they are handled in the observer)
      if (this.updatedFields) {
        functions.updateUserData(this.user);
      }
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
  opacity: 0.15;
}
.my-cols {
  padding-top: 3px;
  padding-bottom: 3px;
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

.inline-error {
  position: absolute;
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

#upload-photo-text {
  position: absolute;
  left: 00%;
  top: 14%;
  font-size: 14px;
  text-align: center;
  padding: 10px 12px 0 12px;
  color: #222;
}

#upload-photo-wrapper {
  display: inline-block;
  position: relative;
  height: 100px;
  width: 100px;
  border-radius: 50%;
}

#upload-photo-wrapper:hover {
  cursor: pointer;
}
</style>