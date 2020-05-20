<template>
  <b-card
  style="width: 250px"
    :class="{'shadow-sm': true, thumbnail_card: true,
   thumbnail_card_selected: selected, thumbnail_text_selected: selected }"
  >
    <div style="margin-top: -10px; margin-bottom: -14px;">
      <img v-show="!selected" src="../assets/wallet.png" height="40px" />
      <img v-show="selected" src="../assets/wallet_white.png" height="40px" />
      <span style="margin-left: 2px; font-weight: bold; font-size: 17px">{{wallet.name}}</span>
      <p
        style="font-size: 15px; font-weight: bold"
      >{{$t("balance")}} {{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</p>
    </div>
  </b-card>
  <!--<b-card
    style="max-width: 200px; max-height: 80px; background-color: red; padding: 0; margin: 0"
    :class="{'shadow-sm': true, thumbnail_card: true,
   thumbnail_card_selected: selected, thumbnail_text_selected: selected }"
  >
  -->

  <!--
    <div style="max-height: 80px;">
      <div style="height:0px; display: flex;">
        <img
          v-if="!selected"
          src="../assets/wallet.png"
          height="50px"
          class="wallet_img"
        />
        <img
          v-else
          src="../assets/wallet_white.png"
          height="50px"
          class="wallet_img"
        />
        <h4 style=" line-height: 50px; margin: 0; padding: 0;" class="wallet_name">{{wallet.name}}</h4>
      </div>
      <h6
        class="wallet_description"
      >{{$t("balance")}} {{convertFromEUR(wallet.balanceEUR, wallet.currency)}} {{wallet.currency}}</h6>
  </div>-->
</template>

<script>
import * as utils from "../utils";
export default {
  name: "WalletThumbnail",
  props: ["wallet", "selected"],
  methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    }
  }
};
</script>

<style>
.thumbnail_card {
  border-radius: 12px;
  width: 250px;
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
</style>