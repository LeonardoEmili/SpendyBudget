<template>
  <b-card style="background-color: cyan">
     <h2>{{walletName}}</h2>
     <!-- Wallet balance -->
    <p>Balance: {{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
    <!-- Wallet budget -->
    <h3>Budget</h3>
    <div v-if="walletBudget.expiryDate._seconds*1000 > Date.now()">
      <!-- Budget valid -->
      <p>Your budget for this wallet is: {{convertFromEUR(walletBudget.budgetEUR, walletCurrency)}} {{walletCurrency}}</p>
      <p>You've reached the {{(walletBudget.spentEUR*100/walletBudget.budgetEUR).toFixed(0)}}% of it.</p>
      <p>The budget is set until {{new Date(walletBudget.expiryDate._seconds*1000).toLocaleDateString()}}</p>
    </div>
    <div v-else> 
      <!-- Budget expired -->
      <p>You don't have a budget set for this wallet.</p>
       
    </div>
    <!-- Edit budget modal -->
     <div>
          <b-button v-b-modal.edit_budget_modal>Edit budget</b-button>

          <b-modal id="edit_budget_modal" title="Edit budget" hide-footer>
            <form id="edit_budget_form">
              Amount ({{walletCurrency}}):
              <br >
              <input type="number" name="amount" required />
              <br >
              <br >
              Until:
            <br >
            <input type="date" name="expiryDate" required/>
            </form>
            <br >
            <br >
            <b-button v-on:click="onEditBudgetPressed">Edit budget</b-button>
          </b-modal>
        </div>
      <br><br>
    <h3>Transactions</h3>
    <div>
        <div v-for="i in walletTransactions.length" :key="i">
        {{convertFromEUR(walletTransactions[walletTransactions.length-i].amount, walletCurrency)}}
        {{walletCurrency}}
        <br>
        {{walletTransactions[walletTransactions.length-i].description}}
        <br>
        {{new Date(walletTransactions[walletTransactions.length-i].instant._seconds*1000).toLocaleDateString()}}
        <br><br>
        </div>
    </div>
       <!-- " New transaction" modal view -->
        <div>
          <b-button v-b-modal.new_transaction_modal>New transaction</b-button>

          <b-modal id="new_transaction_modal" title="New transaction" hide-footer>
            <form id="new_transaction_form">
              Amount ({{walletCurrency}}):
              <br >
              <input type="number" name="amount" required />
              <br >
              <br >
             Description:
            <br >
            <input type="text" name="description" />
            </form>
            <br >
            <br >
            <b-button v-on:click="onNewTransactionPressed">Create</b-button>
          </b-modal>
        </div>
    
  </b-card>
  
</template>

<script>
import * as utils from "../utils"
import { createNewTransaction, editBudget } from '../plugins/firebase'
import { firestore } from 'firebase'

export default {
    
    name: "WalletCard",
    props: [
        "wallet"
    ],
    computed: {
        walletId: function () {return  this.wallet !== null ? this.wallet.id : ""},
        walletName: function () {return  this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
        walletBudget:  function () {return this.wallet !== null ? this.wallet.budget : {
          budgetEUR: 0.0,
          expiryDate: firestore.Timestamp.fromMillis(0),
          spentEUR: 0.0}},
        walletTransactions:  function () {return this.wallet !== null ? this.wallet.transactions : []}
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

      const amountEUR = utils.convertToEUR(parseFloat(form.amount.value), this.walletCurrency)

        const formData = {
        amount: amountEUR,
        description: form.description.value
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
    }
    }
}
</script>

<style>

</style>