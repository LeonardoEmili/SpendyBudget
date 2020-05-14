<template>
  <b-card class = "shadow-sm p-3 mb-5 bg-white thumbnail_card">
    <h5>{{wallet.name}}</h5>
    <p>Balance: {{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</p>
    </b-card>
 
</template>

<script>
import * as utils from "../utils"
export default {

    name: "WalletThumbnail",
    props: [
        "wallet",
        "selected"
    ],
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    }
    }
}
</script>

<style>

  .thumbnail_card {
    border-radius: 12px;
  }
</style>