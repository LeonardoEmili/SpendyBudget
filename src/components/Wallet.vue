<template>
<div>
  <wallet-info :wallet="wallet"></wallet-info>
  <wallet-budget :wallet="wallet"></wallet-budget>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <h3>{{$t('transactions')}}</h3>
    <div>
        <div v-for="i in walletTransactions.length" :key="i">
        {{convertFromEUR(walletTransactions[walletTransactions.length-i].amountEUR, walletCurrency)}}
        {{walletCurrency}}
        <br>
        <svgicon
                :icon="walletTransactions[walletTransactions.length-i].category.icon"
                color= "#fff"
                :style="'background-color:' + walletTransactions[walletTransactions.length-i].category.color"
                class="small_icon"
              />
              {{walletTransactions[walletTransactions.length-i].category.name}}
        <br>
        {{walletTransactions[walletTransactions.length-i].description}}
        <br>
        {{new Date(walletTransactions[walletTransactions.length-i].instant._seconds*1000).toLocaleDateString()}}
        <br><br>
        </div>
        Expense:
        <br>
        <doughnut-chart class="chart" :chartdata="expenseTransactionsChartData" :options="null"></doughnut-chart>
        <br>
        Revenue:
        <br>
        <doughnut-chart class="chart" :chartdata="revenueTransactionsChartData" :options="null"></doughnut-chart>
    </div>
       <!-- " New transaction" modal view -->
        <div>
          <b-button v-b-modal.new_transaction_modal>{{$t('new_transaction')}}</b-button>

          <b-modal id="new_transaction_modal" v-bind:title="$t('new_transaction')" hide-footer>
            <b-form id="new_transaction_form">
              Type:
              <br ><br>
              <b-form-radio  value="expense" name="type" v-model="transactionFormSelectedType" selected>
              Expense
            </b-form-radio>
              <b-form-radio type="radio"  value="revenue" name="type" v-model="transactionFormSelectedType">
              Revenue
            </b-form-radio>
              <br><br>
              {{$t('amount')}} ({{walletCurrency}}):
              <br >
              <div v-if="transactionFormSelectedType === 'expense'">-</div>
              <b-form-input type="number" name="amount" required />
              <br >
              <br >
             {{$t('description')}}:
            <br >
            <b-form-input type="text" name="description" />
            <br>
            Category:
            <b-form-select name="category" v-model="transactionFormSelectedCategory">
                <option v-bind:value="$t('other')" selected>{{$t('other')}}</option>
                <option v-for="(category, i) in userFormSelectedCategories" :key="i" 
                  v-bind:value="category.name">{{category.name}}</option>
              </b-form-select>
            </b-form>
            <br >
            <br >
            <b-button v-on:click="onNewTransactionPressed">{{$t('create')}}</b-button>
          </b-modal>
        </div>
    
  </b-card>

</div>
  
</template>

<script>
import * as utils from "../utils"
import { createNewTransaction } from '../plugins/firebase'
import WalletInfo from './WalletInfo.vue'
import WalletBudget from './WalletBudget.vue'
import DoughnutChart from './DoughnutChart.vue'
import "../compiled-icons";

export default {
    name: "Wallet",
    data: function() {
    return {
      transactionFormSelectedCategory: this.$t("other"),
      transactionFormSelectedType: "expense"
    }
    },
    props: [
        "wallet",
        "user"
    ],
    components: {
      walletInfo: WalletInfo,
      walletBudget: WalletBudget,
      doughnutChart: DoughnutChart
    },
    computed: {
        walletId: function () {return  this.wallet !== null ? this.wallet.id : ""},
        walletName: function () {return  this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
       
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},
        userExpenseCategories:  function () {return this.user !== null && this.user.expenseCategories !== undefined 
            ? this.user.expenseCategories : []},     
        userRevenueCategories:  function () {return this.user !== null && this.user.revenueCategories !== undefined 
            ? this.user.revenueCategories : []},   
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
        budgetChartData: function() {return {
          labels: [this.$t('available'), this.$t('spent')],
          datasets: [
            {
              label: 'Budget data',
              backgroundColor: ['#22cc22', '#cc2222'],
              data: [
                this.walletBudget.spentEUR <= this.walletBudget.budgetEUR 
                ? utils.convertFromEUR(this.walletBudget.budgetEUR-this.walletBudget.spentEUR,
                this.walletCurrency)
                : 0,
                utils.convertFromEUR(this.walletBudget.spentEUR,
                this.walletCurrency)]
            }
          ]
        }
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

      userFormSelectedCategories() {
        return this.transactionFormSelectedType === 'expense'
          ? this.userExpenseCategories
          : this.userRevenueCategories
      }
    },
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    },
    /**
     * Called when the "new transaction" button is pressed.
     */
    onNewTransactionPressed() {
      let form = document.getElementById("new_transaction_form");
      if (form.amount.value === "") {
        alert("Fill out all the fields");
        return;
      }

      let amountEUR = utils.convertToEUR(parseFloat(form.amount.value), this.walletCurrency)

      // Turning into negative if it's an expense
      if (this.transactionFormSelectedType === "expense") {
        amountEUR = -amountEUR
      }

      const category = this.getCategoryByName(this.transactionFormSelectedCategory)
        
        const formData = {
        amount: amountEUR,
        description: form.description.value,
        category: category
      };


      createNewTransaction(this.walletId, formData, transaction => 
            this.wallet.transactions.push(transaction)
            );
        this.wallet.balanceEUR = amountEUR + this.wallet.balanceEUR
        this.wallet.budget.spentEUR = amountEUR < 0 
          ? - amountEUR + this.wallet.budget.spentEUR
          : this.wallet.budget.spentEUR


      this.$bvModal.hide("new_transaction_modal");

    },
    

    /**
     * Returns the right category for the given name.
     */
    getCategoryByName(name) {

      if (this.transactionFormSelectedType === 'expense') {

      for (let category of this.userExpenseCategories) {
        if (category.name === name) {
          return category
        }
      }

      } else {

      for (let category of this.userRevenueCategories) {
        if (category.name === name) {
          return category
        }
      }
      }
      return {name:this.$t("other"), color:"#788D93", icon:""}
    }

    }

    
}
</script>

<style>


  .wallet_card {
    border-radius: 12px;
  }

.chart {
  width: 50%;
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