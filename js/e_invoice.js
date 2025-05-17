// Set today's date as default
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('invoice-date').value = today;
            
            // Random invoice number
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            document.getElementById('invoice-number').value = `INV-${new Date().getFullYear()}${random}`;
        });

        // Add new row to items table
        function addRow() {
            const tbody = document.getElementById("item-rows");
            const rows = tbody.getElementsByTagName("tr");
            const newRow = rows[0].cloneNode(true);
            
            // Clear inputs and set new row number
            const inputs = newRow.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].name !== "qty[]") {
                    inputs[i].value = "";
                }
            }
            
            // Set row number
            newRow.cells[0].innerText = rows.length + 1;
            
            tbody.appendChild(newRow);
        }

        // Remove row
        function removeRow(button) {
            const tbody = document.getElementById("item-rows");
            if (tbody.rows.length > 1) {
                const row = button.parentNode.parentNode;
                tbody.removeChild(row);
                
                // Update row numbers
                const rows = tbody.getElementsByTagName("tr");
                for (let i = 0; i < rows.length; i++) {
                    rows[i].cells[0].innerText = i + 1;
                }
                
                // Recalculate totals
                calculateTotals();
            } else {
                alert("Cannot delete the only row!");
            }
        }

        // Calculate row total
        function calculateRowTotal(input) {
            const row = input.parentNode.parentNode;
            const qty = parseFloat(row.querySelector('input[name="qty[]"]').value) || 0;
            const price = parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
            const taxRate = parseFloat(row.querySelector('select[name="tax[]"]').value) || 0;
            
            const amount = qty * price * (1 + taxRate/100);
            row.querySelector('input[name="amount[]"]').value = amount.toFixed(2);
            
            calculateTotals();
        }

        // Calculate invoice totals
        function calculateTotals() {
            const rows = document.getElementById("item-rows").getElementsByTagName("tr");
            let subtotal = 0;
            let totalTax = 0;
            
            for (let i = 0; i < rows.length; i++) {
                const qty = parseFloat(rows[i].querySelector('input[name="qty[]"]').value) || 0;
                const price = parseFloat(rows[i].querySelector('input[name="price[]"]').value) || 0;
                const taxRate = parseFloat(rows[i].querySelector('select[name="tax[]"]').value) || 0;
                
                const rowSubtotal = qty * price;
                const rowTax = rowSubtotal * (taxRate/100);
                
                subtotal += rowSubtotal;
                totalTax += rowTax;
            }
            
            return {
                subtotal: subtotal,
                tax: totalTax,
                total: subtotal + totalTax
            };
        }

        // Generate full invoice preview
        function generateInvoice() {
            // Validate required fields
            if (!validateForm()) {
                return;
            }
            
            // Basic invoice details
            document.getElementById('preview-invoice-number').innerText = document.getElementById('invoice-number').value;
            document.getElementById('preview-invoice-date').innerText = formatDate(document.getElementById('invoice-date').value);
            document.getElementById('preview-due-date').innerText = document.getElementById('due-date').value ? formatDate(document.getElementById('due-date').value) : 'N/A';
            document.getElementById('preview-ack-date').innerText = formatDate(document.getElementById('invoice-date').value, true);
            
            // Seller details
            document.getElementById('preview-seller-name').innerText = document.getElementById('seller-name').value;
            document.getElementById('preview-seller-address').innerText = document.getElementById('seller-address').value;
            document.getElementById('preview-seller-gstin').innerText = document.getElementById('seller-gstin').value;
            
            const sellerStateSelect = document.getElementById('seller-state');
            document.getElementById('preview-seller-state-code').innerText = sellerStateSelect.value;
            document.getElementById('preview-seller-state-name').innerText = sellerStateSelect.options[sellerStateSelect.selectedIndex].text;
            
            // Buyer details
            document.getElementById('preview-buyer-name').innerText = document.getElementById('buyer-name').value;
            document.getElementById('preview-buyer-address').innerText = document.getElementById('buyer-address').value;
            document.getElementById('preview-buyer-gstin').innerText = document.getElementById('buyer-gstin').value;
            
            const buyerStateSelect = document.getElementById('buyer-state');
            document.getElementById('preview-buyer-state-code').innerText = buyerStateSelect.value;
            document.getElementById('preview-buyer-state-name').innerText = buyerStateSelect.options[buyerStateSelect.selectedIndex].text;
            
            // Notes
            document.getElementById('preview-notes').innerText = document.getElementById('notes').value;
            
            // Generate item rows
            const tbody = document.getElementById('preview-item-rows');
            tbody.innerHTML = '';
            const itemRows = document.getElementById('item-rows').getElementsByTagName('tr');
            
            let subtotal = 0;
            let totalTax = 0;
            
            for (let i = 0; i < itemRows.length; i++) {
                const row = itemRows[i];
                const desc = row.querySelector('input[name="item-desc[]"]').value;
                const hsn = row.querySelector('input[name="hsn[]"]').value;
                const qty = parseFloat(row.querySelector('input[name="qty[]"]').value) || 0;
                const unit = row.querySelector('select[name="unit[]"]').value;
                const price = parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
                const taxRate = parseFloat(row.querySelector('select[name="tax[]"]').value) || 0;
                
                const rowSubtotal = qty * price;
                const rowTax = rowSubtotal * (taxRate/100);
                const rowTotal = rowSubtotal + rowTax;
                
                subtotal += rowSubtotal;
                totalTax += rowTax;
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${i+1}</td>
                    <td>${desc}</td>
                    <td>${hsn}</td>
                    <td>${qty}</td>
                    <td>${unit}</td>
                    <td>₹${price.toFixed(2)}</td>
                    <td>₹${rowSubtotal.toFixed(2)}</td>
                    <td>${taxRate}%</td>
                    <td>₹${rowTax.toFixed(2)}</td>
                    <td>₹${rowTotal.toFixed(2)}</td>
                `;
                
                tbody.appendChild(newRow);
            }
            
            const total = subtotal + totalTax;
            
            // Handle Interstate vs Intrastate GST
            const sellerState = document.getElementById('seller-state').value;
            const buyerState = document.getElementById('buyer-state').value;
            
            let cgst = 0;
            let sgst = 0;
            let igst = 0;
            
            if (sellerState === buyerState) {
                // Intrastate: CGST and SGST
                cgst = totalTax / 2;
                sgst = totalTax / 2;
            } else {
                // Interstate: IGST
                igst = totalTax;
            }
            
            // Update totals
            document.getElementById('preview-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
            document.getElementById('preview-cgst').innerText = `₹${cgst.toFixed(2)}`;
            document.getElementById('preview-sgst').innerText = `₹${sgst.toFixed(2)}`;
            document.getElementById('preview-igst').innerText = `₹${igst.toFixed(2)}`;
            document.getElementById('preview-grand-total').innerText = `₹${total.toFixed(2)}`;
            
            // Amount in words
            document.getElementById('preview-amount-in-words').innerText = `${amountInWords(total)} Only`;
            
            // Show invoice preview
            document.getElementById('invoice-preview').style.display = 'block';
            
            // Scroll to preview
            document.getElementById('invoice-preview').scrollIntoView({ behavior: 'smooth' });
        }

        // Validate form
        function validateForm() {
            const form = document.getElementById('invoice-form');
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            let isValid = true;
            
            for (let input of inputs) {
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
                
                // Validate GSTIN format
                if (input.id === 'seller-gstin' || input.id === 'buyer-gstin') {
                    const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                    if (!pattern.test(input.value)) {
                        input.style.borderColor = 'red';
                        isValid = false;
                    }
                }
            }
            
            // Check item rows
            const itemRows = document.getElementById('item-rows').getElementsByTagName('tr');
            for (let i = 0; i < itemRows.length; i++) {
                const desc = itemRows[i].querySelector('input[name="item-desc[]"]').value;
                const hsn = itemRows[i].querySelector('input[name="hsn[]"]').value;
                const qty = itemRows[i].querySelector('input[name="qty[]"]').value;
                const price = itemRows[i].querySelector('input[name="price[]"]').value;
                
                if (!desc || !hsn || !qty || !price) {
                    isValid = false;
                    if (!desc) itemRows[i].querySelector('input[name="item-desc[]"]').style.borderColor = 'red';
                    if (!hsn) itemRows[i].querySelector('input[name="hsn[]"]').style.borderColor = 'red';
                    if (!qty) itemRows[i].querySelector('input[name="qty[]"]').style.borderColor = 'red';
                    if (!price) itemRows[i].querySelector('input[name="price[]"]').style.borderColor = 'red';
                }
            }
            
            if (!isValid) {
                alert('Please fill in all required fields correctly');
            }
            
            return isValid;
        }

        // Format date
        function formatDate(dateString, withTime = false) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            if (withTime) {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            }
            
            return `${day}/${month}/${year}`;
        }

        // Number to words conversion for Indian currency
        function amountInWords(num) {
            const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const bigUnit = ['', 'Thousand', 'Lakh', 'Crore'];
            
            const convertLessThanThousand = (number) => {
                let words = '';
                
                // Hundreds place
                if (number >= 100) {
                    words += single[Math.floor(number / 100)] + ' Hundred ';
                    number %= 100;
                    
                    if (number > 0) {
                        words += 'and ';
                    }
                }
                
                // Tens and ones place
                if (number >= 10 && number <= 19) {
                    words += double[number - 10] + ' ';
                } else if (number >= 20) {
                    words += tens[Math.floor(number / 10)] + ' ';
                    number %= 10;
                    
                    if (number > 0) {
                        words += single[number] + ' ';
                    }
                } else if (number > 0) {
                    words += single[number] + ' ';
                }
                
                return words;
            };
            
            // Handle zero
            if (num === 0) {
                return 'Zero Rupees';
            }
            
            // Split rupees and paise
            const rupees = Math.floor(num);
            const paise = Math.round((num - rupees) * 100);
            
            let words = '';
            
            // Process rupees
            if (rupees > 0) {
                // Indian numbering system: units, thousands, lakhs, and crores
                let rupeesWords = '';
                
                // Handle crores (10^7)
                if (rupees >= 10000000) {
                    const crores = Math.floor(rupees / 10000000);
                    rupeesWords += convertLessThanThousand(crores) + 'Crore ';
                    rupees %= 10000000;
                }
                
                // Handle lakhs (10^5)
                if (rupees >= 100000) {
                    const lakhs = Math.floor(rupees / 100000);
                    rupeesWords += convertLessThanThousand(lakhs) + 'Lakh ';
                    rupees %= 100000;
                }
                
                // Handle thousands
                if (rupees >= 1000) {
                    const thousands = Math.floor(rupees / 1000);
                    rupeesWords += convertLessThanThousand(thousands) + 'Thousand ';
                    rupees %= 1000;
                }
                
                // Handle remaining hundreds, tens, and ones
                if (rupees > 0) {
                    rupeesWords += convertLessThanThousand(rupees);
                }
                
                words = rupeesWords + 'Rupees';
            }
            
            // Process paise
            if (paise > 0) {
                words += ' and ' + convertLessThanThousand(paise) + 'Paise';
            }
            
            return words.trim();
        }

        // Download invoice as PDF
        function downloadInvoice() {
            // In a real implementation, this would use a PDF library
            // For demo, we'll use window.print() functionality
            alert('This would download the invoice as a PDF file in a real implementation. For demo purposes, we will use the Print dialog which can be saved as PDF.');
            printInvoice();
        }

        // Print invoice
        function printInvoice() {
            window.print();
        }