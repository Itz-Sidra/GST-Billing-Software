// Enhanced E-Invoice validation system with real-time validation

// Set today's date as default and initialize validation
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  const invoiceDateField = document.getElementById("invoice-date");
  const dueDateField = document.getElementById("due-date");
  
  // Set today's date and max date
  invoiceDateField.value = today;
  invoiceDateField.max = today;
  
  // Generate random invoice number with validation
  generateInvoiceNumber();
  
  // Initialize all validation listeners
  initializeValidation();

  // jQuery Features - Enhanced field interactions
  $(document).ready(function() {
    // Feature 1: Smooth field highlighting with enhanced animations
    $('input, select, textarea').focus(function() {
      $(this).addClass('focused').animate({
        boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6'
      }, 300).parent().addClass('field-focused');
    }).blur(function() {
      $(this).removeClass('focused').parent().removeClass('field-focused');
      if (!$(this).hasClass('error')) {
        $(this).animate({
          boxShadow: 'none',
          borderColor: '#d1d5db'
        }, 300);
      }
    });

    // Feature 2: jQuery-based form field counter and progress indicator
    initializeFieldProgress();

    // Feature 3: Enhanced tooltips with jQuery
    initializeTooltips();

    // Feature 4: Auto-save functionality with jQuery
    initializeAutoSave();

    // Feature 5: Dynamic field dependencies with jQuery
    initializeFieldDependencies();
  });
});

// jQuery Feature 2: Form Progress Indicator
function initializeFieldProgress() {
  // Create progress bar if it doesn't exist
  if ($('#form-progress').length === 0) {
    $('form').prepend(`
      <div id="form-progress" style="
        background: #f3f4f6; 
        height: 6px; 
        border-radius: 3px; 
        margin-bottom: 20px; 
        overflow: hidden;
      ">
        <div id="progress-bar" style="
          height: 100%; 
          background: linear-gradient(90deg, #3b82f6, #10b981); 
          width: 0%; 
          transition: width 0.5s ease;
        "></div>
      </div>
      <div id="field-counter" style="
        text-align: center; 
        color: #6b7280; 
        margin-bottom: 15px; 
        font-size: 14px;
      ">
        Form Completion: <span id="completion-text">0%</span>
      </div>
    `);
  }

  // Track form completion with jQuery
  function updateProgress() {
    const totalFields = $('input[required], select[required], textarea[required]').length;
    const filledFields = $('input[required], select[required], textarea[required]').filter(function() {
      return $(this).val() !== '';
    }).length;
    
    const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    
    $('#progress-bar').animate({ width: percentage + '%' }, 500);
    $('#completion-text').text(percentage + '%');
    
    // Change color based on completion
    if (percentage >= 100) {
      $('#progress-bar').css('background', 'linear-gradient(90deg, #10b981, #059669)');
    } else if (percentage >= 50) {
      $('#progress-bar').css('background', 'linear-gradient(90deg, #f59e0b, #10b981)');
    } else {
      $('#progress-bar').css('background', 'linear-gradient(90deg, #ef4444, #f59e0b)');
    }
  }

  // Update progress on field changes
  $('input, select, textarea').on('input change', updateProgress);
  updateProgress(); // Initial update
}

// jQuery Feature 3: Enhanced Tooltips
function initializeTooltips() {
  // Add tooltips to form fields
  const tooltips = {
    'invoice-number': 'Format: INV-YYYY#### (e.g., INV-20241234)',
    'seller-gstin': '15-character GSTIN format required',
    'buyer-gstin': '15-character GSTIN format required',
    'seller-name': 'Business name cannot contain numbers',
    'buyer-name': 'Business name cannot contain numbers'
  };

  $.each(tooltips, function(fieldId, tooltipText) {
    const $field = $('#' + fieldId);
    if ($field.length) {
      $field.attr('title', tooltipText)
            .hover(
              function() {
                const $tooltip = $('<div class="custom-tooltip">')
                  .text(tooltipText)
                  .css({
                    position: 'absolute',
                    background: '#1f2937',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    zIndex: 10000,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  });
                
                $('body').append($tooltip);
                
                const fieldOffset = $(this).offset();
                $tooltip.css({
                  top: fieldOffset.top - $tooltip.outerHeight() - 10,
                  left: fieldOffset.left
                }).fadeIn(200);
              },
              function() {
                $('.custom-tooltip').fadeOut(200, function() {
                  $(this).remove();
                });
              }
            );
    }
  });
}

