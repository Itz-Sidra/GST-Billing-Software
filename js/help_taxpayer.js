document.addEventListener("DOMContentLoaded", function() {
    const faqTitles = document.querySelectorAll(".faq-title");

    faqTitles.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            const faqDetail = this.nextElementSibling;
            faqDetail.classList.toggle("show");
        });
    });
});


const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach(link => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});


