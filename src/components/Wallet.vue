<template>
<div>
  <wallet-info :wallet="wallet"></wallet-info>
  <wallet-budget :wallet="wallet"></wallet-budget>


<b-container fluid>
  <b-row>
    <b-col>
  <wallet-expense :wallet="wallet"></wallet-expense>
    </b-col>
  <b-col>
  <wallet-revenue :wallet="wallet"></wallet-revenue>
  </b-col>

  </b-row>
</b-container>
        
   <wallet-transactions :wallet="wallet" :user="user"></wallet-transactions>



</div>
  
</template>

<script>
import WalletInfo from './WalletInfo.vue'
import WalletBudget from './WalletBudget.vue'
import WalletTransactions from './WalletTransactions.vue'
import WalletExpense from './WalletExpense.vue'
import WalletRevenue from './WalletRevenue.vue'

export default {
    name: "Wallet",
    props: [
        "wallet",
        "user"
    ],
    components: {
      walletInfo: WalletInfo,
      walletBudget: WalletBudget,
      walletTransactions: WalletTransactions,
      walletExpense: WalletExpense,
      walletRevenue: WalletRevenue
    },
    computed: {
       
        },
        
    methods: {
    


    }

    
}
</script>

<style>


  .wallet_card {
    border-radius: 12px;
  }

.chart {
  width: 500px;
  display: inline-block;
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