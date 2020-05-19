<template>
      <b-card class="shadow-sm p-3 mb-5 wallet_card" >
        <!-- Wallet budget -->
        <b-container>
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
                    <b-form id="edit_budget_form">
                    {{$t('amount')}} ({{walletCurrency}}):
                    <br >
                    <b-form-input type="number" name="amount" required />
                    <br >
                    {{$t('until')}}
                    <br >
                    <b-form-datepicker name="expiryDate" required/>
                    <br >
                    </b-form>
            
                    <b-button v-on:click="onEditBudgetPressed">{{$t('edit_budget')}}</b-button>
                </b-modal>
                </div>
        </b-col>
        
        <b-col v-if="walletBudget.expiryDate._seconds*1000 > Date.now()">

      <pie-chart  :class="{chart: !isMobileView(), chart_mobile: isMobileView()}" 
            :chartdata="budgetChartData" :options="null"></pie-chart>
    

        </b-col>
            </b-row>
      </b-container>
     </b-card>
</template>

<script>
import * as utils from "../utils"
import { firestore } from 'firebase'
import { editBudget } from '../plugins/firebase'
import PieChart from './PieChart.vue'


export default {
    name: "WalletBudget",
    props: [
        "wallet"
    ],
    components: {
        pieChart: PieChart,
    },
    computed: {
        walletId: function () {return  this.wallet !== null ? this.wallet.id : ""},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
         walletBudget:  function () {return this.wallet !== null ? this.wallet.budget : {
          budgetEUR: 0.0,
          expiryDate: firestore.Timestamp.fromMillis(0),
          spentEUR: 0.0}},
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
    },

   
}
</script>

<style>

</style>