// jQuery Feature 4: Auto-save functionality
function initializeAutoSave() {
  let autoSaveTimer;
  const autoSaveData = {};

  function saveFormData() {
    $('input, select, textarea').each(function() {
      const $field = $(this);
      const fieldName = $field.attr('name') || $field.attr('id');
      if (fieldName) {
        autoSaveData[fieldName] = $field.val();
      }
    });
    
    // Show auto-save indicator
    showAutoSaveIndicator();
  }

  function showAutoSaveIndicator() {
    // Remove existing indicator
    $('.auto-save-indicator').remove();
    
    // Add new indicator
    const $indicator = $('<div class="auto-save-indicator">')
      .text('✓ Auto-saved')
      .css({
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#10b981',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 10000
      })
      .hide()
      .fadeIn(300);
    
    $('body').append($indicator);
    
    setTimeout(() => {
      $indicator.fadeOut(300, function() {
        $(this).remove();
      });
    }, 2000);
  }

  // Auto-save on field changes
  $('input, select, textarea').on('input change', function() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveFormData, 2000); // Save after 2 seconds of inactivity
  });
}

// jQuery Feature 5: Dynamic Field Dependencies
function initializeFieldDependencies() {
  // State-based PIN code suggestions (mock data)
  const statePinCodes = {
    '01': ['110001', '110002', '110003'], // Delhi
    '02': ['400001', '400002', '400003'], // Maharashtra
    '03': ['700001', '700002', '700003']  // West Bengal
  };

  // Update PIN suggestions based on state selection
  $('#seller-state, #buyer-state').change(function() {
    const stateCode = $(this).val();
    const targetType = $(this).attr('id').includes('seller') ? 'seller' : 'buyer';
    const $pinField = $(`input[name="${targetType}-pin"], input[id="${targetType}-pin"]`);
    
    if (stateCode && statePinCodes[stateCode] && $pinField.length) {
      // Create suggestion dropdown
      $('.pin-suggestions').remove();
      
      const $suggestions = $('<div class="pin-suggestions">')
        .css({
          position: 'absolute',
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '120px',
          overflowY: 'auto'
        });
      
      statePinCodes[stateCode].forEach(pin => {
        const $option = $('<div>')
          .text(pin)
          .css({
            padding: '8px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid #f3f4f6'
          })
          .hover(
            function() { $(this).css('background', '#f3f4f6'); },
            function() { $(this).css('background', 'white'); }
          )
          .click(function() {
            $pinField.val(pin).trigger('input');
            $suggestions.fadeOut(200, function() { $(this).remove(); });
          });
        
        $suggestions.append($option);
      });
      
      // Position suggestions below the PIN field
      const pinOffset = $pinField.offset();
      $suggestions.css({
        top: pinOffset.top + $pinField.outerHeight() + 5,
        left: pinOffset.left,
        width: $pinField.outerWidth()
      });
      
      $('body').append($suggestions.hide().fadeIn(200));
      
      // Hide suggestions when clicking elsewhere
      $(document).one('click', function(e) {
        if (!$(e.target).closest('.pin-suggestions, input').length) {
          $suggestions.fadeOut(200, function() { $(this).remove(); });
        }
      });
    }
  });
}

// Generate unique invoice number with format validation
function generateInvoiceNumber() {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const invoiceNumber = `INV-${new Date().getFullYear()}${random}`;
  document.getElementById("invoice-number").value = invoiceNumber;
}

