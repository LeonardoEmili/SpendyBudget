<template>
  <b-card style="background-color: cyan">
     <h2>{{walletName}}</h2>
    <p>{{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
    <h3>Transactions</h3>
    <p v-for="i in walletTransactions.length" :key="i">{{walletTransactions[walletTransactions.length-i].amount}}</p>
  </b-card>
  
</template>

<script>
import * as utils from "../utils"

export default {
    
    name: "WalletCard",
    props: [
        "wallet"
    ],
    computed: {
        walletName: function () {return this !== undefined && this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this !== undefined && this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this !== undefined && this.wallet !== null ? this.wallet.currency : ""},
        walletTransactions:  function () {return this !== undefined && this.wallet !== null ? this.wallet.transactions : []}
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