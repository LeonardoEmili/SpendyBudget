<template>
  <div>
    <p>{{ $t('welcome') }}</p>
    <b-button variant="primary" v-on:click="toggleLocale">Switch locale!!</b-button>
  </div>
</template>

<script>
import i18n from "../plugins/i18n-vue";

export default {
  name: "HelloI18n",
  methods: {
    toggleLocale() {
      console.log(localStorage.getItem('user-locale'));
      if (i18n.locale === "en") {
        i18n.locale = "it";
      } else {
        i18n.locale = "en";
      }
      localStorage.setItem('user-locale', i18n.locale);
    }
  }
};
</script>