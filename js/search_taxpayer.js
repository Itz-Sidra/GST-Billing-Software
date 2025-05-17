document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const gstinInput = document.getElementById("gstin");
    const errorMsg = document.getElementById("error-msg");
    const resultContainer = document.getElementById("result");

    const nameField = document.getElementById("taxpayer-name");
    const gstinField = document.getElementById("taxpayer-gstin");
    const stateField = document.getElementById("taxpayer-state");
    const statusField = document.getElementById("taxpayer-status");

    // ✅ Expanded hardcoded taxpayer data
    const taxpayerData = {
        "22AAAAA0000A1Z5": { name: "ABC Pvt Ltd", state: "Chhattisgarh", status: "Active" },
        "07BBBBB1111B2X3": { name: "XYZ Enterprises", state: "Delhi", status: "Suspended" },
        "27CCCCC2222C3Y7": { name: "LMN Traders", state: "Maharashtra", status: "Active" },
        "09DDDDD3333D4Z2": { name: "Ram & Sons", state: "Uttar Pradesh", status: "Cancelled" },
        "19EEEEE4444E5P9": { name: "Sunrise Retail", state: "West Bengal", status: "Active" },
        "24FFFFF5555F6X1": { name: "Mehta Electronics", state: "Gujarat", status: "Suspended" },
        "32GGGGG6666G7L3": { name: "Kerala Spices Co.", state: "Kerala", status: "Active" },
        "29HHHHH7777H8T5": { name: "Karnataka Textiles", state: "Karnataka", status: "Active" },
        "36IIIII8888I9M8": { name: "Hyderabad Steel Works", state: "Telangana", status: "Cancelled" },
        "33JJJJJ9999J0U6": { name: "Chennai Builders", state: "Tamil Nadu", status: "Active" }
    };

    function isValidGSTIN(gstin) {
        return /^[0-9A-Z]{15}$/.test(gstin);
    }

    function showTaxpayerData(gstin, data) {
        nameField.textContent = data.name;
        gstinField.textContent = gstin;
        stateField.textContent = data.state;
        statusField.textContent = data.status;

        resultContainer.style.display = "block";
        errorMsg.style.display = "none";
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = "block";
        resultContainer.style.display = "none";
    }

    function handleSearch() {
        const gstin = gstinInput.value.trim().toUpperCase();

        if (!isValidGSTIN(gstin)) {
            showError("Invalid GSTIN format! It should be exactly 15 characters (alphanumeric).");
            return;
        }

        if (taxpayerData[gstin]) {
            showTaxpayerData(gstin, taxpayerData[gstin]);
        } else {
            showError("Taxpayer not found. Please verify the GSTIN.");
        }
    }

    searchBtn.addEventListener("click", handleSearch);

    gstinInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});
