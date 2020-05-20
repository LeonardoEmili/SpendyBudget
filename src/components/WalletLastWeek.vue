<template>
  <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <h3>{{$t("last_week")}}</h3>
    <p>{{$t('balance')}} {{convertFromEUR(getBalanceOfLastDays(7), walletCurrency).toFixed(2)}} {{walletCurrency}}</p>
    <line-chart
      :class="{chart: !isMobileView(), chart_mobile: isMobileView()}"
      :chartdata="lastWeekChartData"
      :options="null"
    ></line-chart>
  </b-card>
</template>

<script>
import * as utils from "../utils";
import LineChart from "./LineChart.vue";

export default {
  name: "WalletExpense",
  components: {
    lineChart: LineChart
  },
  props: ["wallet"],
  computed: {
    walletTransactions: function() {
      return this.wallet !== null && this.wallet.transactions !== undefined
        ? this.wallet.transactions
        : [];
    },
    walletCurrency: function() {
      return this.wallet !== null ? this.wallet.currency : "";
    },
    lastWeekChartData: function() {
      let data = this.getBalanceMapOfLastDays(7);
      return {
        labels: data.map(point => point.x),
        datasets: [
          {
            label: [this.$t("last_week")],
            backgroundColor: "#8888ff",
            data: data
          }
        ]
      };
    }
  },
  methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    },
    isMobileView() {
      return utils.isMobileView();
    },
    getBalanceMapOfLastDays(daysNum) {
      return utils.getBalanceMapOfLastDays(daysNum, this.walletTransactions);
    },
    getBalanceOfLastDays(daysNum) {
      let ret = 0.0;
      for (let transaction of this.walletTransactions) {
        if (
          transaction.instant._seconds / 60 / 60 / 24 >=
          Date.now() / 1000 / 60 / 60 / 24 - daysNum
        ) {
          ret += transaction.amountEUR;
        }
      }
      return ret;
    }
  }
};
</script>

<style>
</style>