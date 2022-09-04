export const RESTRICTIONS = {
    maxLength: function (field, maxLength) {
        field.addEventListener("input", () => {
            field.value = field.value.slice(0, maxLength);
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
        });
    },
};
