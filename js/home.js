document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    answer.classList.toggle("hidden");
  });
});

const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

$(function () {
  // Bootstrap tooltip demo
  $('[data-bs-toggle="tooltip"]').tooltip();

  // jQuery: Animate news updates
  $("#news-list li").hover(
    function () {
      $(this).stop().animate({ paddingLeft: "20px" }, 200);
    },
    function () {
      $(this).stop().animate({ paddingLeft: "0" }, 200);
    }
  );
});
// Chart.js: Prevent chart glitch by initializing after DOM ready
document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sales (₹ in lakhs)",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });
});
