<template>
  <b-card
    :class="{'shadow-sm': true, thumbnail_card: true, 
   thumbnail_card_selected: selected, thumbnail_text_selected: selected }"
  >
    <div id="custom-wallet-thumbnail">
      <img v-show="!selected" src="../assets/wallet.png" height="40px" />
      <img v-show="selected" src="../assets/wallet_white.png" height="40px" />
      <span id="wallet-thumbnail-name">{{wallet.name}}</span>
      <p
        id="wallet-thumbnail-balance"
      >{{$t("balance")}} {{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</p>
    </div>
  </b-card>
</template>

<script>
import * as utils from "../utils";
export default {
  name: "WalletThumbnail",
  props: ["wallet", "selected"],
  methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency).toFixed(2);
    }
  }
};
</script>

<style>
.thumbnail_card {
  border-radius: 12px;
  width: 250px;
  margin-left: 20px;
}

.thumbnail_card_selected {
  background-color: dodgerblue;
}

.thumbnail_text_selected {
  color: white;
}

.wallet_img {
  display: inline-block;
}

.wallet_name {
  display: inline-block;
}

#wallet-thumbnail-balance {
  font-size: 15px;
  font-weight: bold;
}

#wallet-thumbnail-name {
  margin-left: 2px;
  font-weight: bold;
  font-size: 17px;
}
#custom-wallet-thumbnail {
  margin-top: -10px;
  margin-bottom: -14px;
}
</style>