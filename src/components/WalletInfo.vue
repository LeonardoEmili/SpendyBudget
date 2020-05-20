<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-card class="shadow-sm  wallet_card info_card">
                    <h3>{{$t("last_week")}}</h3>
                    <!-- Wallet balance -->
                    <p>{{$t('balance')}} {{convertFromEUR(getBalanceOfLastDays(7), walletCurrency)}} {{walletCurrency}}</p>
                </b-card>
            </b-col>
             <b-col>
                <b-card class="shadow-sm  wallet_card info_card">
                    <h3>{{$t("last_month")}}</h3>
                    <!-- Wallet balance -->
                    <p>{{$t('balance')}} {{convertFromEUR(getBalanceOfLastDays(30), walletCurrency)}} {{walletCurrency}}</p>
                </b-card>
            </b-col>
            <b-col>
                <b-card class="shadow-sm  wallet_card info_card">
                    <h3>{{$t("all_time")}}</h3>
                    <!-- Wallet balance -->
                    <p>{{$t('balance')}} {{convertFromEUR(walletBalanceEUR, walletCurrency)}} {{walletCurrency}}</p>
                </b-card>
            </b-col>
            
      </b-row>
    </b-container>
</template>

<script>
import * as utils from "../utils"

export default {
    name: "WalletInfo",
    props: [
        "wallet"
    ],
    computed: {
        walletName: function () {return  this.wallet !== null ? this.wallet.name : ""},
        walletBalanceEUR:  function () {return this.wallet !== null ? this.wallet.balanceEUR : 0.0},
        walletCurrency:  function () {return this.wallet !== null ? this.wallet.currency : ""},
        walletTransactions:  function () {return this.wallet !== null && this.wallet.transactions !== undefined
           ? this.wallet.transactions : []}
    },
    methods: {
    convertFromEUR(quantityEUR, currency) {
      return utils.convertFromEUR(quantityEUR, currency);
        },

        
    getBalanceOfLastDays(daysNum) {
        let ret = 0.0
        for (let transaction of this.walletTransactions) {
            if (transaction.instant._seconds/60/60/24 >=
                Date.now()/1000/60/60/24 - daysNum) {
                    ret += transaction.amountEUR
                }
        }
        return ret
    }
    }
}
</script>

<style>

.info_card {
    width: 250px;
}

</style>