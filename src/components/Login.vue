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
        <b>Login</b> to SpendyBudget
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
        <b-form-group id="input-group-1" label="Email address:" label-for="input-1" label-size="sm">
          <b-form-input
            size="sm"
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="example@gmail.com"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Password:"
          label-for="input-2"
          label-size="sm"
          style="margin-top:5px;"
        >
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            size="sm"
            placeholder="qwerty123@"
            required
          ></b-form-input>
        </b-form-group>

        <div style="text-align: center;">
          <b-button
            size="sm"
            type="submit"
            variant="primary"
            style="margin-top:30px;"
          >Login to SpendyBudget</b-button>
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
      form: {
        email: "",
        password: ""
      },
      isLoading: false
    };
  },
  computed: {},
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      if (this.isLoading) {
        // Prevent sending a new request while the previous is still being processed
        return;
      }

      this.isLoading = true;

      let email = this.form.email;
      let hashedPassword = sha512(this.form.password);
      const user = {
        email: email,
        password: hashedPassword
      };

      // The view model.
      let vm = this;

      functions.loginWithEmailAndPassword(user, function(xmlHttp) {
        vm.isLoading = false;
        console.log(xmlHttp.responseText);

        let response = JSON.parse(xmlHttp.responseText);
        if (response.error !== undefined) {
          // Handling error response
          console.log(response.error);
          // TODO: Tell the user his data was incorrect
          return;
        }

        // Storing session token as a cookie
        console.log(xmlHttp.getAllResponseHeaders())
        localStorage.sessionToken = xmlHttp.getResponseHeader("Set-Cookie1");

        router.replace("/home");
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