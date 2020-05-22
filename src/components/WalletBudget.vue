<template>
  <b-card class="shadow-sm p-3 mb-5 wallet_card">
    <!-- Wallet budget -->
    <b-container class="zero-pad-budget">
      <b-row>
        <b-col>
          <h3>{{$t('budget')}}</h3>
          <div v-if="walletBudget.expiryDate._seconds*1000 > Date.now()">
            <!-- Budget valid -->
            <p>{{$t('your_budget_for')}} {{convertFromEUR(walletBudget.budgetEUR, walletCurrency)}} {{walletCurrency}}</p>
            <p>{{$t('you_have_reached')}} {{(walletBudget.spentEUR*100/walletBudget.budgetEUR).toFixed(0)}}%.</p>
            <p>{{$t('the_budget_is_set')}} {{new Date(walletBudget.expiryDate._seconds*1000).toLocaleDateString()}}</p>
          </div>
          <div v-else>
            <!-- Budget expired -->
            <p>{{$t('you_do_not_have_a_budget')}}</p>
          </div>
          <!-- Edit budget modal -->
          <div>
            <b-button variant="primary" v-b-modal.edit_budget_modal>{{$t('edit_budget')}}</b-button>

            <b-modal centered id="edit_budget_modal" v-bind:title="$t('edit_budget')" hide-footer>
              <ValidationObserver v-slot="{ handleSubmit }">
                <b-form
                  id="edit_budget_form"
                  v-on:submit.prevent="handleSubmit(onEditBudgetPressed)"
                >
                  {{$t('amount')}} ({{walletCurrency}}):
                  <br />
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group>
                      <b-form-input
                        type="number"
                        name="amount"
                        size="sm"
                        min="0"
                        :state="errors[0]? false : null"
                        v-model="budgetFormAmount"
                      />
                      <b-form-invalid-feedback class="inline-error">{{ $t(errors[0]) }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                  <br />
                  <span>{{$t('until')}}</span>
                  <b-form-datepicker
                    size="sm"
                    :min="Date()"
                    name="expiryDate"
                    :placeholder="$t('choose_a_date')"
                    v-model="budgetFormExpiryDate"
                    required
                  />
                  <br />
                  <b-button type="submit" :variant="budgetFormBtnVariant">{{$t('edit_budget')}}</b-button>
                </b-form>
              </ValidationObserver>
            </b-modal>
          </div>
        </b-col>

        <b-col v-if="walletBudget.expiryDate._seconds*1000 > Date.now()" class="zero-pad-budget">
          <pie-chart
            :height="300"
            :class="{chart: !isMobileView(), chart_mobile: isMobileView()}"
            :chartdata="budgetChartData"
            :options="null"
          ></pie-chart>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import * as utils from "../utils";
import { firestore } from "firebase";
import { editBudget } from "../plugins/firebase";
import PieChart from "./PieChart.vue";
import { app } from "../main";


export default {
  name: "WalletBudget",
  data: function() {
    return {
      budgetFormAmount: "",
      budgetFormExpiryDate: ""
    };
  },
  props: ["wallet"],
  components: {
    pieChart: PieChart
  },
  computed: {
    walletId: function() {
      return this.wallet !== null ? this.wallet.id : "";
    },
    walletCurrency: function() {
      return this.wallet !== null ? this.wallet.currency : "";
    },
    walletBudget: function() {
      return this.wallet !== null
        ? this.wallet.budget
        : {
            budgetEUR: 0.0,
            expiryDate: firestore.Timestamp.fromMillis(0),
            spentEUR: 0.0
          };
    },
    walletTransactions: function() {
      return this.wallet !== null && this.wallet.transactions !== undefined
        ? this.wallet.transactions
        : [];
    },

    budgetChartData: function() {
      return {
        labels: [this.$t("available"), this.$t("spent")],
        datasets: [
          {
            label: "Budget data",
            backgroundColor: ["#22cc22", "#cc2222"],
            data: [
              this.walletBudget.spentEUR <= this.walletBudget.budgetEUR
                ? utils.convertFromEUR(
                    this.walletBudget.budgetEUR - this.walletBudget.spentEUR,
                    this.walletCurrency
                  )
                : 0,
              utils.convertFromEUR(
                this.walletBudget.spentEUR,
                this.walletCurrency
              )
            ]
          }
        ]
      };
    },
    budgetFormBtnVariant() {
      return this.budgetFormAmount !== "" && this.budgetFormExpiryDate !== ""
        ? "primary"
        : "";
    }
  },
  methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
    },
    isMobileView() {
      return utils.isMobileView();
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
      if (new Date(this.budgetFormExpiryDate) < new Date()) {
        alert("Insert a future date");
        return;
      }

      const budgetEUR = utils.convertToEUR(
        parseFloat(form.amount.value),
        this.walletCurrency
      );
      const expiryDate = new Date(form.expiryDate.value);

      const formData = {
        budgetEUR: budgetEUR,
        expiryDate: expiryDate.getTime()
      };

      app.showProgress = true;
      editBudget(
        this.walletId,
        formData,
        budget => {
          app.showProgress = false;
          this.wallet.budget = budget
          }
      );

      this.$bvModal.hide("edit_budget_modal");
    }
  }
};
</script>

<style>
.zero-pad-budget {
  padding: 0;
}
.inline-error {
  position: absolute;
}
</style>