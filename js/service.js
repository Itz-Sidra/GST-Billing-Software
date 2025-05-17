
// Function to toggle the display of service details
function toggleServiceDetails(serviceItem) {
    // Get the child element with the class 'service-detail'
    const detail = serviceItem.querySelector('.service-detail');
    
    // Toggle the display property
    if (detail.style.display === 'block') {
        detail.style.display = 'none';
    } else {
        detail.style.display = 'block';
    }
}

// Optional: Initialize event listeners if you want to attach them programmatically
document.addEventListener('DOMContentLoaded', () => {
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleServiceDetails(this);
        });
    });
});