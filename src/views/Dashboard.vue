<template>
  <div>
    <b-navbar class="custom-nav" type="dark">
      <b-navbar-brand to="/dashboard" class="small-nav">
        <img src="../assets/logo.png" height="50px" width="50px" alt="app logo" />
        SpendyBudget
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown variant right class="short-dropdown">
          <template v-slot:button-content>
            <img
              id="user-profile-picture"
              v-show="userProfPic"
              v-bind:src="userProfPic"
              height="30px"
              width="30px"
              class="rounded-circle"
            />

            <span v-show="!userProfPic" class="picture-navbar">{{nameInitials}}</span>
            <span id="user-profile-visiblename">{{userName}}</span>
          </template>
          <b-dropdown-item class="my-dropdown" to="/settings" variant="dark">{{$t('settings')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" to="/about" variant="dark">{{$t('about_us')}}</b-dropdown-item>
          <b-dropdown-item class="my-dropdown" v-on:click="logout" variant="dark">{{$t('logout')}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

    <div id="welcome-div">
      <b-container fluid>
        <b-row>
          <b-col>
            <p
              :class="{my_wallets_title: !isMobileView(), 
                my_wallets_title_mobile: isMobileView()}"
            >{{$t('my_wallets')}}</p>
          </b-col>
          <b-col>
            <!-- " New wallet" modal view -->
            <div class="new_wallet_button">
              <b-button variant="primary" v-b-modal.new_wallet_modal>{{$t('new_wallet')}}</b-button>

              <b-modal center id="new_wallet_modal" title="New wallet" hide-footer>
                <b-form id="new_wallet_form">
                  {{$t('wallet_name')}}
                  <br />
                  <b-form-input type="text" name="name" maxlength="30" required />
                  <br />
                  <br />
                  {{$t('wallet_currency')}}
                  <br />
                  <b-form-select name="currency" v-model="selectedCurrency">
                    <option value="EUR" selected>EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </b-form-select>
                </b-form>

                <br />
                <br />
                <b-button v-on:click="onNewWalletPressed">{{$t('create')}}</b-button>
              </b-modal>
            </div>
          </b-col>
        </b-row>
      </b-container>

      <br />
      <br />

      <!-- List of wallet thumbnails -->
      <b-container fluid>
        <b-row class="wallet-thumbnails">
          <b-col
            class="wallet-thumbnail"
            v-for="wallet in wallets"
            :key="wallet.id"
            v-on:click="selectWallet(wallet)"
          >
            <wallet-thumbnail :wallet="wallet" :selected="selectedWalletId === wallet.id"></wallet-thumbnail>
          </b-col>
        </b-row>
      </b-container>

      <hr>

      <!-- Expanded wallet card -->
      <b-container fluid>
        <b-collapse id="collapse-wallet-card" v-model="walletCardVisible">
          <wallet :user="user" :wallet="getSelectedWallet()"></wallet>
        </b-collapse>
      </b-container>
    </div>
  </div>
</template>

<script>
import WalletThumbnail from "../components/WalletThumbnail";
import Wallet from "../components/Wallet";
import { loadWallets, createNewWallet } from "../plugins/firebase";
import * as utils from "../utils";

export default {
  name: "Dashboard",
  created() {
    utils.fetchUserData(user => (this.user = user));
    loadWallets(wallets => (this.wallets = wallets));
  },
  data: function() {
    return {
      selectedCurrency: "EUR",
      wallets: [],
      selectedWalletId: "",
      walletCardVisible: false,
      user: {}
    };
  },
  components: {
    walletThumbnail: WalletThumbnail,
    wallet: Wallet
  },
  computed: {
    userName: function() {
      return this.user !== null ? this.user.name : "";
    },
    userProfPic: function() {
      return this.user !== null && this.user.profPic !== undefined
        ? this.user.profPic
        : "";
    },
    nameInitials: function() {
      if (!this.user.name || !this.user.surname) {
        return "";
      }
      return (
        this.user.name[0].toUpperCase() + this.user.surname[0].toUpperCase()
      );
    }
  },
  methods: {
    isMobileView() {
      return utils.isMobileView();
    },
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
        this.selectedWalletId = "";
        this.walletCardVisible = false;
      } else {
        this.selectedWalletId = wallet.id;
        this.walletCardVisible = true;
      }
    },
    /**
     * Returns the selected wallet.
     */
    getSelectedWallet() {
      for (let wallet of this.wallets) {
        if (wallet.id === this.selectedWalletId) {
          return wallet;
        }
      }
      return null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#welcome-div {
  padding-top: 100px;
  padding-bottom: 100px;
  text-align: center;
}

.my_wallets_title_mobile {
  position: absolute;
  left: 10;
  font-size: 24px;
  font-weight: bold;
}

.my_wallets_title {
  position: absolute;
  left: 10;
  font-weight: bold;
  font-size: 32px;
}

.new_wallet_button {
  position: absolute;
  right: 10px;
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

.short-dropdown >>> .dropdown-menu {
  min-width: 120px;
  max-height: 200px;
  overflow-y: auto;
}

.my-dropdown {
  margin-left: -22px;
}
</style>