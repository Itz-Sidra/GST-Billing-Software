// Function to toggle the display of service details
function toggleServiceDetails(serviceItem) {
    const detail = serviceItem.querySelector('.service-detail');
    const isExpanded = serviceItem.classList.contains('active');

    detail.style.display = isExpanded ? 'none' : 'block';
    serviceItem.classList.toggle('active');
    serviceItem.setAttribute('aria-expanded', !isExpanded);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        // Mouse click support
        item.addEventListener('click', () => toggleServiceDetails(item));

        // Keyboard accessibility (Enter/Space key)
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // prevent scrolling on space
                toggleServiceDetails(item);
            }
        });
    });

    // Highlight current page link
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});
