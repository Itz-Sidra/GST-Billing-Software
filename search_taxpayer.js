document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById("search-btn");
    const gstinInput = document.getElementById("gstin");
    const errorMsg = document.getElementById("error-msg");
    const resultContainer = document.getElementById("result");

    const taxpayerData = {
        "22AAAAA0000A1Z5": { name: "ABC Pvt Ltd", state: "Chhattisgarh", status: "Active" },
        "07BBBBB1111B2X3": { name: "XYZ Enterprises", state: "Delhi", status: "Suspended" },
        "27CCCCC2222C3Y7": { name: "LMN Traders", state: "Maharashtra", status: "Active" }
    };

    searchBtn.addEventListener("click", function() {
        const gstin = gstinInput.value.trim().toUpperCase();

        if (!/^[0-9A-Z]{15}$/.test(gstin)) {
            errorMsg.textContent = "Invalid GSTIN format! It should be 15 characters.";
            errorMsg.style.display = "block";
            resultContainer.style.display = "none";
            return;
        }

        if (taxpayerData[gstin]) {
            document.getElementById("taxpayer-name").textContent = taxpayerData[gstin].name;
            document.getElementById("taxpayer-gstin").textContent = gstin;
            document.getElementById("taxpayer-state").textContent = taxpayerData[gstin].state;
            document.getElementById("taxpayer-status").textContent = taxpayerData[gstin].status;

            resultContainer.style.display = "block";
            errorMsg.style.display = "none";
        } else {
            errorMsg.textContent = "Taxpayer not found. Please check the GSTIN.";
            errorMsg.style.display = "block";
            resultContainer.style.display = "none";
        }
    });
});
