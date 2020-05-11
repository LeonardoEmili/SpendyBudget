<template>
  <div>
    <b-navbar type="light">
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" style="margin: 0; padding: 0">
          <b-nav-item-dropdown text="English " right>
            <b-dropdown-item variant="dark">
              <img
                src="../assets/flags/usa.png"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 5px;"
              /> English
            </b-dropdown-item>
            <b-dropdown-item variant="dark">
              <img
                src="../assets/flags/it.png"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 5px;"
              /> Italian
            </b-dropdown-item>
            <b-dropdown-item variant="dark">
              <img
                src="../assets/flags/de.png"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 5px;"
              /> German
            </b-dropdown-item>
            <b-dropdown-item variant="dark">
              <img
                src="../assets/flags/es.png"
                height="20px"
                width="20px"
                alt="."
                style="margin-left: -15px; margin-right: 5px;"
              /> Spanish
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item to="/about">About Us</b-nav-item>
          <b-nav-item to="/login">Login</b-nav-item>
          <b-button variant="outline-success" style="padding: 0px 10px; margin-left: 10px;" pill>
            <b-nav-item to="/signup">Sign up</b-nav-item>
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <center>
      <div id="welcome-div">
        <h1>Same spending tracker, new style</h1>
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
  name: "Index"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
}
</style>
