<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
     <h3>{{$t("last_month")}}</h3>
        <br>
        <line-chart :class="{chart: !isMobileView(), chart_mobile: isMobileView()}" 
             :chartdata="lastMonthChartData" :options="null"></line-chart>
        <br>
      </b-card>
</template>

<script>
import * as utils from "../utils"
import LineChart from './LineChart.vue'

export default {
    name: "WalletExpense",
    components: {
        lineChart: LineChart
    },
    props: [
        "wallet"
    ],
    computed: {
               walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},

       
        lastMonthChartData: function() {
              let data = this.getBalanceMapOfLastDays(30)
            return {
                labels: data.map((point) => point.x),
        datasets: [
            {
              label: [this.$t("last_month")],
              backgroundColor: '#8888ff',
              data: data
            }
          ]
            }
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
        return utils.getBalanceMapOfLastDays(daysNum, this.walletTransactions)
    },
    }
}
</script>

<style>

</style>