<template>
  <div>
    <b-navbar>
      <b-navbar-brand >
        <img src="../assets/logo.png" height="60px" width="60px" alt="." />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/settings">Settings</b-nav-item>
        <b-nav-item v-on:click="logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <center>
      <div id="welcome-div">
       
       <b-container fluid>
        <b-row>
          <b-col sm="5" md="3">
            <h1>My wallets</h1>
          </b-col>
          <b-col sm="5" md="7"></b-col>
          <b-col cols="2">
            <!-- " New wallet" modal view -->
        <div>
          <b-button v-b-modal.new_wallet_modal>New wallet</b-button>

          <b-modal id="new_wallet_modal" title="New wallet" hide-footer>
            <form id="new_wallet_form">
              Wallet name:
              <br />
              <input type="text" name="name" maxlength="30" required />
              <br />
              <br />Wallet currency:
              <br />
              <select name="currency" v-model="selectedCurrency">
                <option value="EUR" selected>EUR</option>
                <option value="USD">USD</option>
              </select>
            </form>
            <br />
            <br />
            <b-button v-on:click="onNewWalletPressed">Create</b-button>
          </b-modal>
        </div>
          </b-col>
        </b-row>
       </b-container>
       
        <!-- List of wallet thumbnails -->
        <b-container fluid>
        <b-row class="wallet-thumbnails" >
          <b-col class="wallet-thumbnail" sm="4" md="2" xl="6" 
          v-for="wallet in wallets" :key="wallet.id"
          v-on:click="selectWallet(wallet)">
          <wallet-thumbnail 
            :wallet="wallet"
            :selected="selectedWalletId === wallet.id">
            </wallet-thumbnail>
          </b-col>
        </b-row>
        </b-container>

      <!-- Expanded wallet card -->
      <b-container fluid>
      <b-collapse id="collapse-wallet-card" v-model="walletCardVisible">
      <wallet-card  :wallet="getSelectedWallet()"></wallet-card>
      </b-collapse>
      </b-container>
      
      </div>
    </center>
  </div>
</template>

<script>
import WalletThumbnail from "../components/WalletThumbnail"
import WalletCard from "../components/WalletCard"
import { loadWallets, createNewWallet } from "../plugins/firebase"
import * as utils from "../utils"

export default {
  name: "Dashboard",
  data: function() {
    return {
      selectedCurrency: "EUR",
      wallets: [],
      selectedWalletId: "",
      walletCardVisible: false
    };
  },
  components: {
    walletThumbnail: WalletThumbnail,
    walletCard: WalletCard
  },
  methods: {
    /**
     * Logs out.
     */
    logout() {
      utils.logout();
    },
    /**
     * Called when the "new wallet" button is pressed.
     */
    onNewWalletPressed() {
      let form = document.getElementById("new_wallet_form");
      if (form.name.value === "") {
        alert("Fill out all the fields");
        return;
      }

      const formData = {
        name: form.name.value,
        currency: this.selectedCurrency
      };

      createNewWallet(formData, wallet => this.wallets.push(wallet));

      this.$bvModal.hide("new_wallet_modal");
    },
    /**
     * Sets the selected wallet id.
     */
    selectWallet(wallet) {
      if (this.selectedWalletId === wallet.id) {
        this.selectedWalletId = ""
        this.walletCardVisible = false
      } else {
        this.selectedWalletId = wallet.id
        this.walletCardVisible = true
      }
    },
    /**
     * Returns the selected wallet.
     */
    getSelectedWallet() {
      for (let wallet of this.wallets) {
        if (wallet.id === this.selectedWalletId) {
          return wallet
        }
      }
      return null
    }
  },
  mounted: function() {
    loadWallets(wallets => (this.wallets = wallets));
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
}


 .wallet-thumbnails {
  overflow-x: auto;
  flex-wrap: nowrap;
}
 .wallet-thumbnails > .wallet-thumbnail {
  display: inline-block;
  float: none;
  cursor: pointer;
}



</style>
