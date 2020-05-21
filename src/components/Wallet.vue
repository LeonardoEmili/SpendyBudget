<template>
  <div>
    <b-container id="wrapper-wallet-container">
      <b-row>
        <b-col>
          <wallet-budget :wallet="wallet"></wallet-budget>
        </b-col>
      </b-row>
      <b-row class="custom-row">
        <b-col>
          <wallet-expense :wallet="wallet"></wallet-expense>
        </b-col>
        <b-col>
          <wallet-revenue :wallet="wallet"></wallet-revenue>
        </b-col>
      </b-row>
      <b-row class="custom-row">
        <b-col>
          <wallet-last-week :wallet="wallet"></wallet-last-week>
        </b-col>
        <b-col>
          <wallet-last-month :wallet="wallet"></wallet-last-month>
        </b-col>
      </b-row>
      <b-row class="custom-row">
        <b-col>
          <wallet-transactions :wallet="wallet" :user="user"></wallet-transactions>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import WalletBudget from "./WalletBudget.vue";
import WalletTransactions from "./WalletTransactions.vue";
import WalletExpense from "./WalletExpense.vue";
import WalletRevenue from "./WalletRevenue.vue";
import WalletLastWeek from "./WalletLastWeek.vue";
import WalletLastMonth from "./WalletLastMonth.vue";

export default {
  name: "Wallet",
  props: ["wallet", "user"],
  components: {
    walletBudget: WalletBudget,
    walletTransactions: WalletTransactions,
    walletExpense: WalletExpense,
    walletRevenue: WalletRevenue,
    walletLastWeek: WalletLastWeek,
    walletLastMonth: WalletLastMonth
  },
  computed: {},

  methods: {}
};
</script>

<style>
.wallet_card {
  border-radius: 12px;
}

.chart {
  width: 350px;
  display: inline-block;
}

#wrapper-wallet-container {
  padding: 0;
}

.chart_mobile {
  width: 300px;
  display: inline-block;
}

.small_icon {
  width: 30px;
  height: 30px;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  border-radius: 25px;
  display: inline-block;
}
</style>