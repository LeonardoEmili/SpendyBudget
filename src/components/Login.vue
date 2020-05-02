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
import * as functions from '../plugins/firebase-vue'
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
    async onSubmit(evt) {
      evt.preventDefault();

      if (this.isLoading) {
        // Prevent sending a new request while the previous is still being processed
        return;
      }

      this.isLoading = true;

      const user = {
        email: this.form.email,
        password: sha512(this.form.password)
      };
      
      let result = await functions.loginWithEmailAndPassword(user);

      this.isLoading = false;
      if (result.data != null) {
        console.log("Bentornato " + result.data.name);
        router.push('/home');
      } else {
        console.log("Wrong email or password. Please try again.");
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>