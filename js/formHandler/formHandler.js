export class FormHandler {
    form;
    callback;
    fields = [];
    hasErrors = false;

    constructor(form, callback) {
        this.fields = form.fields;
        this.callback = callback;

        this.form = document.querySelector(form.selector);

        if (!this.form) {
            return;
        }

        this.initialize();
    }

    initialize() {
        let self = this;

        this.fields.forEach((field) => {
            let fieldElement = document.querySelector(field.selector);

            if (fieldElement) {
                let extras = field.extras;

                if (extras !== undefined && extras.length) {
                    extras.forEach((extra) => {
                        this.initRestriction(fieldElement, extra);
                    });
                }
            }
        });

        this.form.addEventListener("submit", function (e) {
            e.preventDefault();

            self.resetErrors();
            self.validate();

            if (!self.hasErrors) {
                self.callback();
            }
        });
    }

    initRestriction(fieldElement, extra) {
        if (Array.isArray(extra)) {
            let param = extra[1];
            extra = extra[0];

            return extra(fieldElement, param);
        }

        return extra(fieldElement);
    }

    validate() {
        this.hasErrors = false;

        this.fields.forEach((field) => {
            if (!this.isValidField(field.selector, field.validators)) {
                this.hasErrors = true;
            }
        });
    }

    // Run the validators defined for each field
    isValidField(selector, validators) {
        let hasError = false;
        let fieldElement = document.querySelector(selector);

        // If the field was not found -> nothing to validate, consider as valid
        if (!fieldElement) {
            return true;
        }

        // No validators defined -> nothing to validate, consider as valid
        if (validators === undefined || !validators.length) {
            return true;
        }

        validators.forEach((validator) => {
            if (!hasError && !this.validatorPassed(fieldElement.value, validator)) {
                let errorMessage = validator.errorMessage;

                if (Array.isArray(validator)) {
                    let param = validator[1];
                    validator = validator[0];

                    errorMessage = validator.errorMessage.replace("___variable___", param);
                }

                this.showError(fieldElement, errorMessage);
                hasError = true;
            }
        });

        return !hasError;
    }

    validatorPassed(value, validator) {
        if (Array.isArray(validator)) {
            let param = validator[1];
            validator = validator[0];

            return validator.validatorFunction(value, param);
        }

        return validator.validatorFunction(value);
    }

    showError(field, message) {
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

    resetErrors() {
        // Remove error state from fields
        document.querySelectorAll(".has-error").forEach((element) => element.classList.remove("has-error"));
        // Remove error messages
        document.querySelectorAll(".error-message").forEach((element) => element.remove());
    }

    resetForm() {
        this.form.reset();
        document.querySelectorAll("input").forEach((field) => field.dispatchEvent(new Event("change")));
    }

    getData() {
        let data = {};

        this.fields.forEach((field) => {
            let fieldElement = document.querySelector(field.selector);

            if (fieldElement) {
                data[field.selector.substring(1)] = fieldElement.value;
            }
        });

        return JSON.stringify(data);
    }
}
