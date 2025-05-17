document.addEventListener("DOMContentLoaded", function () {
    const newsList = document.getElementById("news-list");
    const newsInput = document.getElementById("news-input");
    const addNewsButton = document.getElementById("add-news");

    // Load saved news from localStorage
    loadNewsFromLocalStorage();

    // Add news item
    addNewsButton.addEventListener("click", function () {
        const newsText = newsInput.value.trim();
        if (newsText !== "") {
            addNewsItem(newsText);
            newsInput.value = "";
            saveNewsToLocalStorage();
        } else {
            alert("Please enter a valid news update!");
        }
    });

    // Allow Enter key to add news
    newsInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            addNewsButton.click();
        }
    });

    // Highlight current page in navbar
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Utility to add a news item with delete button
    function addNewsItem(text) {
        const li = document.createElement("li");
        li.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => {
            li.remove();
            saveNewsToLocalStorage();
        };

        li.appendChild(deleteBtn);
        newsList.appendChild(li);
    }

    // Save news list to localStorage
    function saveNewsToLocalStorage() {
        const items = [...newsList.children].map(li => li.childNodes[0].textContent.trim());
        localStorage.setItem("customNews", JSON.stringify(items));
    }

    // Load news list from localStorage
    function loadNewsFromLocalStorage() {
        const stored = JSON.parse(localStorage.getItem("customNews") || "[]");
        stored.forEach(text => {
            addNewsItem(text);
        });
    }
});