// Initialize all validation event listeners
function initializeValidation() {
  // Invoice number validation
  setupInvoiceNumberValidation();
  
  // Date validations
  setupDateValidation();
  
  // Business name validations
  setupBusinessNameValidation();
  
  // GSTIN validations
  setupGSTINValidation();
  
  // PIN code validations
  setupPINValidation();
  
  // Phone number validations
  setupPhoneValidation();
  
  // Item validations
  setupItemValidation();
  
  // Cross-field validations
  setupCrossFieldValidation();
}

// Invoice Number Validation
function setupInvoiceNumberValidation() {
  const invoiceNumberField = document.getElementById("invoice-number");
  
  invoiceNumberField.addEventListener('input', function(e) {
    const value = e.target.value.trim();
    const pattern = /^INV-\d{8}$/;
    
    if (!value) {
      showError(e.target, "Invoice number is required");
    } else if (!pattern.test(value)) {
      showError(e.target, "Invalid format. Use: INV-YYYYNNNN (e.g., INV-20241234)");
    } else {
      clearError(e.target);
    }
  });
  
  invoiceNumberField.addEventListener('blur', function(e) {
    if (!e.target.value.trim()) {
      e.target.value = generateInvoiceNumber();
    }
  });
}

// Date Validation Setup
function setupDateValidation() {
  const invoiceDateField = document.getElementById("invoice-date");
  const dueDateField = document.getElementById("due-date");
  
  invoiceDateField.addEventListener('input', function(e) {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      showError(e.target, "Invoice date cannot be in the future");
      e.target.value = new Date().toISOString().split("T")[0];
    } else {
      clearError(e.target);
      // Update due date minimum
      dueDateField.min = e.target.value;
      validateDueDate();
    }
  });
  
  dueDateField.addEventListener('input', validateDueDate);
  
  function validateDueDate() {
    const invoiceDate = new Date(invoiceDateField.value);
    const dueDate = new Date(dueDateField.value);
    
    if (dueDateField.value && dueDate < invoiceDate) {
      showError(dueDateField, "Due date cannot be before invoice date");
    } else {
      clearError(dueDateField);
    }
  }
}

// Business Name Validation (No numbers allowed)
function setupBusinessNameValidation() {
  const businessNameFields = [
    document.getElementById("seller-name"),
    document.getElementById("buyer-name")
  ];
  
  businessNameFields.forEach(field => {
    if (!field) return;
    
    field.addEventListener('input', function(e) {
      // Remove numbers and special characters except spaces, hyphens, and dots
      const cleaned = e.target.value.replace(/[0-9]/g, '');
      if (cleaned !== e.target.value) {
        e.target.value = cleaned;
        showError(e.target, "Business names cannot contain numbers");
        setTimeout(() => clearError(e.target), 2000);
      }
    });
    
    field.addEventListener('keypress', function(e) {
      if (/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
        showError(e.target, "Numbers not allowed in business names");
        setTimeout(() => clearError(e.target), 2000);
      }
    });
    
    field.addEventListener('blur', function(e) {
      if (!e.target.value.trim()) {
        showError(e.target, "Business name is required");
      } else if (e.target.value.trim().length < 2) {
        showError(e.target, "Business name must be at least 2 characters");
      } else {
        clearError(e.target);
      }
    });
  });
}

// Simplified GSTIN Pattern Validation
function setupGSTINValidation() {
  const gstinFields = [
    document.getElementById("seller-gstin"),
    document.getElementById("buyer-gstin")
  ];
  
  gstinFields.forEach(field => {
    if (!field) return;
    
    field.addEventListener('input', function(e) {
      // Remove spaces and convert to uppercase
      let value = e.target.value.replace(/\s/g, '').toUpperCase();
      e.target.value = value;
      
      if (value.length === 0) {
        showError(e.target, "GSTIN is required");
        return;
      }
      
      if (value.length > 15) {
        e.target.value = value.substring(0, 15);
        value = e.target.value;
      }
      
      if (value.length !== 15) {
        showError(e.target, "GSTIN must be exactly 15 characters");
        return;
      }
      
      clearError(e.target);
    });
    
    field.addEventListener('keypress', function(e) {
      const value = e.target.value;
      const position = e.target.selectionStart;
      
      // Prevent spaces
      if (e.key === ' ') {
        e.preventDefault();
        return;
      }
      
      // Only allow valid characters based on position
      if (!isValidGSTINChar(e.key, position)) {
        e.preventDefault();
      }
    });
  });
}

