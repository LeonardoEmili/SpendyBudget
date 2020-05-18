<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
     <h3> Expense: </h3>
        <br>
        <doughnut-chart :class="{chart: !isMobileView(), chart_mobile: isMobileView()}" 
             :chartdata="expenseTransactionsChartData" :options="null"></doughnut-chart>
        <br>
      </b-card>
</template>

<script>
import * as utils from "../utils"
import DoughnutChart from './DoughnutChart.vue'

export default {
    name: "WalletExpense",
    components: {
        doughnutChart: DoughnutChart
    },
    props: [
        "wallet"
    ],
    computed: {
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},
         walletExpenseTransactionsCategories:  function () {
          let categories = []
          for (let transaction of this.walletTransactions) {
            if (transaction.amountEUR >= 0) {
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
        expenseTransactionsChartData: function() {return {
          labels: this.walletExpenseTransactionsCategories.map(category => category.name),
          datasets: [
            {
              label: 'Expense transactions data',
              backgroundColor: this.walletExpenseTransactionsCategories.map(category => category.color),
              data: this.walletExpenseTransactionsCategories.map(category => -utils.convertFromEUR(category.amountEUR, this.walletCurrency))
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