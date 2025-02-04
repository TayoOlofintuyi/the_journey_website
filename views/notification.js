/*
Creating a centralized notification system for the website.
*/

function showPopup(message, type) {
    const container = document.getElementById("notification-container");

    // Create a new popup element
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // Style the popup based on the type (error, success, etc.)
    if (type === 'error') {
        popup.style.backgroundColor = '#f44336';  // Red for errors
    } else if (type === 'success') {
        popup.style.backgroundColor = '#4CAF50';  // Green for success
    } else {
        popup.style.backgroundColor = '#2196F3';  // Blue for general messages
    }

    // Add message to popup
    popup.textContent = message;

    // Append the popup to the container
    container.appendChild(popup);

    // Automatically hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.add("hide");
        setTimeout(() => {
            container.removeChild(popup);
        }, 500); // Wait for fade-out transition before removing from DOM
    }, 3000);
}
