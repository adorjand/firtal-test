export const VALIDATORS = {
    notBlank: {
        validatorFunction: function (value) {
            return value !== undefined && value !== "";
        },
        errorMessage: "Can't be blank",
    },
    minLength: {
        validatorFunction: function (value, minLength) {
            return value.length >= minLength;
        },
        errorMessage: `Must be at least ___variable___ characters`,
    },
    name: {
        validatorFunction: function (value) {
            return /^\s*([A-Za-z]+([.] |[-']| )?)+[A-Za-z]+\.?\s*$/gm.test(value);
        },
        errorMessage:
            "Invalid characters, only letters without diacritics, spaces, periods (.), apostrophes (') and hyphens (-) are allowed",
    },
    numbersOnly: {
        validatorFunction: function (value) {
            // Trim spaces between numbers (Ex. card number mask)
            value = value.replace(/ /g, "");

            return /^\d+$/.test(value);
        },
        errorMessage: "Wrong format, numbers only",
    },
    exactNumbersLength: {
        validatorFunction: function (value, expectedLength) {
            // No validator param defined -> can't validate, consider as valid
            if (expectedLength === undefined) {
                console.warn("Missing validator param for expected length.");
                return true;
            }

            // Trim spaces between numbers (Ex. card number mask)
            value = value.replace(/ /g, "");

            return value.length === expectedLength;
        },
        errorMessage: "This field must be exactly ___variable___ number(s) long",
    },
    month: {
        validatorFunction: function (value) {
            if (value.charAt(0) === "0") {
                value = value.substring(1);
            }
            return value < 13;
        },
        errorMessage: "Invalid month",
    },
};
