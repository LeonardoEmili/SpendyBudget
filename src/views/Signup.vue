<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" style="margin-right: 10px;">
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
                style="margin-left: -15px; margin-right: 8px;"
              />
              <span :class="{ 'selected' : locale.iso == currentISO}">{{locale.name}}</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div style="width: 500px; margin-left: auto; margin-right: auto; margin-top: 15vh;">
      <p style="font-size:32px; text-align:center;">
        <span v-show="currentISO !== 'de'">
          <b>{{$t('sign_up')}}</b>
          {{$t('on_spendybudget')}}
        </span>
        <span v-show="currentISO === 'de'">
          {{$t('on_spendybudget')}}
          <b>{{$t('sign_up')}}</b>
        </span>
      </p>
      <p style="text-align:center; font-size: 16px; margin-top: 5px;">
        {{$t('already_registered')}}
        <b-link to="/login">{{$t('login_here')}}</b-link>
      </p>

      <b-form
        @submit="onSubmit"
        style="margin-top:40px; width: 350px; margin-left: auto; margin-right: auto"
      >
        <ValidationProvider rules="required|email" v-slot="{ errors, valid }">
          <b-form-group label-size="sm">
            <label style="font-size:15px; margin-bottom: 4px;">{{$t('email_address')}}</label>
            <b-form-input
              size="sm"
              v-model="email"
              v-on:focus="keyboardOpen"
              v-on:blur="keyboardClosed"
              type="email"
              :state="firebaseError || errors[0]  ? false : (valid ? true : null)"
              placeholder="example@gmail.com"
              required
            ></b-form-input>
            <b-form-invalid-feedback>{{ $t(firebaseError) || $t(errors[0]) }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <ValidationObserver>
          <ValidationProvider rules="required|password:@confirm" v-slot="{ errors, valid }">
            <b-form-group style="margin-top:10px" label-size="sm">
              <label style="font-size:15px; margin-bottom: 4px;">{{$t('password')}}</label>
              <b-form-input
                size="sm"
                type="password"
                v-model="password"
                v-on:focus="keyboardOpen"
                v-on:blur="keyboardClosed"
                :state="errors[0] ? false : (valid ? true : null)"
                placeholder="qwerty123@"
                required
              ></b-form-input>
              <b-form-invalid-feedback>{{ $t(errors[0]) }}</b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>

          <ValidationProvider name="confirm" rules="required" v-slot="{ errors, valid }">
            <b-form-group style="margin-top:10px" label-size="sm">
              <label style="font-size:15px; margin-bottom: 4px;">{{$t('confirm_password')}}</label>
              <b-form-input
                size="sm"
                type="password"
                v-model="confirmation"
                v-on:focus="keyboardOpen"
                v-on:blur="keyboardClosed"
                :state="errors[0] ? false : (valid ? true : null)"
                placeholder="qwerty123@"
                required
              ></b-form-input>
            </b-form-group>
          </ValidationProvider>
        </ValidationObserver>

        <div style="text-align: center;">
          <b-button
            block
            size="sm"
            type="submit"
            variant="primary"
            style="margin-top:30px; margin-bottom: 30px"
          >{{$t('signup_btn_text')}}</b-button>
        </div>
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
  name: "SignUp",
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
      confirmation: "",
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
    async onSubmit(evt) {
      evt.preventDefault();
      if (this.showProgress || this.password !== this.confirmation) {
        return;
      }

      app.showProgress = true;
      const user = {
        email: this.email,
        password: sha512(this.password),
        locale: utils.getCurrentLocale(),
        currency: utils.DEFAULT_CURRENCY,
        revenueCategories: utils.userIncomeCategories,
        expenseCategories: utils.userExpenseCategories
      };

      // The view model.
      let vm = this;

      await functions.signUpWithEmailAndPassword(user, function(xmlHttp) {
        app.showProgress = false;
        console.log(xmlHttp.responseText);

        let response = JSON.parse(xmlHttp.responseText);
        if (response.error !== undefined) {
          // Handling error response
          vm.firebaseError = response.error;
          return;
        }

        // Storing auth token in localStorage
        console.log(xmlHttp.getAllResponseHeaders());
        localStorage.authToken = xmlHttp.getResponseHeader("Authentication");

        router.replace("/more");
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
</style>