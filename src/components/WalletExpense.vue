<template>
  <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <h3>{{$t("expense")}}</h3>
    <br />
    <doughnut-chart
      :height="350"
      id="custom-doughnut-chart"
      :class="{chart: !isMobileView(), chart_mobile: isMobileView()}"
      :chartdata="expenseTransactionsChartData"
      :options="null"
    ></doughnut-chart>
    <br />
  </b-card>
</template>

<script>
import * as utils from "../utils";
import DoughnutChart from "./DoughnutChart.vue";

export default {
  name: "WalletExpense",
  components: {
    doughnutChart: DoughnutChart
  },
  props: ["wallet"],
  computed: {
    walletTransactions: function() {
      return this.wallet !== null && this.wallet.transactions !== undefined
        ? this.wallet.transactions
        : [];
    },
    walletExpenseTransactionsCategories: function() {
      let categories = [];
      for (let transaction of this.walletTransactions) {
        if (transaction.amountEUR >= 0) {
          continue;
        }
        let present = false;
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].name === transaction.category.name) {
            present = true;
            categories[i].amountEUR =
              categories[i].amountEUR + transaction.amountEUR;
          }
        }
        if (!present) {
          categories.push({
            name: transaction.category.name,
            color: transaction.category.color,
            icon: transaction.category.icon,
            amountEUR: transaction.amountEUR
          });
        }
      }
      return categories;
    },
    expenseTransactionsChartData: function() {
      let labels = this.walletExpenseTransactionsCategories.map(
        category => category.name
      );
      let backgroundColor = this.walletExpenseTransactionsCategories.map(
        category => category.color
      );
      let data = this.walletExpenseTransactionsCategories.map(
        category =>
          -utils.convertFromEUR(category.amountEUR, this.walletCurrency)
      );
      if (labels.length == 0) {
        labels = [this.$t("none")];
        backgroundColor = ["#CCCCCC"];
        data = [1];
      }
      return {
        labels: labels,
        datasets: [
          {
            label: "Revenue transactions data",
            backgroundColor: backgroundColor,
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
    }
  }
};
</script>

<style>
#custom-doughnut-chart {
  margin-top: -10px;
}
</style>