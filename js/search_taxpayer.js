const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

const taxpayerDatabase = {
  "29ABCDE1234F1Z5": {
    name: "ABC Pvt Ltd",
    gstin: "29ABCDE1234F1Z5",
    state: "Karnataka",
    status: "Active",
    type: "Private Limited Company",
    date: "15-July-2017",
  },
  "27AABCU9603R1ZX": {
    name: "XYZ Enterprises",
    gstin: "27AABCU9603R1ZX",
    state: "Maharashtra",
    status: "Active",
    type: "Partnership Firm",
    date: "22-August-2017",
  },
  "07AADCS2781A1ZF": {
    name: "DEF Industries",
    gstin: "07AADCS2781A1ZF",
    state: "Delhi",
    status: "Suspended",
    type: "Sole Proprietorship",
    date: "10-September-2017",
  },
  "33AABCG1234P1Z9": {
    name: "GHI Limited",
    gstin: "33AABCG1234P1Z9",
    state: "Tamil Nadu",
    status: "Inactive",
    type: "Public Limited Company",
    date: "05-October-2017",
  },
};

let recentSearches = [];

$(document).ready(function () {
  // Load recent searches from memory
  loadRecentSearches();

  // GSTIN input formatting and validation
  $("#gstin").on("input", function () {
    let value = $(this).val().toUpperCase();
    $(this).val(value);

    // Real-time validation
    if (value.length > 0) {
      validateGSTIN(value, false);
    }
  });

  // Search button click event
  $("#search-btn").on("click", function () {
    searchTaxpayer();
  });

  // Enter key press event
  $("#gstin").on("keypress", function (e) {
    if (e.which === 13) {
      searchTaxpayer();
    }
  });

  // Recent search item click
  $(document).on("click", ".recent-item", function () {
    const gstin = $(this).data("gstin");
    $("#gstin").val(gstin);
    searchTaxpayer();
  });
});

function validateGSTIN(gstin, showError = true) {
  // Basic GSTIN format validation
  const gstinPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

  if (gstin.length === 0) {
    hideError();
    return false;
  }

  if (gstin.length !== 15) {
    if (showError) showError("GSTIN must be exactly 15 characters long");
    return false;
  }

  if (!gstinPattern.test(gstin)) {
    if (showError)
      showError("Invalid GSTIN format. Please check and try again.");
    return false;
  }

  hideError();
  return true;
}

function searchTaxpayer() {
  const gstin = $("#gstin").val().trim();

  if (!gstin) {
    showError("Please enter a GSTIN to search");
    $("#gstin").focus();
    return;
  }

  if (!validateGSTIN(gstin)) {
    return;
  }

  // Show loading
  showLoading();

  // Simulate API call delay
  setTimeout(() => {
    const taxpayerData = taxpayerDatabase[gstin];

    if (taxpayerData) {
      displayTaxpayerInfo(taxpayerData);
      addToRecentSearches(gstin);
      showSuccess("Taxpayer information found successfully!");
    } else {
      showError(
        "No taxpayer found with this GSTIN. Please verify the GSTIN and try again."
      );
    }

    hideLoading();
  }, 1500);
}

function displayTaxpayerInfo(data) {
  $("#taxpayer-name").text(data.name);
  $("#taxpayer-gstin").text(data.gstin);
  $("#taxpayer-state").text(data.state);
  $("#taxpayer-type").text(data.type);
  $("#taxpayer-date").text(data.date);

  // Set status with appropriate styling
  const statusElement = $("#taxpayer-status");
  statusElement.text(data.status);
  statusElement.removeClass("status-active status-inactive status-suspended");

  switch (data.status.toLowerCase()) {
    case "active":
      statusElement.addClass("status-active");
      break;
    case "inactive":
      statusElement.addClass("status-inactive");
      break;
    case "suspended":
      statusElement.addClass("status-suspended");
      break;
  }

  // Show result with animation
  $("#result").show().addClass("show");

  // Scroll to result
  $("html, body").animate(
    {
      scrollTop: $("#result").offset().top - 100,
    },
    800
  );
}

function addToRecentSearches(gstin) {
  const taxpayerData = taxpayerDatabase[gstin];
  if (!taxpayerData) return;

  // Remove if already exists
  recentSearches = recentSearches.filter((item) => item.gstin !== gstin);

  // Add to beginning
  recentSearches.unshift({
    gstin: gstin,
    name: taxpayerData.name,
    searchDate: new Date().toLocaleDateString(),
  });

  // Keep only last 5 searches
  recentSearches = recentSearches.slice(0, 5);

  updateRecentSearchesDisplay();
}

function updateRecentSearchesDisplay() {
  if (recentSearches.length === 0) {
    $("#recent-searches").hide();
    return;
  }

  let html = "";
  recentSearches.forEach((item) => {
    html += `
                    <div class="recent-item" data-gstin="${item.gstin}">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${item.name}</strong><br>
                                <small class="text-muted">${item.gstin}</small>
                            </div>
                            <small class="text-muted">${item.searchDate}</small>
                        </div>
                    </div>
                `;
  });

  $("#recent-list").html(html);
  $("#recent-searches").show();
}

function loadRecentSearches() {
  // In a real application, you would load from localStorage or a server
  // For demo purposes, we'll start with an empty array
  updateRecentSearchesDisplay();
}

function showError(message) {
  $("#error-msg").text(message);
  $("#error-alert").fadeIn();

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  $("#error-alert").fadeOut();
}

function showSuccess(message) {
  // Create success toast
  const toastHtml = `
                <div class="toast align-items-center text-white bg-success border-0" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fas fa-check-circle me-2"></i>
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

  $("body").append(toastHtml);
  const toast = new bootstrap.Toast($(".toast").last()[0]);
  toast.show();

  // Remove toast after it's hidden
  $(".toast")
    .last()
    .on("hidden.bs.toast", function () {
      $(this).remove();
    });
}

function showLoading() {
  $("#loading-overlay").fadeIn();
  $("#search-btn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm me-2"></span>Searching...'
    );
}

function hideLoading() {
  $("#loading-overlay").fadeOut();
  $("#search-btn")
    .prop("disabled", false)
    .html('<i class="fas fa-search me-2"></i>Search Taxpayer');
}
