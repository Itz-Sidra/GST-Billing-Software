document.addEventListener('DOMContentLoaded', function() {
    // Reference to the form and important elements
    const registrationForm = document.getElementById('gst-registration-form');
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const saveAsDraftButton = document.getElementById('save-draft-btn');
    
    // Comprehensive validation patterns
    const validationPatterns = {
        userName: /^[A-Za-z\s]{2,50}$/,
        prn: /^[0-9]{8}$/,
        department: /^[A-Za-z\s]{2,50}$/,
        legalName: /^.{3,100}$/,
        tradeName: /^.{0,100}$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        building: /^.{2,50}$/,
        street: /^.{3,100}$/,
        city: /^[A-Za-z\s]{2,50}$/,
        district: /^[A-Za-z\s]{2,50}$/,
        pincode: /^[1-9][0-9]{5}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        mobile: /^[6-9][0-9]{9}$/,
        telephone: /^[0-9]{6,12}$/,
        fax: /^[0-9]{6,12}$/,
        businessDescription: /^.{10,500}$/
    };
    
    // For tracking form state
    let formIsDirty = false;
    let formErrors = {};
    
    /**
     * Comprehensive field validation function
     */
    function validateField(field) {
        const fieldName = field.name || field.id;
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Skip validation for non-required empty fields
        if (!field.hasAttribute('required') && !fieldValue) {
            updateFieldUI(field, true, '');
            delete formErrors[fieldName];
            return true;
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !fieldValue) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (fieldValue) {
            // Specific field validations
            switch(field.id) {
                case 'user-name':
                    if (!validationPatterns.userName.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Name must contain only letters and spaces (2-50 characters)';
                    }
                    break;
                    
                case 'prn':
                    if (!validationPatterns.prn.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'PRN must be exactly 8 digits';
                    }
                    break;
                    
                case 'branch':
                    if (!['CS', 'AIML', 'IT'].includes(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please select a valid branch';
                    }
                    break;
                    
                case 'department':
                    if (!validationPatterns.department.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Department must contain only letters and spaces (2-50 characters)';
                    }
                    break;
                    
                case 'legal-name':
                    if (!validationPatterns.legalName.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Legal name must be 3-100 characters long';
                    }
                    break;
                    
                case 'trade-name':
                    if (fieldValue && !validationPatterns.tradeName.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Trade name cannot exceed 100 characters';
                    }
                    break;
                    
                case 'pan':
                    if (!validationPatterns.pan.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'PAN must be in format AAAAA0000A (5 letters, 4 digits, 1 letter)';
                    }
                    break;
                    
                case 'business-constitution':
                    const validConstitutions = ['proprietorship', 'partnership', 'llp', 'pvt-ltd', 'public-ltd', 'society', 'others'];
                    if (!validConstitutions.includes(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please select a valid business constitution';
                    }
                    break;
                    
                case 'building':
                    if (!validationPatterns.building.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Building number/flat number must be 2-50 characters long';
                    }
                    break;
                    
                case 'street':
                    if (!validationPatterns.street.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Street/Road/Lane must be 3-100 characters long';
                    }
                    break;
                    
                case 'city':
                    if (!validationPatterns.city.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'City must contain only letters and spaces (2-50 characters)';
                    }
                    break;
                    
                case 'district':
                    if (!validationPatterns.district.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'District must contain only letters and spaces (2-50 characters)';
                    }
                    break;
                    
                case 'state':
                    const validStates = [
                        'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 
                        'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand', 
                        'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur', 
                        'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 
                        'sikkim', 'tamil-nadu', 'telangana', 'tripura', 'uttar-pradesh', 
                        'uttarakhand', 'west-bengal', 'delhi'
                    ];
                    if (!validStates.includes(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please select a valid state';
                    }
                    break;
                    
                case 'pincode':
                    if (!validationPatterns.pincode.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'PIN code must be exactly 6 digits and cannot start with 0';
                    }
                    break;
                    
                case 'email':
                    if (!validationPatterns.email.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'mobile':
                    if (!validationPatterns.mobile.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Mobile number must be exactly 10 digits starting with 6-9';
                    }
                    break;
                    
                case 'telephone':
                    if (fieldValue && !validationPatterns.telephone.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Telephone number must be 6-12 digits';
                    }
                    break;
                    
                case 'fax':
                    if (fieldValue && !validationPatterns.fax.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Fax number must be 6-12 digits';
                    }
                    break;
                    
                case 'business-type':
                    const validBusinessTypes = ['manufacturing', 'trader', 'service', 'works-contract', 'leasing', 'composition', 'others'];
                    if (!validBusinessTypes.includes(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please select a valid business type';
                    }
                    break;
                    
                case 'turnover':
                    const validTurnoverRanges = ['upto-20', '20-50', '50-100', '1-5', '5-plus'];
                    if (!validTurnoverRanges.includes(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please select a valid turnover range';
                    }
                    break;
                    
                case 'business-description':
                    if (!validationPatterns.businessDescription.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Business description must be 10-500 characters long';
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
     */
    function updateFieldUI(field, isValid, errorMessage) {
        // Remove any existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            // Style the field to indicate error
            field.classList.remove('field-valid');
            field.classList.add('field-invalid');
            
            // Add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            field.parentElement.appendChild(errorElement);
        } else {
            // Reset field styling
            field.classList.remove('field-invalid');
            if (field.value.trim()) {
                field.classList.add('field-valid');
            } else {
                field.classList.remove('field-valid');
            }
        }
    }
    
    /**
     * Validate the entire form
     */
    function validateForm() {
        let isValid = true;
        
        // Text inputs, selects, and textareas
        const inputs = registrationForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select, textarea');
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
                const groupContainer = group[0].closest('.form-group');
                if (!groupContainer.querySelector('.error-message')) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = 'Please select an option';
                    groupContainer.appendChild(errorElement);
                }
                formErrors[groupName] = 'Please select an option';
            } else {
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
                const existingError = checkbox.parentElement.querySelector('.error-message');
                if (!existingError) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = 'You must agree to continue';
                    checkbox.parentElement.appendChild(errorElement);
                }
                formErrors[checkbox.name] = 'You must agree to continue';
            } else {
                const existingError = checkbox.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                delete formErrors[checkbox.name];
            }
        });
        
        // File upload validation
        const fileUploads = registrationForm.querySelectorAll('.upload-btn input[type="file"]');
        fileUploads.forEach(fileInput => {
            const isRequired = fileInput.hasAttribute('required');
            const uploadBtn = fileInput.closest('.upload-btn');
            
            if (isRequired && fileInput.files.length === 0) {
                isValid = false;
                uploadBtn.style.borderColor = '#dc3545';
                
                const existingError = uploadBtn.parentElement.querySelector('.error-message');
                if (!existingError) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = 'Please upload a file';
                    uploadBtn.parentElement.appendChild(errorElement);
                }
                formErrors[uploadBtn.id] = 'Please upload a file';
            } else if (fileInput.files.length > 0) {
                // Validate file size and type
                const file = fileInput.files[0];
                const fileSize = file.size / 1024 / 1024; // in MB
                const fileName = file.name;
                const fileExt = fileName.split('.').pop().toLowerCase();
                const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
                
                let fileError = '';
                
                if (fileSize > 2) {
                    fileError = 'File size must be less than 2MB';
                } else if (!allowedExts.includes(fileExt)) {
                    fileError = 'Only JPG, PNG, and PDF files are allowed';
                }
                
                if (fileError) {
                    isValid = false;
                    uploadBtn.style.borderColor = '#dc3545';
                    
                    const existingError = uploadBtn.parentElement.querySelector('.error-message');
                    if (existingError) {
                        existingError.textContent = fileError;
                    } else {
                        const errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        errorElement.textContent = fileError;
                        uploadBtn.parentElement.appendChild(errorElement);
                    }
                    formErrors[uploadBtn.id] = fileError;
                } else {
                    // File is valid
                    uploadBtn.style.borderColor = '';
                    const existingError = uploadBtn.parentElement.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    delete formErrors[uploadBtn.id];
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Handle file upload button styling and validation
     */
    document.querySelectorAll('.upload-btn').forEach(btn => {
        const fileInput = btn.querySelector('input[type="file"]');
        
        btn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                btn.textContent = file.name;
                
                // Reset error styling initially
                btn.style.borderColor = '';
                const existingError = btn.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                delete formErrors[btn.id];
                
                // Validate file
                const fileSize = file.size / 1024 / 1024; // in MB
                const fileName = file.name;
                const fileExt = fileName.split('.').pop().toLowerCase();
                const allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
                
                let fileError = '';
                
                if (fileSize > 2) {
                    fileError = 'File size must be less than 2MB';
                } else if (!allowedExts.includes(fileExt)) {
                    fileError = 'Only JPG, PNG, and PDF files are allowed';
                }
                
                if (fileError) {
                    btn.style.borderColor = '#dc3545';
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = fileError;
                    btn.parentElement.appendChild(errorElement);
                    formErrors[btn.id] = fileError;
                }
            } else {
                btn.textContent = 'Choose File';
            }
        });
    });
    
    /**
     * Input restrictions and formatting
     */
    
    // Restrict alphabets-only fields
    function restrictToAlphabetsOnly(input) {
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-z\s]/.test(char)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('paste', function(e) {
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^[A-Za-z\s]*$/.test(pastedText)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z\s]/g, '');
        });
    }
    
    // Restrict numbers-only fields
    function restrictToNumbersOnly(input) {
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
        
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Apply restrictions to specific fields
    const alphabetOnlyFields = ['user-name', 'department', 'city', 'district'];
    alphabetOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            restrictToAlphabetsOnly(field);
        }
    });
    
    const numberOnlyFields = ['prn', 'pincode', 'mobile', 'telephone', 'fax'];
    numberOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            restrictToNumbersOnly(field);
        }
    });
    
    // Auto-capitalize PAN input
    const panInput = document.getElementById('pan');
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
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
        
        element.addEventListener('change', function() {
            formIsDirty = true;
            validateField(this);
        });
    });
    
    /**
     * Local storage functions
     */
    function saveFormDataToLocalStorage(isDraft = false) {
        const formData = new FormData(registrationForm);
        const formDataObj = {};
        
        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        
        // Add radio button values
        const radioButtons = registrationForm.querySelectorAll('input[type="radio"]:checked');
        radioButtons.forEach(radio => {
            formDataObj[radio.name] = radio.value;
        });
        
        // Add checkbox values
        const checkboxes = registrationForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            formDataObj[checkbox.name] = checkbox.checked;
        });
        
        // Add timestamp
        formDataObj.timestamp = new Date().toISOString();
        formDataObj.isDraft = isDraft;
        
        const storageKey = isDraft ? 'gst_registration_draft' : 'gst_registration_submitted';
        localStorage.setItem(storageKey, JSON.stringify(formDataObj));
        
        return formDataObj;
    }
    
    function loadFormDataFromLocalStorage() {
        const draftData = localStorage.getItem('gst_registration_draft');
        if (draftData) {
            try {
                const data = JSON.parse(draftData);
                
                // Fill form fields
                Object.keys(data).forEach(key => {
                    const field = registrationForm.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'radio') {
                            const radioButton = registrationForm.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                            if (radioButton) {
                                radioButton.checked = true;
                            }
                        } else if (field.type === 'checkbox') {
                            field.checked = data[key];
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                return true;
            } catch (e) {
                console.error('Error loading draft data:', e);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Form submission handler
     */
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            // Save to localStorage
            const formData = saveFormDataToLocalStorage(false);
            
            // Generate application reference number
            const referenceNumber = 'GST-' + Math.floor(100000 + Math.random() * 900000);
            
            // Display success message
            displaySuccessMessage(referenceNumber);
            
            console.log('Form submitted successfully!');
            console.log('Reference Number:', referenceNumber);
            console.log('Form Data:', formData);
            
            // Reset form state
            formIsDirty = false;
            formErrors = {};
        } else {
            // Display error summary
            displayErrorSummary();
            
            // Scroll to first error
            const firstErrorElement = document.querySelector('.error-message');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    /**
     * Save as Draft handler
     */
    saveAsDraftButton.addEventListener('click', function() {
        // Save current form state
        const formData = saveFormDataToLocalStorage(true);
        const draftId = 'DRAFT-' + Math.floor(100000 + Math.random() * 900000);
        
        // Also save with unique draft ID
        localStorage.setItem('gst_registration_draft_' + draftId, JSON.stringify(formData));
        
        alert('Your application has been saved as draft. Your draft ID is: ' + draftId + '. All data has been saved locally.');
        
        formIsDirty = false;
    });
    
    /**
     * Display success message
     */
    function displaySuccessMessage(referenceNumber) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.success-message, .error-summary');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3 style="margin-top: 0;">Registration Submitted Successfully!</h3>
            <p>Your GST Registration application has been submitted. Please note your application reference number for future correspondence:</p>
            <p style="font-weight: bold; font-size: 18px;">${referenceNumber}</p>
            <p>You will receive a confirmation email shortly. The application processing may take up to 7 working days.</p>
            <p><small>All data has been saved locally for your records.</small></p>
        `;
        
        registrationForm.insertBefore(successMessage, registrationForm.firstChild);
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Display error summary
     */
    function displayErrorSummary() {
        // Remove any existing error summary
        const existingErrorSummary = document.querySelector('.error-summary');
        if (existingErrorSummary) {
            existingErrorSummary.remove();
        }
        
        const errorSummary = document.createElement('div');
        errorSummary.className = 'error-summary';
        errorSummary.innerHTML = `
            <h3 style="margin-top: 0;">Please correct the following errors:</h3>
            <ul style="margin-bottom: 0;">
                ${Object.values(formErrors).map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        registrationForm.insertBefore(errorSummary, registrationForm.firstChild);
    }
    
    /**
     * Business logic validations
     */
    
    // Handle business constitution change
    const businessConstitution = document.getElementById('business-constitution');
    if (businessConstitution) {
        businessConstitution.addEventListener('change', function() {
            const value = this.value;
            const businessType = document.getElementById('business-type');
            
            if (value === 'proprietorship') {
                // Disable composition scheme for proprietorship
                Array.from(businessType.options).forEach(option => {
                    if (option.value === 'composition') {
                        option.disabled = true;
                    }
                });
                
                if (businessType.value === 'composition') {
                    businessType.value = '';
                    validateField(businessType);
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
                // Composition scheme restrictions
                Array.from(turnover.options).forEach(option => {
                    if (option.value === '5-plus' || option.value === '1-5') {
                        option.disabled = true;
                    }
                });
                
                if (turnover.value === '5-plus' || turnover.value === '1-5') {
                    turnover.value = '';
                    updateFieldUI(turnover, false, 'Composition scheme is only available for businesses with turnover below ₹1 Crore');
                }
            } else if (turnover) {
                // Enable all options
                Array.from(turnover.options).forEach(option => {
                    option.disabled = false;
                });
                
                // Remove any composition-related error
                const existingError = turnover.parentElement.querySelector('.error-message');
                if (existingError && existingError.textContent.includes('Composition scheme')) {
                    existingError.remove();
                }
            }
        });
    });
    
    /**
     * Prevent navigation with unsaved changes
     */
    window.addEventListener('beforeunload', function(e) {
        if (formIsDirty && Object.keys(formErrors).length === 0) {
            const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
    
    /**
     * Load draft data on page load
     */
    if (loadFormDataFromLocalStorage()) {
        console.log('Draft data loaded successfully');
        // Validate all loaded fields
        const allFields = registrationForm.querySelectorAll('input, select, textarea');
        allFields.forEach(field => {
            if (field.value) {
                validateField(field);
            }
        });
    }
    
    
    
    // Initialize form
    console.log('GST Registration Form initialized with comprehensive validation');
});

const currentPath = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach(link => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});