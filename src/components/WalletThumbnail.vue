<template>
  <b-card style="background-color: cyan">
    <p>{{wallet.name}}</p>
    <p>{{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</p>
    <p>{{selected}}</p>
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

</style>