// PIN Code Validation
function setupPINValidation() {
  const pinFields = document.querySelectorAll('input[name*="pin"], input[id*="pin"]');
  
  pinFields.forEach(field => {
    field.addEventListener('input', function(e) {
      // Only allow digits
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 6 digits
      if (value.length > 6) {
        value = value.substring(0, 6);
      }
      
      e.target.value = value;
      
      if (value.length === 0) {
        showError(e.target, "PIN code is required");
      } else if (value.length !== 6) {
        showError(e.target, "PIN code must be exactly 6 digits");
      } else if (value.startsWith('0')) {
        showError(e.target, "PIN code cannot start with 0");
      } else {
        clearError(e.target);
      }
    });
    
    field.addEventListener('keypress', function(e) {
      if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

// Phone Number Validation
function setupPhoneValidation() {
  const phoneFields = document.querySelectorAll('input[name*="phone"], input[id*="phone"], input[type="tel"]');
  
  phoneFields.forEach(field => {
    field.addEventListener('input', function(e) {
      // Only allow digits
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 10 digits
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
      
      e.target.value = value;
      
      if (value.length === 0) {
        showError(e.target, "Phone number is required");
      } else if (value.length !== 10) {
        showError(e.target, "Phone number must be exactly 10 digits");
      } else {
        clearError(e.target);
      }
    });
    
    field.addEventListener('keypress', function(e) {
      if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

// Item Validation Setup
function setupItemValidation() {
  // This will be called for existing rows and new rows
  validateAllItemRows();
}

function validateAllItemRows() {
  const itemRows = document.getElementById("item-rows").getElementsByTagName("tr");
  
  for (let i = 0; i < itemRows.length; i++) {
    setupItemRowValidation(itemRows[i]);
  }
}

function setupItemRowValidation(row) {
  const descField = row.querySelector('input[name="item-desc[]"]');
  const hsnField = row.querySelector('input[name="hsn[]"]');
  const qtyField = row.querySelector('input[name="qty[]"]');
  const priceField = row.querySelector('input[name="price[]"]');
  
  // Description validation
  if (descField) {
    descField.addEventListener('blur', function(e) {
      if (!e.target.value.trim()) {
        showError(e.target, "Item description is required");
      } else if (e.target.value.trim().length < 3) {
        showError(e.target, "Description must be at least 3 characters");
      } else {
        clearError(e.target);
      }
    });
  }
  
  // HSN/SAC validation
  if (hsnField) {
    hsnField.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value = value;
      
      if (value.length === 0) {
        showError(e.target, "HSN/SAC code is required");
      } else if (value.length < 4 || value.length > 8) {
        showError(e.target, "HSN/SAC must be 4-8 digits");
      } else {
        clearError(e.target);
      }
    });
    
    hsnField.addEventListener('keypress', function(e) {
      if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }
  
  // Quantity validation
  if (qtyField) {
    qtyField.addEventListener('input', function(e) {
      let value = e.target.value;
      
      // Allow only numbers and one decimal point
      if (!/^\d*\.?\d*$/.test(value)) {
        e.target.value = value.slice(0, -1);
        return;
      }
      
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue <= 0)) {
        showError(e.target, "Quantity must be greater than 0");
      } else if (value && numValue > 0) {
        clearError(e.target);
        calculateRowTotal(e.target);
      }
    });
  }
  
  // Price validation
  if (priceField) {
    priceField.addEventListener('input', function(e) {
      let value = e.target.value;
      
      // Allow only numbers and one decimal point
      if (!/^\d*\.?\d*$/.test(value)) {
        e.target.value = value.slice(0, -1);
        return;
      }
      
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue < 0)) {
        showError(e.target, "Price cannot be negative");
      } else if (value && numValue >= 0) {
        clearError(e.target);
        calculateRowTotal(e.target);
      }
    });
  }
}

// Cross-field Validation
function setupCrossFieldValidation() {
  const sellerGSTIN = document.getElementById("seller-gstin");
  const buyerGSTIN = document.getElementById("buyer-gstin");
  
  function validateDifferentGSTIN() {
    if (sellerGSTIN.value && buyerGSTIN.value && sellerGSTIN.value === buyerGSTIN.value) {
      showError(buyerGSTIN, "Buyer GSTIN must be different from Seller GSTIN");
      return false;
    } else {
      clearError(buyerGSTIN);
      return true;
    }
  }
  
  sellerGSTIN.addEventListener('blur', validateDifferentGSTIN);
  buyerGSTIN.addEventListener('blur', validateDifferentGSTIN);
}

// Error Display Functions
function showError(element, message) {
  clearError(element);
  
  element.style.borderColor = "#ef4444";
  element.style.backgroundColor = "#fef2f2";
  
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.cssText = `
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
    display: block;
    animation: fadeIn 0.3s ease-in;
  `;
  errorDiv.textContent = message;
  
  element.parentNode.appendChild(errorDiv);
  
  // Add fadeIn animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  if (!document.head.querySelector('style[data-validation]')) {
    style.setAttribute('data-validation', 'true');
    document.head.appendChild(style);
  }
}

function clearError(element) {
  element.style.borderColor = "";
  element.style.backgroundColor = "";
  
  const errorMessage = element.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Enhanced Add Row Function
function addRow() {
  const tbody = document.getElementById("item-rows");
  const rows = tbody.getElementsByTagName("tr");
  const newRow = rows[0].cloneNode(true);

  // Clear inputs and set new row number
  const inputs = newRow.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
    clearError(inputs[i]);
  }

  // Set row number
  newRow.cells[0].innerText = rows.length + 1;

  tbody.appendChild(newRow);
  
  // Setup validation for new row
  setupItemRowValidation(newRow);
  
  // Focus on first input of new row
  const firstInput = newRow.querySelector('input[name="item-desc[]"]');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

// Enhanced Remove Row Function
function removeRow(button) {
  const tbody = document.getElementById("item-rows");
  if (tbody.rows.length > 1) {
    const row = button.parentNode.parentNode;
    
    // Add fade out animation
    row.style.animation = "fadeOut 0.3s ease-out";
    
    setTimeout(() => {
      tbody.removeChild(row);

      // Update row numbers
      const rows = tbody.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
      }

      // Recalculate totals
      calculateTotals();
    }, 300);
  } else {
    showAlert("Cannot delete the only row!", "error");
  }
}

// Enhanced Calculate Row Total
function calculateRowTotal(input) {
  const row = input.parentNode.parentNode;
  const qty = parseFloat(row.querySelector('input[name="qty[]"]').value) || 0;
  const price = parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
  const taxRate = parseFloat(row.querySelector('select[name="tax[]"]').value) || 0;

  const amount = qty * price * (1 + taxRate / 100);
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
    const rowTax = rowSubtotal * (taxRate / 100);

    subtotal += rowSubtotal;
    totalTax += rowTax;
  }

  return {
    subtotal: subtotal,
    tax: totalTax,
    total: subtotal + totalTax,
  };
}

// Enhanced Validate Form Function
function validateForm() {
  let isValid = true;
  const errors = [];

  // Validate invoice basics
  const invoiceNumber = document.getElementById("invoice-number").value;
  if (!invoiceNumber || !/^INV-\d{8}$/.test(invoiceNumber)) {
    errors.push("Invalid invoice number format");
    isValid = false;
  }

  // Validate dates
  const invoiceDate = document.getElementById("invoice-date").value;
  const dueDate = document.getElementById("due-date").value;
  
  if (!invoiceDate) {
    errors.push("Invoice date is required");
    isValid = false;
  }
  
  if (dueDate && new Date(dueDate) < new Date(invoiceDate)) {
    errors.push("Due date cannot be before invoice date");
    isValid = false;
  }

  // Validate business details
  const sellerName = document.getElementById("seller-name").value;
  const buyerName = document.getElementById("buyer-name").value;
  const sellerGSTIN = document.getElementById("seller-gstin").value;
  const buyerGSTIN = document.getElementById("buyer-gstin").value;

  if (!sellerName || sellerName.length < 2) {
    errors.push("Valid seller name is required");
    isValid = false;
  }

  if (!buyerName || buyerName.length < 2) {
    errors.push("Valid buyer name is required");
    isValid = false;
  }

  if (sellerGSTIN === buyerGSTIN) {
    errors.push("Seller and Buyer GSTIN must be different");
    isValid = false;
  }

  // Validate items
  const itemRows = document.getElementById("item-rows").getElementsByTagName("tr");
  let validItems = 0;

  for (let i = 0; i < itemRows.length; i++) {
    const desc = itemRows[i].querySelector('input[name="item-desc[]"]').value;
    const hsn = itemRows[i].querySelector('input[name="hsn[]"]').value;
    const qty = parseFloat(itemRows[i].querySelector('input[name="qty[]"]').value);
    const price = parseFloat(itemRows[i].querySelector('input[name="price[]"]').value);

    if (desc && hsn && qty > 0 && price >= 0) {
      validItems++;
    }
  }

  if (validItems === 0) {
    errors.push("At least one valid item is required");
    isValid = false;
  }

  // Check minimum total
  const totals = calculateTotals();
  if (totals.total <= 0) {
    errors.push("Invoice total must be greater than 0");
    isValid = false;
  }

  if (!isValid) {
    showAlert("Please fix the following errors:\n• " + errors.join("\n• "), "error");
  }

  return isValid;
}

// Enhanced Alert System
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  if (type === "error") {
    alertDiv.style.backgroundColor = "#ef4444";
  } else if (type === "success") {
    alertDiv.style.backgroundColor = "#10b981";
  } else {
    alertDiv.style.backgroundColor = "#3b82f6";
  }
  
  alertDiv.innerHTML = message.replace(/\n/g, '<br>');
  
  // Add slide animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
  `;
  if (!document.head.querySelector('style[data-alerts]')) {
    style.setAttribute('data-alerts', 'true');
    document.head.appendChild(style);
  }
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
}

// Generate full invoice preview with enhanced validation
function generateInvoice() {
  // Validate required fields
  if (!validateForm()) {
    return;
  }

  // Show success message
  showAlert("Invoice generated successfully!", "success");

  // Basic invoice details
  document.getElementById("preview-invoice-number").innerText = document.getElementById("invoice-number").value;
  document.getElementById("preview-invoice-date").innerText = formatDate(document.getElementById("invoice-date").value);
  document.getElementById("preview-due-date").innerText = document.getElementById("due-date").value
    ? formatDate(document.getElementById("due-date").value)
    : "N/A";
  document.getElementById("preview-ack-date").innerText = formatDate(document.getElementById("invoice-date").value, true);

  // Seller details
  document.getElementById("preview-seller-name").innerText = document.getElementById("seller-name").value;
  document.getElementById("preview-seller-address").innerText = document.getElementById("seller-address").value;
  document.getElementById("preview-seller-gstin").innerText = document.getElementById("seller-gstin").value;

  const sellerStateSelect = document.getElementById("seller-state");
  document.getElementById("preview-seller-state-code").innerText = sellerStateSelect.value;
  document.getElementById("preview-seller-state-name").innerText = sellerStateSelect.options[sellerStateSelect.selectedIndex].text;

  // Buyer details
  document.getElementById("preview-buyer-name").innerText = document.getElementById("buyer-name").value;
  document.getElementById("preview-buyer-address").innerText = document.getElementById("buyer-address").value;
  document.getElementById("preview-buyer-gstin").innerText = document.getElementById("buyer-gstin").value;

  const buyerStateSelect = document.getElementById("buyer-state");
  document.getElementById("preview-buyer-state-code").innerText = buyerStateSelect.value;
  document.getElementById("preview-buyer-state-name").innerText = buyerStateSelect.options[buyerStateSelect.selectedIndex].text;

  // Notes
  document.getElementById("preview-notes").innerText = document.getElementById("notes").value;

  // Generate item rows
  const tbody = document.getElementById("preview-item-rows");
  tbody.innerHTML = "";
  const itemRows = document.getElementById("item-rows").getElementsByTagName("tr");

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

    // Skip empty rows
    if (!desc || !hsn || qty <= 0 || price < 0) continue;

    const rowSubtotal = qty * price;
    const rowTax = rowSubtotal * (taxRate / 100);
    const rowTotal = rowSubtotal + rowTax;

    subtotal += rowSubtotal;
    totalTax += rowTax;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${i + 1}</td>
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
  const sellerState = document.getElementById("seller-state").value;
  const buyerState = document.getElementById("buyer-state").value;

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
  document.getElementById("preview-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById("preview-cgst").innerText = `₹${cgst.toFixed(2)}`;
  document.getElementById("preview-sgst").innerText = `₹${sgst.toFixed(2)}`;
  document.getElementById("preview-igst").innerText = `₹${igst.toFixed(2)}`;
  document.getElementById("preview-grand-total").innerText = `₹${total.toFixed(2)}`;

  // Amount in words
  document.getElementById("preview-amount-in-words").innerText = `${amountInWords(total)} Only`;

  // Show invoice preview with animation
  const previewDiv = document.getElementById("invoice-preview");
  previewDiv.style.display = "block";
  previewDiv.style.animation = "fadeIn 0.5s ease-in";

  // Scroll to preview
  previewDiv.scrollIntoView({ behavior: "smooth" });
}

// Format date
function formatDate(dateString, withTime = false) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  if (withTime) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year}`;
}

// Number to words conversion for Indian currency
function amountInWords(num) {
  const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const bigUnit = ["", "Thousand", "Lakh", "Crore"];

  const convertLessThanThousand = (number) => {
    let words = "";

    // Hundreds place
    if (number >= 100) {
      words += single[Math.floor(number / 100)] + " Hundred ";
      number %= 100;

      if (number > 0) {
        words += "and ";
      }
    }

    // Tens and ones place
    if (number >= 10 && number <= 19) {
      words += double[number - 10] + " ";
    } else if (number >= 20) {
      words += tens[Math.floor(number / 10)] + " ";
      number %= 10;

      if (number > 0) {
        words += single[number] + " ";
      }
    } else if (number > 0) {
      words += single[number] + " ";
    }

    return words;
  };

  // Handle zero
  if (num === 0) {
    return "Zero Rupees";
  }

  // Split rupees and paise
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = "";

  // Process rupees
  if (rupees > 0) {
    // Indian numbering system: units, thousands, lakhs, and crores
    let rupeesWords = "";

    // Handle crores (10^7)
    if (rupees >= 10000000) {
      const crores = Math.floor(rupees / 10000000);
      rupeesWords += convertLessThanThousand(crores) + "Crore ";
      rupees %= 10000000;
    }

    // Handle lakhs (10^5)
    if (rupees >= 100000) {
      const lakhs = Math.floor(rupees / 100000);
      rupeesWords += convertLessThanThousand(lakhs) + "Lakh ";
      rupees %= 100000;
    }

    // Handle thousands
    if (rupees >= 1000) {
      const thousands = Math.floor(rupees / 1000);
      rupeesWords += convertLessThanThousand(thousands) + "Thousand ";
      rupees %= 1000;
    }

    // Handle remaining hundreds, tens, and ones
    if (rupees > 0) {
      rupeesWords += convertLessThanThousand(rupees);
    }

    words = rupeesWords + "Rupees";
  }

  // Process paise
  if (paise > 0) {
    words += " and " + convertLessThanThousand(paise) + "Paise";
  }

  return words.trim();
}

// Download invoice as PDF
function downloadInvoice() {
  // In a real implementation, this would use a PDF library
  // For demo, we'll use window.print() functionality
  showAlert("This would download the invoice as a PDF file in a real implementation. For demo purposes, we will use the Print dialog which can be saved as PDF.", "info");
  printInvoice();
}

// Print invoice
function printInvoice() {
  window.print();
}

// Navigation active state management
const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});