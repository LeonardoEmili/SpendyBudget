<template>
  <b-card style="background-color: cyan">
     <h2>{{walletName}}</h2>
     <!-- Wallet balance -->
    <p>{{$t('balance')}} {{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
    <!-- Wallet budget -->
    <h3>{{$t('budget')}}</h3>
    <div v-if="walletBudget.expiryDate._seconds*1000 > Date.now()">
      <!-- Budget valid -->
      <p>{{$t('your_budget_for')}} {{convertFromEUR(walletBudget.budgetEUR, walletCurrency)}} {{walletCurrency}}</p>
      <p>{{$t('you_have_reached')}} {{(walletBudget.spentEUR*100/walletBudget.budgetEUR).toFixed(0)}}%.</p>
      <p>{{$t('the_budget_is_set')}} {{new Date(walletBudget.expiryDate._seconds*1000).toLocaleDateString()}}</p>

      <pie-chart class="chart" :chartdata="budgetChartData" :options="null"></pie-chart>
      <br><br>
    </div>
    <div v-else> 
      <!-- Budget expired -->
      <p>{{$t('you_do_not_have_a_budget')}}</p>
       
    </div>
    <!-- Edit budget modal -->
     <div>
          <b-button v-b-modal.edit_budget_modal>{{$t('edit_budget')}}</b-button>

          <b-modal id="edit_budget_modal" v-bind:title="$t('edit_budget')" hide-footer>
            <b-form id="edit_budget_form">
              {{$t('amount')}} ({{walletCurrency}}):
              <br >
              <b-form-input type="number" name="amount" required />
              <br >
              <br >
              {{$t('until')}}
            <br >
            <b-form-input type="date" name="expiryDate" required/>
            </b-form>
            <br >
            <br >
            <b-button v-on:click="onEditBudgetPressed">{{$t('edit_budget')}}</b-button>
          </b-modal>
        </div>
      <br><br>
    <h3>{{$t('transactions')}}</h3>
    <div>
        <div v-for="i in walletTransactions.length" :key="i">
        {{convertFromEUR(walletTransactions[walletTransactions.length-i].amountEUR, walletCurrency)}}
        {{walletCurrency}}
        <br>
        <div class="small_icon" v-bind:style="transactionCategoryIconStyle(walletTransactions[walletTransactions.length-i].category)"> </div>
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
            <br><br>
            <!-- TODO: Differentiate expense and revenue categories-->
            <b-form-select name="category" v-model="transactionFormSelectedCategory">
                <option v-bind:value="$t('other')" selected>{{$t('other')}}</option>
                <div  v-if="transactionFormSelectedType === 'expense'">
                <option v-for="category in userExpenseCategories" :key="category.name" 
                  v-bind:value="userExpenseCategories[i].name">{{userExpenseCategories[i].name}}</option>
                </div>
                <div  v-else>
                <option v-for="category in userRevenueCategories" :key="category.name" 
                  v-bind:value="userRevenueCategories[i].name">{{userRevenueCategories[i].name}}</option>
                </div>
              </b-form-select>
            </b-form>
            <br >
            <br >
            <b-button v-on:click="onNewTransactionPressed">{{$t('create')}}</b-button>
          </b-modal>
        </div>
    
  </b-card>
  
</template>

<script>
import * as utils from "../utils"
import { createNewTransaction, editBudget } from '../plugins/firebase'
import { firestore } from 'firebase'
import PieChart from './PieChart.vue'
import DoughnutChart from './DoughnutChart.vue'

export default {
    name: "WalletCard",
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
      pieChart: PieChart,
      doughnutChart: DoughnutChart
    },
    computed: {
        walletId: function () {return  this.wallet !== null ? this.wallet.id : ""},
        walletName: function () {return  this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
        walletBudget:  function () {return this.wallet !== null ? this.wallet.budget : {
          budgetEUR: 0.0,
          expiryDate: firestore.Timestamp.fromMillis(0),
          spentEUR: 0.0}},
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},
        userExpenseCategories:  function () {return this.user !== null && this.user.expenseCategories !== null 
            ? this.user.expenseCategories : []},     
        userRevenueCategories:  function () {return this.user !== null && this.user.revenueCategories !== null 
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
        
        
      }

    },
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    },
    
        transactionCategoryIconStyle(category) {
          return {
            background: category.color
          }
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
        const formData = {
        amount: amountEUR,
        description: form.description.value,
        category: this.getCategoryByName(this.transactionFormSelectedCategory)
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
     * Called when the "edit budget" button is pressed.
     */
    onEditBudgetPressed() {
      let form = document.getElementById("edit_budget_form");
      if (form.amount.value === "" || form.expiryDate.value === "") {
        alert("Fill out all the fields");
        return;
      }

      const budgetEUR = utils.convertToEUR(parseFloat(form.amount.value), this.walletCurrency)
      const expiryDate = new Date(form.expiryDate.value)

        const formData = {
        budgetEUR: budgetEUR,
        expiryDate: expiryDate.getTime()
      };

      editBudget(this.walletId, formData, budget => 
            this.wallet.budget = budget
            );

      this.$bvModal.hide("edit_budget_modal");
    },

    /**
     * Returns the right category for the given name.
     */
    getCategoryByName(name) {
      if (this.user.expenseCategories !== undefined) {

      
      this.user.expenseCategories.forEach((category) => {
        if (category.name === name) {
          return category
        }
      })
      }
      if (this.user.revenueCategories !== undefined) {
      this.user.revenueCategories.forEach((category) => {
        if (category.name === name) {
          return category
        }
      })
      }
      return {name:this.$t("other"), color:"#788D93"}
    }
    }

    
}
</script>

<style>

.chart {
  width: 50%;
  display: inline-block;
}

.small_icon {
  width: 25px;
      height: 25px;
      -webkit-border-radius: 25px;
      -moz-border-radius: 25px;
      border-radius: 25px;
      display: inline-block;
}
</style>