document.addEventListener("DOMContentLoaded", function () {
    // Chart.js Sales Chart
    let ctx = document.getElementById("salesChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [
                {
                    label: "Sales ($)",
                    data: [10000, 15000, 20000, 25000, 30000],
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.classList.toggle('hidden');
    });
});
