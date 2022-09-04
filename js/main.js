import { VALIDATORS } from "./validators.js";
import { RESTRICTIONS } from "./restrictions.js";

function initRestrictions(fields) {
    fields.forEach((field) => {
        let fieldElement = document.querySelector(field.selector);

        let restrictions = field.restrictions;

        if (restrictions) {
            restrictions.forEach((restriction) => {
                if (Array.isArray(restriction)) {
                    let fn = restriction[0];
                    let param = restriction[1];

                    fn(fieldElement, param);
                } else {
                    restriction(fieldElement);
                }
            });
        }
    });
}

const FIELDS = [
    {
        selector: "#cardholderName",
        validators: [VALIDATORS.notBlank, VALIDATORS.name],
    },
    {
        selector: "#cardNumber",
        validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, [VALIDATORS.exactNumbersLength, 16]],
        restrictions: [RESTRICTIONS.cardNumberMask],
    },
    {
        selector: "#expMonth",
        validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, VALIDATORS.month],
        restrictions: [[RESTRICTIONS.maxLength, 2]],
    },
    {
        selector: "#expYear",
        validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly],
        restrictions: [[RESTRICTIONS.maxLength, 2]],
    },
    {
        selector: "#cvc",
        validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, [VALIDATORS.exactNumbersLength, 3]],
        restrictions: [[RESTRICTIONS.maxLength, 3]],
    },
];

// Iterate through each field and validate them
function validate(fields) {
    let hasErrors = false;

    fields.forEach((field) => {
        if (!isValidField(field.selector, field.validators)) {
            hasErrors = true;
        }
    });

    return !hasErrors;
}

// Run the validators defined for each field
function isValidField(selector, validators) {
    let hasError = false;
    let fieldElement = document.querySelector(selector);

    // If the field was not found -> nothing to validate, consider as valid
    if (!fieldElement) {
        console.warn(`The '${selector}' field was not found, check for typos in the selector name.`);
        return true;
    }

    // No validators defined -> nothing to validate, consider as valid
    if (validators === undefined || !validators.length) {
        console.warn(`No validators defined for the '${selector}' field.`);
        return true;
    }

    validators.forEach((validator) => {
        if (!hasError && !isValid(fieldElement.value, validator)) {
            let errorMessage = validator.errorMessage;

            if (Array.isArray(validator)) {
                errorMessage = validator[0].errorMessage.replace("___variable___", validator[1]);
            }

            showError(fieldElement, errorMessage);
            hasError = true;
        }
    });

    return !hasError;
}

function isValid(value, validator) {
    if (Array.isArray(validator)) {
        return validator[0].validatorFunction(value, validator[1]);
    }

    return validator.validatorFunction(value);
}

function showError(field, message) {
    let placeholder = field.getAttribute("data-project-error");

    let errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.innerText = message;

    field.classList.add("has-error");

    if (!placeholder) {
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
        return;
    }

    let placeholderElement = document.querySelector(placeholder);

    if (placeholderElement && placeholderElement.childNodes.length === 0) {
        placeholderElement.appendChild(errorMessage);
    }
}

function resetErrors() {
    // Remove error state from fields
    document.querySelectorAll(".has-error").forEach((element) => element.classList.remove("has-error"));
    // Remove error messages
    document.querySelectorAll(".error-message").forEach((element) => element.remove());
}

initRestrictions(FIELDS);

document.querySelector("#cardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    resetErrors();
    console.log(validate(FIELDS));
});
