export const EXTRAS = {
    maxLength: function (field, maxLength) {
        field.addEventListener("input", () => {
            field.value = field.value.slice(0, maxLength);

            if (field.value.length >= maxLength) {
                EXTRAS.jumpToNextField();
            }
        });
    },
    twoDigitMonth: function (field) {
        field.addEventListener("input", () => {
            field.value = field.value.replace(/^([1-9]\/|[2-9])$/g, "0$1"); // 2-9 -> 02-09
        });
    },
    completeTwoDigit: function (field) {
        field.addEventListener("blur", () => {
            field.value = field.value.replace(/^([1-9]\/|[1-9])$/g, "0$1"); // 1-9 -> 01-09
            field.dispatchEvent(new Event("change"));
        });
    },
    cardNumberMask: function (field) {
        field.addEventListener("input", () => {
            let maxLength = 16;
            let currentValue = field.value.replace(/ /g, "");
            let modifiedValue = "";

            for (let i = 0; i < currentValue.length && i < maxLength; i++) {
                if (i % 4 === 0 && i !== 0) {
                    modifiedValue += " ";
                }
                modifiedValue += currentValue[i];
            }

            field.value = modifiedValue;

            if (currentValue.length >= maxLength) {
                EXTRAS.jumpToNextField();
            }
        });
    },
    mirrorValue: function (field) {
        let targetSelector = field.getAttribute("data-mirror");
        let target = document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        target.setAttribute("data-default", target.textContent);

        ["input", "change"].forEach((event) => {
            field.addEventListener(event, () => {
                target.textContent = field.value !== "" ? field.value : target.getAttribute("data-default");
            });
        });
    },
    jumpToNextField: function () {
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
