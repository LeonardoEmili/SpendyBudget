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
    message: 'this_field_is_required'
});

extend('email', {
    ...email,
    message: 'the_email_address_must_be_a_valid_email'
});

extend("password", {
    params: ["target"],
    validate(value, { target }) {
        return value === target;
    },
    message: 'password_confirmation_does_not_match'
});

extend("birthdate", {
    params: ["target"],
    validate(value) {
        return new Date() >= new Date(value);
    },
    message: 'do_you_come_from_the_future'
});