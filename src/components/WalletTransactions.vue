<template>
  <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <b-container fluid>
      <b-row>
        <b-col>
          <h3>{{$t('transactions')}}</h3>
        </b-col>
        <b-col>
          <!-- " New transaction" modal view -->
          <div>
            <b-button variant="primary" v-b-modal.new_transaction_modal>{{$t('new_transaction')}}</b-button>

            <b-modal
              centered
              id="new_transaction_modal"
              v-bind:title="$t('new_transaction')"
              hide-footer
            >
              <ValidationObserver v-slot="{ handleSubmit }">
                <b-form
                  v-on:submit.prevent="handleSubmit(onNewTransactionPressed)"
                  id="new_transaction_form"
                >
                  {{$t("type")}}:
                  <br />
                  <br />
                  <b-form-radio
                    value="expense"
                    name="type"
                    v-on:change.native="handleAmount"
                    v-model="transactionFormSelectedType"
                    selected
                  >{{$t("expense")}}</b-form-radio>
                  <b-form-radio
                    type="radio"
                    value="revenue"
                    name="type"
                    v-on:change.native="handleAmount"
                    v-model="transactionFormSelectedType"
                  >{{$t("revenue")}}</b-form-radio>
                  <br />
                  <br />
                  <span>{{$t('amount')}} ({{walletCurrency}}):</span>
                  <br />
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group id="wrapper-form-amount">
                      <b-form-input
                        size="sm"
                        type="number"
                        name="amount"
                        :state="errors[0]? false : null"
                        oninput="validity.valid||(value='');"
                        v-model="transactionFormAmount"
                        v-on:update="handleAmount"
                      />
                      <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                  <span>{{$t('description')}}:</span>
                  <br />
                  <b-form-input size="sm" type="text" name="description" />
                  <br />
                  <span>Category:</span>
                  <b-form-select
                    size="sm"
                    name="category"
                    v-model="transactionFormSelectedCategory"
                  >
                    <option v-bind:value="$t('other')" selected>{{$t('other')}}</option>
                    <option
                      v-for="(category, i) in userFormSelectedCategories"
                      :key="i"
                      v-bind:value="category.name"
                    >{{category.name}}</option>
                  </b-form-select>
                  <br />
                  <br />
                  <b-button type="submit" :variant="transactionFormBtnVariant">{{$t('create')}}</b-button>
                </b-form>
              </ValidationObserver>
            </b-modal>
          </div>
        </b-col>
      </b-row>
      <br />
      <b-row v-for="i in Math.ceil(walletTransactions.length / 2)" :key="i">
        <b-col class="transaction_view">
          {{convertFromEUR(walletTransactions[walletTransactions.length-(i*2)+1].amountEUR, walletCurrency)}}
          {{walletCurrency}}
          <br />
          <svgicon
            :icon="walletTransactions[walletTransactions.length-(i*2)+1].category.icon"
            color="#fff"
            :style="'background-color:' + walletTransactions[walletTransactions.length-(i*2)+1].category.color"
            class="small_icon"
          />
          {{walletTransactions[walletTransactions.length-(i*2)+1].category.name}}
          <br />
          {{walletTransactions[walletTransactions.length-(i*2)+1].description}}
          <br />
          {{new Date(walletTransactions[walletTransactions.length-(i*2)+1].instant._seconds*1000).toLocaleDateString()}}
          <br />
        </b-col>
        <b-col v-if="walletTransactions.length-(i*2) >= 0" class="transaction_view">
          {{convertFromEUR(walletTransactions[walletTransactions.length-(i*2)].amountEUR, walletCurrency)}}
          {{walletCurrency}}
          <br />
          <svgicon
            :icon="walletTransactions[walletTransactions.length-(i*2)].category.icon"
            color="#fff"
            :style="'background-color:' + walletTransactions[walletTransactions.length-(i*2)].category.color"
            class="small_icon"
          />
          {{walletTransactions[walletTransactions.length-(i*2)].category.name}}
          <br />
          {{walletTransactions[walletTransactions.length-(i*2)].description}}
          <br />
          {{new Date(walletTransactions[walletTransactions.length-(i*2)].instant._seconds*1000).toLocaleDateString()}}
          <br />
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import * as utils from "../utils";
import "../compiled-icons";
import { createNewTransaction } from "../plugins/firebase";

export default {
  name: "WalletTransactions",
  data: function() {
    return {
      transactionFormSelectedCategory: this.$t("other"),
      transactionFormSelectedType: "expense",
      transactionFormAmount: ""
    };
  },
  props: ["wallet", "user"],
  computed: {
    walletId: function() {
      return this.wallet !== null ? this.wallet.id : "";
    },
    walletCurrency: function() {
      return this.wallet !== null ? this.wallet.currency : "";
    },
    walletTransactions: function() {
      return this.wallet !== null && this.wallet.transactions !== undefined
        ? this.wallet.transactions
        : [];
    },

    userExpenseCategories: function() {
      return this.user !== null && this.user.expenseCategories !== undefined
        ? this.user.expenseCategories
        : [];
    },
    userRevenueCategories: function() {
      return this.user !== null && this.user.revenueCategories !== undefined
        ? this.user.revenueCategories
        : [];
    },

    userFormSelectedCategories() {
      return this.transactionFormSelectedType === "expense"
        ? this.userExpenseCategories
        : this.userRevenueCategories;
    },

    transactionFormBtnVariant() {
      return this.transactionFormAmount !== "" ? "primary" : "";
    }
  },
  methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    },
    handleAmount() {
      if (
        (this.transactionFormAmount > 0 &&
          this.transactionFormSelectedType === "expense") ||
        (this.transactionFormAmount < 0 &&
          this.transactionFormSelectedType === "revenue")
      ) {
        this.transactionFormAmount = -this.transactionFormAmount;
      }
    },
    /**
     * Called when the "new transaction" button is pressed.
     */
    onNewTransactionPressed() {
      let form = document.getElementById("new_transaction_form");
      if (form.amount.value === "") {
        //alert("Fill out all the fields");
        return;
      }

      let amountEUR = utils.convertToEUR(
        parseFloat(form.amount.value),
        this.walletCurrency
      );

      const category = this.getCategoryByName(
        this.transactionFormSelectedCategory
      );

      const formData = {
        amount: amountEUR,
        description: form.description.value,
        category: category
      };

      createNewTransaction(this.walletId, formData, transaction =>
        this.wallet.transactions.push(transaction)
      );
      this.wallet.balanceEUR = amountEUR + this.wallet.balanceEUR;
      this.wallet.budget.spentEUR =
        amountEUR < 0
          ? -amountEUR + this.wallet.budget.spentEUR
          : this.wallet.budget.spentEUR;

      this.$bvModal.hide("new_transaction_modal");
      // Reset the form on leave
      this.transactionFormAmount = "";
      this.transactionFormSelectedType = "expense";
    },

    /**
     * Returns the right category for the given name.
     */
    getCategoryByName(name) {
      if (this.transactionFormSelectedType === "expense") {
        for (let category of this.userExpenseCategories) {
          if (category.name === name) {
            return category;
          }
        }
      } else {
        for (let category of this.userRevenueCategories) {
          if (category.name === name) {
            return category;
          }
        }
      }
      return { name: this.$t("other"), color: "#788D93", icon: "" };
    }
  }
};
</script>

<style>
.inline-error {
  position: absolute;
}
#wrapper-form-amount {
  margin-bottom: 30px;
}

.transaction_view {
  border-radius: 25px;
  border: 1px solid #555555;
  margin: 5px;
}

</style>