document.addEventListener('DOMContentLoaded', function() {
    // Reference to the form and important elements
    const registrationForm = document.getElementById('gst-registration-form');
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const saveAsDraftButton = registrationForm.querySelector('button[type="button"]');
    
    // Format validation patterns
    const validationPatterns = {
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        pincode: /^[1-9][0-9]{5}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        mobile: /^[6-9][0-9]{9}$/,
        telephone: /^[0-9]{6,12}$/
    };
    
    // For tracking form state
    let formIsDirty = false;
    let formErrors = {};
    
    /**
     * Validates a field based on its type and requirements
     * @param {HTMLElement} field - The input field to validate
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(field) {
        // Skip validation for non-required fields that are empty
        if (!field.hasAttribute('required') && !field.value.trim()) {
            return true;
        }
        
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } 
        // Type-specific validation for non-empty fields
        else if (field.value.trim()) {
            switch(field.id) {
                case 'pan':
                    if (!validationPatterns.pan.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'PAN must be in format AAAAA0000A';
                    }
                    break;
                    
                case 'pincode':
                    if (!validationPatterns.pincode.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'PIN code must be 6 digits';
                    }
                    break;
                    
                case 'email':
                    if (!validationPatterns.email.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'mobile':
                    if (!validationPatterns.mobile.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Mobile number must be 10 digits starting with 6-9';
                    }
                    break;
                    
                case 'telephone':
                    if (field.value.trim() && !validationPatterns.telephone.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid telephone number';
                    }
                    break;
                    
                case 'legal-name':
                    if (field.value.trim().length < 3) {
                        isValid = false;
                        errorMessage = 'Name must be at least 3 characters';
                    }
                    break;
            }
        }
        
        // Update UI based on validation result
        updateFieldUI(field, isValid, errorMessage);
        
        // Track error status
        if (!isValid) {
            formErrors[fieldName] = errorMessage;
        } else {
            delete formErrors[fieldName];
        }
        
        return isValid;
    }
    
    /**
     * Updates the UI of a field based on validation status
     * @param {HTMLElement} field - The input field
     * @param {boolean} isValid - Whether the field is valid
     * @param {string} errorMessage - Error message to display if invalid
     */
    function updateFieldUI(field, isValid, errorMessage) {
        // Remove any existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            // Style the field to indicate error
            field.style.borderColor = '#dc3545';
            
            // Add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '4px';
            errorElement.textContent = errorMessage;
            
            field.parentElement.appendChild(errorElement);
        } else {
            // Reset field styling
            field.style.borderColor = '';
        }
    }
    
    /**
     * Validate the entire form
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm() {
        let isValid = true;
        
        // Text inputs, selects, and textareas
        const inputs = registrationForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], select, textarea');
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Radio buttons (grouped by name)
        const radioGroups = {};
        registrationForm.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.hasAttribute('required')) {
                radioGroups[radio.name] = radioGroups[radio.name] || [];
                radioGroups[radio.name].push(radio);
            }
        });
        
        for (const groupName in radioGroups) {
            const group = radioGroups[groupName];
            const isChecked = group.some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                // Get the group container
                const groupContainer = group[0].closest('.form-group');
                // If there's no error message yet, add one
                if (!groupContainer.querySelector('.error-message')) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.style.color = '#dc3545';
                    errorElement.style.fontSize = '12px';
                    errorElement.style.marginTop = '4px';
                    errorElement.textContent = 'Please select an option';
                    groupContainer.appendChild(errorElement);
                }
                formErrors[groupName] = 'Please select an option';
            } else {
                // Remove any error message
                const groupContainer = group[0].closest('.form-group');
                const existingError = groupContainer.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                delete formErrors[groupName];
            }
        }
        
        // Checkbox validation
        const checkboxes = registrationForm.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                isValid = false;
                // Add error message if not already there
                const existingError = checkbox.parentElement.querySelector('.error-message');
                if (!existingError) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.style.color = '#dc3545';
                    errorElement.style.fontSize = '12px';
                    errorElement.style.marginTop = '4px';
                    errorElement.textContent = 'You must agree to continue';
                    checkbox.parentElement.appendChild(errorElement);
                }
                formErrors[checkbox.name] = 'You must agree to continue';
            } else {
                // Remove any error message
                const existingError = checkbox.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                delete formErrors[checkbox.name];
            }
        });
        
        // File upload validation
        const fileUploads = registrationForm.querySelectorAll('.upload-btn input[type="file"][required]');
        fileUploads.forEach(fileInput => {
            if (fileInput.files.length === 0) {
                isValid = false;
                const uploadBtn = fileInput.closest('.upload-btn');
                uploadBtn.style.borderColor = '#dc3545';
                
                // Add error message if not already there
                const existingError = uploadBtn.parentElement.querySelector('.error-message');
                if (!existingError) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.style.color = '#dc3545';
                    errorElement.style.fontSize = '12px';
                    errorElement.style.marginTop = '4px';
                    errorElement.textContent = 'Please upload a file';
                    uploadBtn.parentElement.appendChild(errorElement);
                }
                formErrors[uploadBtn.id] = 'Please upload a file';
            } else {
                // Check file size (max 2MB)
                const fileSize = fileInput.files[0].size / 1024 / 1024; // in MB
                const uploadBtn = fileInput.closest('.upload-btn');
                
                if (fileSize > 2) {
                    isValid = false;
                    uploadBtn.style.borderColor = '#dc3545';
                    
                    // Add error message if not already there
                    const existingError = uploadBtn.parentElement.querySelector('.error-message');
                    if (!existingError) {
                        const errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        errorElement.style.color = '#dc3545';
                        errorElement.style.fontSize = '12px';
                        errorElement.style.marginTop = '4px';
                        errorElement.textContent = 'File size must be less than 2MB';
                        uploadBtn.parentElement.appendChild(errorElement);
                    } else {
                        existingError.textContent = 'File size must be less than 2MB';
                    }
                    formErrors[uploadBtn.id] = 'File size must be less than 2MB';
                } else {
                    // Check file type
                    const fileName = fileInput.files[0].name;
                    const fileExt = fileName.split('.').pop().toLowerCase();
                    const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
                    
                    if (!allowedExts.includes(fileExt)) {
                        isValid = false;
                        uploadBtn.style.borderColor = '#dc3545';
                        
                        // Add error message if not already there
                        const existingError = uploadBtn.parentElement.querySelector('.error-message');
                        if (!existingError) {
                            const errorElement = document.createElement('div');
                            errorElement.className = 'error-message';
                            errorElement.style.color = '#dc3545';
                            errorElement.style.fontSize = '12px';
                            errorElement.style.marginTop = '4px';
                            errorElement.textContent = 'Only JPG, PNG, and PDF files are allowed';
                            uploadBtn.parentElement.appendChild(errorElement);
                        } else {
                            existingError.textContent = 'Only JPG, PNG, and PDF files are allowed';
                        }
                        formErrors[uploadBtn.id] = 'Only JPG, PNG, and PDF files are allowed';
                    } else {
                        // Reset styling
                        uploadBtn.style.borderColor = '';
                        
                        // Remove any error message
                        const existingError = uploadBtn.parentElement.querySelector('.error-message');
                        if (existingError) {
                            existingError.remove();
                        }
                        delete formErrors[uploadBtn.id];
                    }
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Handle file upload button styling
     */
    document.querySelectorAll('.upload-btn').forEach(btn => {
        const fileInput = btn.querySelector('input[type="file"]');
        
        btn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                btn.textContent = fileInput.files[0].name;
                
                // Reset error styling
                btn.style.borderColor = '';
                const existingError = btn.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                delete formErrors[btn.id];
                
                // Validate file size and type
                const fileSize = fileInput.files[0].size / 1024 / 1024; // in MB
                if (fileSize > 2) {
                    btn.style.borderColor = '#dc3545';
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.style.color = '#dc3545';
                    errorElement.style.fontSize = '12px';
                    errorElement.style.marginTop = '4px';
                    errorElement.textContent = 'File size must be less than 2MB';
                    btn.parentElement.appendChild(errorElement);
                    formErrors[btn.id] = 'File size must be less than 2MB';
                } else {
                    // Check file type
                    const fileName = fileInput.files[0].name;
                    const fileExt = fileName.split('.').pop().toLowerCase();
                    const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
                    
                    if (!allowedExts.includes(fileExt)) {
                        btn.style.borderColor = '#dc3545';
                        const errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        errorElement.style.color = '#dc3545';
                        errorElement.style.fontSize = '12px';
                        errorElement.style.marginTop = '4px';
                        errorElement.textContent = 'Only JPG, PNG, and PDF files are allowed';
                        btn.parentElement.appendChild(errorElement);
                        formErrors[btn.id] = 'Only JPG, PNG, and PDF files are allowed';
                    }
                }
            } else {
                btn.textContent = 'Choose File';
            }
        });
    });
    
    /**
     * Add input event listeners to validate fields on change
     */
    registrationForm.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            formIsDirty = true;
            validateField(this);
        });
        
        element.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    /**
     * Handle form submission
     */
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            // Generate application reference number
            const referenceNumber = 'GST-' + Math.floor(100000 + Math.random() * 900000);
            
            // Collect form data for submission
            const formData = new FormData(registrationForm);
            
            // Display success message
            displaySuccessMessage(referenceNumber);
            
            // In a real application, you would send the form data to the server here
            console.log('Form submitted successfully!');
            console.log('Reference Number:', referenceNumber);
            
            // Reset form state
            formIsDirty = false;
            formErrors = {};
            
            // Optional: reset the form
            // registrationForm.reset();
        } else {
            // Display error summary at the top of the form
            displayErrorSummary();
            
            // Scroll to the first error
            const firstErrorElement = document.querySelector('.error-message');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    /**
     * Handle Save as Draft button
     */
    saveAsDraftButton.addEventListener('click', function() {
        // Generate draft ID
        const draftId = 'DRAFT-' + Math.floor(100000 + Math.random() * 900000);
        
        // Collect form data
        const formData = new FormData(registrationForm);
        const formDataObj = {};
        
        // Convert FormData to object for storage
        for (const [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        
        // In a real application, you would store this in localStorage or send to server
        // For demo purposes, we'll just store in localStorage
        localStorage.setItem('gst_registration_draft_' + draftId, JSON.stringify(formDataObj));
        
        alert('Your application has been saved as draft. Your draft ID is: ' + draftId + '. Please note this ID to retrieve your draft later.');
        
        // Reset form dirty state
        formIsDirty = false;
    });
    
    /**
     * Display success message with application reference number
     */
    function displaySuccessMessage(referenceNumber) {
        // Remove any existing message
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.backgroundColor = '#d4edda';
        successMessage.style.color = '#155724';
        successMessage.style.padding = '15px';
        successMessage.style.marginBottom = '20px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.border = '1px solid #c3e6cb';
        successMessage.style.textAlign = 'center';
        
        successMessage.innerHTML = `
            <h3 style="margin-top: 0;">Registration Submitted Successfully!</h3>
            <p>Your GST Registration application has been submitted. Please note your application reference number for future correspondence:</p>
            <p style="font-weight: bold; font-size: 18px;">${referenceNumber}</p>
            <p>You will receive a confirmation email shortly. The application processing may take up to 7 working days.</p>
        `;
        
        // Insert at the top of the form
        registrationForm.insertBefore(successMessage, registrationForm.firstChild);
        
        // Scroll to the message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Display error summary at the top of the form
     */
    function displayErrorSummary() {
        // Remove any existing error summary
        const existingErrorSummary = document.querySelector('.error-summary');
        if (existingErrorSummary) {
            existingErrorSummary.remove();
        }
        
        // Create error summary element
        const errorSummary = document.createElement('div');
        errorSummary.className = 'error-summary';
        errorSummary.style.backgroundColor = '#f8d7da';
        errorSummary.style.color = '#721c24';
        errorSummary.style.padding = '15px';
        errorSummary.style.marginBottom = '20px';
        errorSummary.style.borderRadius = '5px';
        errorSummary.style.border = '1px solid #f5c6cb';
        
        errorSummary.innerHTML = `
            <h3 style="margin-top: 0;">Please correct the following errors:</h3>
            <ul style="margin-bottom: 0;">
                ${Object.keys(formErrors).map(field => `<li>${formErrors[field]}</li>`).join('')}
            </ul>
        `;
        
        // Insert at the top of the form
        registrationForm.insertBefore(errorSummary, registrationForm.firstChild);
    }
    
    /**
     * Prevent navigation when form is dirty with unsaved changes
     */
    window.addEventListener('beforeunload', function(e) {
        if (formIsDirty && Object.keys(formErrors).length === 0) {
            const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
    
    /**
     * Enhance the PAN input to auto-capitalize
     */
    const panInput = document.getElementById('pan');
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
    /**
     * Helper function to restrict input to numbers only
     */
    function restrictToNumbers(input) {
        input.addEventListener('keypress', function(e) {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('paste', function(e) {
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d*$/.test(pastedText)) {
                e.preventDefault();
            }
        });
    }
    
    // Apply number-only restriction to relevant inputs
    const numberOnlyInputs = [
        document.getElementById('pincode'),
        document.getElementById('mobile'),
        document.getElementById('telephone')
    ];
    
    numberOnlyInputs.forEach(input => {
        if (input) {
            restrictToNumbers(input);
        }
    });

    /**
     * Enhance interdependent fields
     */

    // Handle business constitution change
    const businessConstitution = document.getElementById('business-constitution');
    if (businessConstitution) {
        businessConstitution.addEventListener('change', function() {
            const value = this.value;
            const businessType = document.getElementById('business-type');
            
            // If selected "Proprietorship", limit business type options
            if (value === 'proprietorship') {
                // Disable composition scheme option for proprietorship
                Array.from(businessType.options).forEach(option => {
                    if (option.value === 'composition') {
                        option.disabled = true;
                    }
                });
                
                // If currently selected option is now disabled, reset selection
                if (businessType.value === 'composition') {
                    businessType.value = '';
                }
            } else {
                // Enable all options
                Array.from(businessType.options).forEach(option => {
                    option.disabled = false;
                });
            }
        });
    }

    // Handle registration type change
    const registrationType = document.getElementsByName('registration-type');
    registrationType.forEach(radio => {
        radio.addEventListener('change', function() {
            const turnover = document.getElementById('turnover');
            
            if (this.value === 'composition' && turnover) {
                // Composition scheme is only available for businesses with turnover below 1.5 crores
                Array.from(turnover.options).forEach(option => {
                    if (option.value === '5-plus' || option.value === '1-5') {
                        option.disabled = true;
                    }
                });
                
                // If currently selected option is now disabled, reset selection
                if (turnover.value === '5-plus' || turnover.value === '1-5') {
                    turnover.value = '';
                    updateFieldUI(turnover, false, 'Composition scheme is only available for businesses with turnover below ₹1 Crore');
                }
            } else if (turnover) {
                // Enable all options
                Array.from(turnover.options).forEach(option => {
                    option.disabled = false;
                });
            }
        });
    });
});

const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach(link => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});
