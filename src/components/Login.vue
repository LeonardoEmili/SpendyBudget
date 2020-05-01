<template>
  <div class="login">
    <b-navbar class="my-asd">
      <b-navbar-brand to="/" class="my-asd">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/about">TODO</b-nav-item>
        <b-nav-item to="/login">TODO</b-nav-item>
        <b-nav-item to="/signup">TODO</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <div style="width: 400px; margin-left: auto; margin-right: auto; margin-top: 50px;">
      <p style="font-size:26px; text-align:center;">
        <b>Login</b> to SpendyBudget
      </p>
      <p style="text-align:center;">
        Don't have an account yet?
        <b-link to="/signup">Sign up here!</b-link>
      </p>

      <b-form @submit="onSubmit" @reset="onReset" v-if="show" style="padding-top:30px;">
        <b-form-group id="input-group-1" label="Email address:" label-for="input-1" label-size="sm">
          <b-form-input
            size="sm"
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2" label-size="sm">
          <b-form-input
            id="input-2"
            v-model="form.name"
            size="sm"
            placeholder="Enter name"
            required
          ></b-form-input>
        </b-form-group>

        <div style="text-align: center;">
          <b-button
            size="sm"
            type="submit"
            variant="primary"
            style="margin-right:5px; margin-top:20px; width: 200px;"
          >Login to SpendyBudget</b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        name: "",
        food: null,
        checked: []
      },
      foods: [
        { text: "Select One", value: null },
        "Carrots",
        "Beans",
        "Tomatoes",
        "Corn"
      ],
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>