import { VALIDATORS } from "./formHandler/validators.js";
import { EXTRAS } from "./formHandler/extras.js";
import { FormHandler } from "./formHandler/formHandler.js";

// Configuration object for form functionalities
const FORM = {
    selector: "#cardForm",
    fields: [
        {
            selector: "#cardholderName",
            validators: [VALIDATORS.notBlank, [VALIDATORS.minLength, 3], VALIDATORS.name],
            extras: [EXTRAS.mirrorValue],
        },
        {
            selector: "#cardNumber",
            validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, [VALIDATORS.exactNumbersLength, 16]],
            extras: [EXTRAS.cardNumberMask, EXTRAS.mirrorValue],
        },
        {
            selector: "#expMonth",
            validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, VALIDATORS.month],
            extras: [EXTRAS.twoDigitMonth, EXTRAS.completeTwoDigit, [EXTRAS.maxLength, 2], EXTRAS.mirrorValue],
        },
        {
            selector: "#expYear",
            validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly],
            extras: [EXTRAS.completeTwoDigit, [EXTRAS.maxLength, 2], EXTRAS.mirrorValue],
        },
        {
            selector: "#cvc",
            validators: [VALIDATORS.notBlank, VALIDATORS.numbersOnly, [VALIDATORS.exactNumbersLength, 3]],
            extras: [[EXTRAS.maxLength, 3], EXTRAS.mirrorValue],
        },
    ],
};

// Create a FormHandler instance passing the configuration and a callback function to call if the form is valid
let formHandler = new FormHandler(FORM, formIsValid);

// If the form is valid get the form data, process and go to thank you page
function formIsValid() {
    let cardData = formHandler.getData();

    // TODO: process or send the data to the server
    console.log(cardData);

    nextStepTransition();
}

// From thank you page reset the flow
document.querySelector("#reset").addEventListener("click", () => {
    formHandler.resetForm();
    resetTransition();
});

// Small functions to control transition animations
function nextStepTransition() {
    document.querySelector(".first-step").classList.add("hide"); // hide form
    document.querySelector(".loading").classList.add("show"); // show loading

    // simulate date process
    setTimeout(() => {
        document.querySelector(".second-step").classList.add("show"); // show thank you page
        document.querySelector(".loading").classList.remove("show"); // hide loading
    }, 2500);
}

function resetTransition() {
    document.querySelector(".first-step").classList.remove("hide"); // show form
    document.querySelector(".second-step").classList.remove("show"); // hide thank you page
}
