export class FormHandler {
    form;
    callback;
    fields = [];
    hasErrors = false;

    constructor(form, callback) {
        // Set fields and check if form element exists
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

        // Apply extra functionalities for fields
        this.fields.forEach((field) => {
            let fieldElement = document.querySelector(field.selector);

            if (fieldElement) {
                let extras = field.extras;

                if (extras !== undefined && extras.length) {
                    extras.forEach((extra) => {
                        this.initExtra(fieldElement, extra);
                    });
                }
            }
        });

        // Set a listener for submit, if no errors invoke the callback function
        this.form.addEventListener("submit", function (e) {
            e.preventDefault();

            self.resetErrors();
            self.validate();

            if (!self.hasErrors) {
                self.callback();
            }
        });
    }

    initExtra(fieldElement, extra) {
        // Check if there is a config parameter
        if (Array.isArray(extra)) {
            let param = extra[1];
            extra = extra[0];

            return extra(fieldElement, param);
        }

        return extra(fieldElement);
    }

    // Iterate through all the field and check for errors
    validate() {
        this.hasErrors = false;

        this.fields.forEach((field) => {
            if (!this.isValidField(field.selector, field.validators)) {
                this.hasErrors = true;
            }
        });
    }

    // Run the validators defined for field
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

                // Check if there is a config parameter and use for error message
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
        // Extra param
        if (Array.isArray(validator)) {
            let param = validator[1];
            validator = validator[0];

            return validator.validatorFunction(value, param);
        }

        return validator.validatorFunction(value);
    }

    // Show error message for fields
    showError(field, message) {
        // Placeholder if the error needs to be rendered elsewhere (Ex.: exp. date month and year errors)
        let placeholder = field.getAttribute("data-project-error");

        // Create element for error message
        let errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        errorMessage.innerText = message;

        // Set field status
        field.classList.add("has-error");

        // Default error message rendering
        if (!placeholder) {
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
            return;
        }

        //  Render into a specific element
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
        // Trigger change event for all the fields to update the UI (ex. cards)
        document.querySelectorAll("input").forEach((field) => field.dispatchEvent(new Event("change")));
    }

    getData() {
        let data = {};

        // Populate date from all the fields
        this.fields.forEach((field) => {
            let fieldElement = document.querySelector(field.selector);

            if (fieldElement) {
                data[field.selector.substring(1)] = fieldElement.value;
            }
        });

        return JSON.stringify(data);
    }
}
