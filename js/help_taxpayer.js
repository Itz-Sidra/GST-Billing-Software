document.addEventListener("DOMContentLoaded", function() {
    const faqTitles = document.querySelectorAll(".faq-title");

    faqTitles.forEach(button => {
        button.addEventListener("click", function() {
            const faqDetail = this.nextElementSibling;
            if (faqDetail.style.display === "block") {
                faqDetail.style.display = "none";
            } else {
                faqDetail.style.display = "block";
            }
        });
    });
});

