const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

$(document).ready(function () {
  // Enhanced search functionality with jQuery
  $("#searchInput").on("keyup", function () {
    filterDownloads();
  });

  // Add download tracking
  $(".download-link").on("click", function (e) {
    const fileName = $(this).find(".file-info h5").text();
    console.log("Downloaded: " + fileName);

    // Show success message
    showToast("Download started: " + fileName, "success");
  });

  // Add hover effects
  $(".download-item").hover(
    function () {
      $(this).addClass("shadow-lg");
    },
    function () {
      $(this).removeClass("shadow-lg");
    }
  );
});

function filterDownloads() {
  const searchTerm = $("#searchInput").val().toLowerCase();
  const downloadItems = $(".download-item");
  let visibleCount = 0;

  downloadItems.each(function () {
    const fileName = $(this).data("filename").toLowerCase();
    const fileDescription = $(this).find(".file-info p").text().toLowerCase();

    if (fileName.includes(searchTerm) || fileDescription.includes(searchTerm)) {
      $(this).show().addClass("fade-in");
      visibleCount++;
    } else {
      $(this).hide().removeClass("fade-in");
    }
  });

  // Show/hide no results message
  if (visibleCount === 0 && searchTerm !== "") {
    $("#noResults").show();
  } else {
    $("#noResults").hide();
  }
}

function showToast(message, type = "info") {
  // Create toast notification
  const toastHtml = `
                <div class="toast align-items-center text-white bg-${
                  type === "success" ? "success" : "primary"
                } border-0" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fas fa-${
                              type === "success"
                                ? "check-circle"
                                : "info-circle"
                            } me-2"></i>
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

// Add some CSS animations
const style = document.createElement("style");
style.textContent = `
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .toast {
                animation: slideInRight 0.3s ease-out;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
document.head.appendChild(style);
