<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <h3>{{$t("revenue")}}</h3>
        <br>
        <doughnut-chart :class="{chart: !isMobileView(), chart_mobile: isMobileView()}" 
             :chartdata="revenueTransactionsChartData" :options="null"></doughnut-chart>
    <br>
      </b-card>
</template>

<script>
import * as utils from "../utils"
import DoughnutChart from './DoughnutChart.vue'

export default {
    name: "WalletRevenue",
    components: {
        doughnutChart: DoughnutChart
    },
    props: [
        "wallet"
    ],
    computed: {
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},
         walletRevenueTransactionsCategories:  function () {
          let categories = []
          for (let transaction of this.walletTransactions) {
            if (transaction.amountEUR < 0) {
              continue
            }
            let present = false
            for (let i = 0; i < categories.length; i++) {
              if (categories[i].name === transaction.category.name) {
                present = true
                categories[i].amountEUR = categories[i].amountEUR + transaction.amountEUR
              }
            }
            if (!present) {
              categories.push({
                name: transaction.category.name,
                color: transaction.category.color,
                icon: transaction.category.icon,
                amountEUR: transaction.amountEUR
            })
            }
          }
          return categories
        },      
        revenueTransactionsChartData: function() {return {
          labels: this.walletRevenueTransactionsCategories.map(category => category.name),
          datasets: [
            {
              label: 'Revenue transactions data',
              backgroundColor: this.walletRevenueTransactionsCategories.map(category => category.color),
              data: this.walletRevenueTransactionsCategories.map(category => utils.convertFromEUR(category.amountEUR, this.walletCurrency))
            }
          ]
        }
        

        },
    },
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
        },
        isMobileView() {
      return utils.isMobileView();
    },
    }
}
</script>

<style>

</style>