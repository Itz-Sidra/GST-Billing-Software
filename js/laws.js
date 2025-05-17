document.addEventListener("DOMContentLoaded", () => {
    const lawTitles = document.querySelectorAll(".law-title");

    lawTitles.forEach(button => {
        button.addEventListener("click", () => {
            const lawDetail = button.nextElementSibling;
            const isOpen = lawDetail.classList.toggle("open");
            button.classList.toggle("active", isOpen);
        });
    });

    // Highlight current page in nav
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});

document.querySelectorAll('.law-title').forEach(button => {
    button.addEventListener('click', () => {
        const detail = button.nextElementSibling;
        button.classList.toggle('active');
        detail.classList.toggle('open');
    });
});
