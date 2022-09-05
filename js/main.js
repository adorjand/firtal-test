import { VALIDATORS } from "./formHandler/validators.js";
import { EXTRAS } from "./formHandler/extras.js";
import { FormHandler } from "./formHandler/formHandler.js";

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

let formHandler = new FormHandler(FORM, formIsValid);

function formIsValid() {
    let cardData = formHandler.getData();

    // TODO: process or send the data to the server
    console.log(cardData);

    nextStepTransition();
}

document.querySelector("#reset").addEventListener("click", () => {
    formHandler.resetForm();
    resetTransition();
});

function nextStepTransition() {
    document.querySelector(".first-step").classList.add("hide");
    document.querySelector(".loading").classList.add("show");

    setTimeout(() => {
        document.querySelector(".second-step").classList.add("show");
        document.querySelector(".loading").classList.remove("show");
    }, 2500);
}

function resetTransition() {
    document.querySelector(".first-step").classList.remove("hide");
    document.querySelector(".second-step").classList.remove("show");
}
