<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card">
        <h3>{{$t('transactions')}}</h3>
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
      </b-card>
</template>

<script>
import * as utils from "../utils"
import "../compiled-icons";
import { createNewTransaction } from '../plugins/firebase'


export default {
    name: "WalletTransactions",
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
    computed: {
        walletId: function () {return  this.wallet !== null ? this.wallet.id : ""},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []},

           userExpenseCategories:  function () {return this.user !== null && this.user.expenseCategories !== undefined 
            ? this.user.expenseCategories : []},     
        userRevenueCategories:  function () {return this.user !== null && this.user.revenueCategories !== undefined 
            ? this.user.revenueCategories : []},   

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

</style>