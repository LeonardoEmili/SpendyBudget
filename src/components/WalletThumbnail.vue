<template>
  <b-card :class = "{'shadow-sm': true, 'p-3': true, 'mb-5': true, thumbnail_card: true,
   thumbnail_card_selected: selected }">
    <img src="../assets/wallet.png" width = "50px" class="wallet_img"/>
    <h4 class="wallet_name">{{wallet.name}}</h4>
    <h6 class="wallet_description">Balance: {{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</h6>
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
    width: 250px;
  }

  .thumbnail_card_selected {
    background-color:palegreen;
  }

  .wallet_img{
    display: inline-block;
  }

  .wallet_name {
    display: inline-block;
  }


</style>