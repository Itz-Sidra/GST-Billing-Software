document.addEventListener("DOMContentLoaded", function() {
    const lawTitles = document.querySelectorAll(".law-title");

    lawTitles.forEach(button => {
        button.addEventListener("click", function() {
            const lawDetail = this.nextElementSibling;
            if (lawDetail.style.display === "block") {
                lawDetail.style.display = "none";
            } else {
                lawDetail.style.display = "block";
            }
        });
    });
});
