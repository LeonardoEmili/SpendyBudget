import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Initialize the components
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

// Custom validations below here
// TODO: translate messages in the chosen language

extend('required', {
    ...required,
    message: 'This field is required'
});

extend('email', {
    ...email,
    message: 'The email address must be a valid email'
});

extend("password", {
    params: ["target"],
    validate(value, { target }) {
        return value === target;
    },
    message: "Password confirmation does not match"
});