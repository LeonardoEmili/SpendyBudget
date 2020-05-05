<template>
  <div>
    <b-navbar class="my-asd">
      <b-navbar-brand to="/" class="my-asd">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/about">About us</b-nav-item>
        <b-nav-item to="/signup">Sign up</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <div style="width: 360px; margin-left: auto; margin-right: auto; margin-top: 15vh;">
      <p style="font-size:32px; text-align:center;">
        <b>Signup</b> to SpendyBudget
      </p>
      <p style="text-align:center; font-size: 16px; margin-top: 5px;">
        Don't have an account yet?
        <b-link to="/signup">Sign up here!</b-link>
      </p>

      <b-spinner
        variant="primary"
        label="Spinning"
        v-show="isLoading"
        style="position: absolute; top:50%; left:50%;"
      ></b-spinner>

      <b-form @submit="onSubmit" style="margin-top:40px;">
        <ValidationProvider rules="required|email" v-slot="{ errors, valid }">
          <b-form-group label="Email address:" label-size="sm">
            <b-form-input
              size="sm"
              v-model="email"
              type="email"
              :state="errors[0] ? false : (valid ? true : null)"
              placeholder="example@gmail.com"
              required
            ></b-form-input>
            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>

        <ValidationObserver>
          <ValidationProvider rules="required|password:@confirm" v-slot="{ errors, valid }">
            <b-form-group label="Password:" style="margin-top:8px" label-size="sm">
              <b-form-input
                size="sm"
                type="password"
                v-model="password"
                :state="errors[0] ? false : (valid ? true : null)"
                placeholder="qwerty123@"
                required
              ></b-form-input>
              <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>

          <ValidationProvider name="confirm" rules="required" v-slot="{ errors, valid }">
            <b-form-group label="Confirm password:" style="margin-top:8px" label-size="sm">
              <b-form-input
                size="sm"
                type="password"
                v-model="confirmation"
                :state="errors[0] ? false : (valid ? true : null)"
                placeholder="qwerty123@"
                required
              ></b-form-input>
            </b-form-group>
          </ValidationProvider>
        </ValidationObserver>

        <div style="text-align: center;">
          <b-button
            size="sm"
            type="submit"
            variant="primary"
            style="margin-top:30px;"
          >Signup to SpendyBudget</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import * as functions from "../plugins/firebase";
import sha512 from "js-sha512";
import router from "../router";

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmation: "",
      isLoading: false
    };
  },
  computed: {},
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      if (this.isLoading || this.password !== this.confirmation) {
        return;
      }

      this.isLoading = true;
      const user = {
        email: this.email,
        password: sha512(this.password)
      };

      // The view model.
      let vm = this;

      await functions.signUpWithEmailAndPassword(user, function(xmlHttp) {
        vm.isLoading = false;
        console.log(xmlHttp.responseText);

        let response = JSON.parse(xmlHttp.responseText);
        if (response.error !== undefined) {
          // Handling error response
          console.log(response.error);
          // TODO: Tell the user the email is already taken
          return;
        }

        // Storing auth token in localStorage
        console.log(xmlHttp.getAllResponseHeaders());
        localStorage.authToken = xmlHttp.getResponseHeader("Authentication");

        router.replace("/home");
      });
      /*



      this.isLoading = false;
      if (result.data != null) {
        console.log("Bentornato " + result.data.name);
        router.push("/home");
      } else {
        console.log("Wrong email or password. Please try again.");
      }*/
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