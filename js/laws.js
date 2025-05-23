document.addEventListener("DOMContentLoaded", () => {
  const lawTitles = document.querySelectorAll(".law-title");

  lawTitles.forEach((button) => {
    button.addEventListener("click", () => {
      const lawDetail = button.nextElementSibling;
      const isOpen = lawDetail.classList.toggle("open");
      button.classList.toggle("active", isOpen);
    });
  });

  // Highlight current page in nav
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav ul li a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

// jQuery Enhancement - Smooth fade-in animation for cards
$(document).ready(function () {
  $(".bootstrap-card").each(function (index) {
    $(this)
      .delay(200 * index)
      .queue(function () {
        $(this).addClass("fade-in").dequeue();
      });
  });

  // jQuery enhancement for law details with smooth toggle
  $(".law-title").click(function () {
    const detail = $(this).next(".law-detail");
    detail.slideToggle(300);
  });
});
