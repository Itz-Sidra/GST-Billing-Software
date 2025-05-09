function calculateInvoice() {
    // Get input values
    const itemName = document.getElementById("item-name").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);
    const gstRate = parseFloat(document.getElementById("gst-rate").value);

    // Check for valid input
    if (!itemName || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
        alert("Please enter valid details.");
        return;
    }

    // Calculate GST and total price
    const totalPrice = quantity * price;
    const gstAmount = (totalPrice * gstRate) / 100;
    const totalWithGST = totalPrice + gstAmount;

    // Display results
    document.getElementById("result-item").innerText = itemName;
    document.getElementById("result-quantity").innerText = quantity;
    document.getElementById("result-price").innerText = price.toFixed(2);
    document.getElementById("result-gst").innerText = gstAmount.toFixed(2);
    document.getElementById("result-total").innerText = totalWithGST.toFixed(2);

    document.getElementById("invoice-result").style.display = "block";
}
