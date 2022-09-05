export const EXTRAS = {
    maxLength: function (field, maxLength) {
        field.addEventListener("input", () => {
            // Restrict character input when the limit is reached
            field.value = field.value.slice(0, maxLength);

            // When the user is reached the limit -> consider field as filled -> jump to the next field
            // to speed up form completion
            if (field.value.length >= maxLength) {
                EXTRAS.jumpToNextField();
            }
        });
    },
    twoDigitMonth: function (field) {
        field.addEventListener("input", () => {
            // Because the month value can be max 12 put the leading 0 on front of numbers between 2-9
            field.value = field.value.replace(/^([1-9]\/|[2-9])$/g, "0$1"); // 2-9 -> 02-09
        });
    },
    completeTwoDigit: function (field) {
        field.addEventListener("blur", () => {
            // Put the leading zero on blur if needed
            field.value = field.value.replace(/^([1-9]\/|[1-9])$/g, "0$1"); // 1-9 -> 01-09
            // Trigger change event to update the cards UI
            field.dispatchEvent(new Event("change"));
        });
    },
    cardNumberMask: function (field) {
        // Masked input for card number for better UX and easier reading
        field.addEventListener("input", () => {
            let maxLength = 16;
            // Always trim the spaces for easier calculations
            let currentValue = field.value.replace(/ /g, "");
            let modifiedValue = "";

            // Add spaces after every 4th character
            for (let i = 0; i < currentValue.length && i < maxLength; i++) {
                if (i % 4 === 0 && i !== 0) {
                    modifiedValue += " ";
                }
                modifiedValue += currentValue[i];
            }

            // Update the field
            field.value = modifiedValue;

            // If we have all the 16 characters, consider field as filler -> jump to the next field
            if (currentValue.length >= maxLength) {
                EXTRAS.jumpToNextField();
            }
        });
    },
    mirrorValue: function (field) {
        // On user input update the content of the target/mirror element (placeholders on cards)
        let targetSelector = field.getAttribute("data-mirror");
        let target = document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        // save the initial content for cases when the field eventually get cleared
        target.setAttribute("data-default", target.textContent);

        ["input", "change"].forEach((event) => {
            field.addEventListener(event, () => {
                // Update mirror element content with field value, if empty with saved default value
                target.textContent = field.value !== "" ? field.value : target.getAttribute("data-default");
            });
        });
    },
    jumpToNextField: function () {
        // Get the next field if exists and set focus, also select the content for a easier value override
        let fields = document.querySelectorAll("input");
        for (let i = 0; i < fields.length; i++) {
            if (document.activeElement.id === fields[i].id) {
                let nextField = fields[i + 1];

                if (nextField) {
                    nextField.focus();
                    nextField.select();
                }

                break;
            }
        }
    },
};
