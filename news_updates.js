document.addEventListener("DOMContentLoaded", function() {
    const newsList = document.getElementById("news-list");
    const newsInput = document.getElementById("news-input");
    const addNewsButton = document.getElementById("add-news");

    addNewsButton.addEventListener("click", function() {
        const newsText = newsInput.value.trim();
        if (newsText !== "") {
            const newListItem = document.createElement("li");
            newListItem.textContent = newsText;
            newsList.appendChild(newListItem);
            newsInput.value = "";
        } else {
            alert("Please enter a valid news update!");
        }
    });
});
