<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/about">About us</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <center>
      <div id="welcome-div">

        <!-- List of wallets -->

        <h1>My wallets:</h1>
          <div v-for="wallet in wallets" :key="wallet.id" > 
          <div style="background-color: cyan">
            <p>{{wallet.name}}</p>
            <p>{{wallet.balanceEUR}} {{wallet.currency}}</p>
            </div>
            <br><br>
          </div>
       
       <!-- " New wallet" modal view -->
       
      <div>
         <b-button v-b-modal.new_wallet_modal>New wallet </b-button>

      <b-modal id="new_wallet_modal"  title="New wallet" hide-footer>

        <form id="new_wallet_form">

          Wallet name:
          <br>
          <input type="text" name="name" maxlength="30" required>
          <br><br>
          Wallet currency:
          <br>
          <select name="currency">
            <option value="EUR" selected>EUR</option>
            <option value="USD">USD</option>
          </select>
          
        </form>
      <br><br>
      <b-button v-on:click="onNewWalletPressed">Create</b-button>
        </b-modal>
      </div>
      
      
      </div>
    </center>
  </div>
</template>

<script>
import { loadWallets, createNewWallet } from '../plugins/firebase'

export default {
  name: "Home",
  data: function() {
    return {
      wallets: []
    }
  },
  methods: {
    onNewWalletPressed() {
      let form = document.getElementById('new_wallet_form')
        if (form.name.value === '') {
          alert("Fill out all the fields")
          return
        }
        
        const formData = {
          name: form.name.value,
          currency: form.name.currency
        }

        createNewWallet(formData, wallet => this.wallets.push(wallet))

        this.$bvModal.hide("new_wallet_modal")

      }
  },
  mounted: function() {
    loadWallets(wallets => this.wallets = wallets)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
}
</style>
