<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" id="custom-navbar">
          <b-nav-item-dropdown :text="userLanguage" right>
            <b-dropdown-item
              variant="dark"
              v-for="(locale, index) in locales"
              :key="locale.iso"
              v-on:click="updateLocale(index)"
            >
              <img
                :src="require('../assets/flags/' + locale.iso + '.png')"
                height="20px"
                width="20px"
                alt="."
                class="flags-locale"
              />
              <span :class="{ 'selected' : locale.iso == currentISO}">{{locale.name}}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div id="wrapper">
      <p id="wrapper-title">
        <span v-show="currentISO !== 'de'">
          <b>{{$t('login')}}</b>
          {{$t('to_spendybudget')}}
        </span>
        <span v-show="currentISO === 'de'">
          {{$t('to_spendybudget')}}
          <b>{{$t('login')}}</b>
        </span>
      </p>
      <p id="wrapper-subtitle">
        {{$t('not_yet_registered')}}
        <b-link to="/signup">{{$t('sign_up_here')}}</b-link>
      </p>

      <b-form @submit="onSubmit" id="user-form">
        <ValidationProvider rules="required|email" v-slot="{ errors, valid }">
          <b-form-group label-size="sm">
            <label id="form-email-label">{{$t('email_address')}}</label>
            <b-form-input
              size="sm"
              v-model="email"
              v-on:focus="keyboardOpen"
              v-on:blur="keyboardClosed"
              type="email"
              :state="errors[0] || firebaseError ? false : (valid ? true : null)"
              placeholder="example@gmail.com"
              required
            ></b-form-input>
            <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <ValidationProvider rules="required" v-slot="{ errors, valid }">
          <b-form-group label-size="sm">
            <label id="label-form-password">{{$t('password')}}</label>
            <b-form-input
              size="sm"
              type="password"
              v-model="password"
              v-on:focus="keyboardOpen"
              v-on:blur="keyboardClosed"
              :state="firebaseError || errors[0] ? false : (valid ? true : null)"
              placeholder="qwerty123@"
              required
            ></b-form-input>
            <b-form-invalid-feedback class="inline-error">{{ $t(firebaseError) || $t(errors[0]) }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
        <b-button
          size="sm"
          type="submit"
          variant="primary"
          id="login-btn"
          block
        >{{$t('login_btn_text')}}</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import * as functions from "../plugins/firebase";
import sha512 from "js-sha512";
import router from "../router";
import * as utils from "../utils";
import { app } from "../main";

export default {
  name: "Login",
  created() {
    // Initialize the locale to be used
    // TODO: check if this conditions still holds (probably not)
    this.userLocaleIndex = utils.locales.findIndex(
      locale => locale.iso === utils.getCurrentLocale()
    );
  },
  data() {
    return {
      email: "",
      password: "",
      firebaseError: "",
      userLocaleIndex: 0
    };
  },
  computed: {
    showProgress() {
      return app.showProgress;
    },
    locales: function() {
      return utils.locales;
    },
    currentISO: function() {
      return (
        utils.locales[this.userLocaleIndex].iso || utils.getCurrentLocale()
      );
    },
    userLanguage: function() {
      return utils.languageFromISO(this.currentISO);
    }
  },
  methods: {
    updateLocale: function(index) {
      this.userLocaleIndex = index;
      utils.changeLanguage(this.currentISO);
    },
    keyboardOpen() {
      if (utils.isMobileView()) {
        this.$parent.$refs.footer.classList.add("when-keyboard");
      }
    },
    keyboardClosed() {
      if (utils.isMobileView()) {
        this.$parent.$refs.footer.classList.remove("when-keyboard");
      }
    },
    onSubmit(evt) {
      evt.preventDefault();

      if (this.showProgress) {
        // Prevent sending a new request while the previous is still being processed
        return;
      }

      app.showProgress = true;
      const user = {
        email: this.email,
        password: sha512(this.password)
      };

      // The view model.
      let vm = this;

      functions.loginWithEmailAndPassword(user, function(xmlHttp) {
        app.showProgress = false;

        let response = JSON.parse(xmlHttp.responseText);
        if (response.error !== undefined) {
          // Handling error response
          vm.firebaseError = response.error;
          return;
        }

        // Storing auth token in localStorage
        console.log(xmlHttp.getAllResponseHeaders());
        localStorage.authToken = xmlHttp.getResponseHeader("Authentication");

        router.replace("/dashboard");
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
}

#label-form-password {
  font-size: 15px;
  margin-bottom: 4px;
  margin-top: 16px;
}

#custom-navbar {
  margin-right: 10px;
}

.flags-locale {
  margin-left: -15px;
  margin-right: 8px;
}

.inline-error {
  position: absolute;
}

#login-btn {
  margin-top: 30px;
  margin-bottom: 30px;
}

#wrapper-title {
  font-size: 32px;
  text-align: center;
}

#wrapper-subtitle {
  text-align: center;
  font-size: 16px;
  margin-top: 5px;
}

#wrapper {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15vh;
}

#user-form {
  margin-top: 40px;
  width: 350px;
  margin-left: auto;
  margin-right: auto;
}

#form-email-label {
  font-size: 15px;
  margin-bottom: 4px;
}
</style>