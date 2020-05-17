<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
       <h2>{{walletName}}</h2>
     <!-- Wallet balance -->
    <p>{{$t('balance')}} {{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
      </b-card>
</template>

<script>
import * as utils from "../utils"

export default {
    name: "WalletInfo",
    props: [
        "wallet"
    ],
    computed: {
        walletName: function () {return  this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""}
    },
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
        }  
    }
}
</script>

<style>

</style>