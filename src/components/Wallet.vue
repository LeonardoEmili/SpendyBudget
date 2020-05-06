<template>
  <div style="background-color: cyan">
    <p>{{wallet.name}}</p>
    <p>{{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</p>
 
    </div>
 
</template>

<script>
import * as utils from "../utils"
export default {

    name: "Wallet",
    props: [
        "wallet"
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