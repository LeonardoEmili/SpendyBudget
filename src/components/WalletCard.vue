<template>
  <b-card style="background-color: cyan">
     <h2>{{walletName}}</h2>
    <p>{{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
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
import { createNewTransaction } from '../plugins/firebase'

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
        this.wallet.balanceEUR = parseFloat(amountEUR) + this.wallet.balanceEUR


      this.$bvModal.hide("new_transaction_modal");
    },
    }
}
</script>

<style>

</style>