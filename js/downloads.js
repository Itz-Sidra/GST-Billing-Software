document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchInput").addEventListener("keyup", filterDownloads);
});

function filterDownloads() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let items = document.querySelectorAll("#downloadList li");

    items.forEach(item => {
        let text = item.textContent.toLowerCase();
        if (text.includes(input)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach(link => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

