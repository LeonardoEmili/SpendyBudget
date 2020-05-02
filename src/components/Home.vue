<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/about">About us</b-nav-item>
        <b-nav-item to="/login">Login</b-nav-item>
        <b-nav-item to="/signup">Sign up</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <center>
      <div id="welcome-div">
        <h1>Home Page</h1>
        <p>A simpe expense tracker to help you manage your money.</p>
        <div style="margin-top:50px">
          <img src="../assets/chart1.png" width="240px" alt="." style="margin-right:50px" />

          <img src="../assets/chart2.png" width="240px" alt="." />
        </div>
      </div>
    </center>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
}
</style>
