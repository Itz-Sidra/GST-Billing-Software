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
