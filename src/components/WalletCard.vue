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
            <form id="edit_budget_form">
              {{$t('amount')}} ({{walletCurrency}}):
              <br >
              <input type="number" name="amount" required />
              <br >
              <br >
              {{$t('until')}}
            <br >
            <input type="date" name="expiryDate" required/>
            </form>
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
        <pie-chart class="chart" :chartdata="transactionsChartData" :options="null"></pie-chart>
    </div>
       <!-- " New transaction" modal view -->
        <div>
          <b-button v-b-modal.new_transaction_modal>{{$t('new_transaction')}}</b-button>

          <b-modal id="new_transaction_modal" v-bind:title="$t('new_transaction')" hide-footer>
            <form id="new_transaction_form">
              {{$t('amount')}} ({{walletCurrency}}):
              <br >
              <input type="number" name="amount" required />
              <br >
              <br >
             {{$t('description')}}:
            <br >
            <input type="text" name="description" />
            <br><br>
            <select name="category" v-model="transactionFormSelectedCategory">
                <option v-bind:value="$t('other')" selected>{{$t('other')}}</option>
                <option v-for="category in userCategories" :key="category.name" 
                  v-bind:value="userCategories[i].name">{{userCategories[i].name}}</option>
              </select>
            </form>
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

export default {
    name: "WalletCard",
    data: function() {
    return {
      transactionFormSelectedCategory: "Other",
    }
    },
    props: [
        "wallet",
        "user"
    ],
    components: {
      pieChart: PieChart
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
        walletTransactions:  function () {return this.wallet !== null ? this.wallet.transactions : []},
        userCategories:  function () {return this.user !== null && this.user.categories !== null 
            ? this.user.categories : []},      
        walletTransactionsCategories:  function () {
          let categories = []
          for (let transaction of this.walletTransactions) {
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
          labels: ["Available", "Spent"],
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
        transactionsChartData: function() {return {
          labels: this.walletTransactionsCategories.map(category => category.name),
          datasets: [
            {
              label: 'Transactions data',
              backgroundColor: this.walletTransactionsCategories.map(category => category.color),
              data: this.walletTransactionsCategories.map(category => utils.convertFromEUR(category.amountEUR, this.walletCurrency))
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

      const amountEUR = utils.convertToEUR(parseFloat(form.amount.value), this.walletCurrency)

        const formData = {
        amount: amountEUR,
        description: form.description.value,
        category: this.getCategoryByName(this.transactionFormSelectedCategory)
      };

      createNewTransaction(this.walletId, formData, transaction => 
            this.wallet.transactions.push(transaction)
            );
        this.wallet.balanceEUR = amountEUR + this.wallet.balanceEUR
        this.wallet.budget.spentEUR = amountEUR >= 0 
          ? amountEUR + this.wallet.budget.spentEUR
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
      if (this.user.categories !== undefined) {

      
      this.user.categories.forEach((category) => {
        if (category.name === name) {
          return category
        }
      }
      )
      }
      return {name:"Other", color:"#788D93"}
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