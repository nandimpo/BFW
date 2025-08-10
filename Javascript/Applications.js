// Initialize EmailJS
emailjs.init("mt1qmNzZCtYXdR25w"); // Replace with your EmailJS public key

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Form submission handlers
    document.getElementById('designerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm('designerForm', 'designerMessage', 'Designer');
    });

    document.getElementById('modelForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm('modelForm', 'modelMessage', 'Model');
    });

    // File input display handlers
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file') {
            handleFileSelection(e.target);
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
});

/**
 * Submit form data via EmailJS
 * @param {string} formId - The ID of the form to submit
 * @param {string} messageId - The ID of the message container
 * @param {string} applicationType - Type of application (Designer/Model)
 */
function submitForm(formId, messageId, applicationType) {
    const form = document.getElementById(formId);
    const messageDiv = document.getElementById(messageId);
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span>Submitting...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const templateParams = {
        application_type: applicationType,
        to_email: 'braamfashionweek24@gmail.com',
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        message: generateEmailMessage(formData, applicationType)
    };

    // Send email using EmailJS
    emailjs.send('service_po4sj8i', 'template_w1efp71', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage(messageDiv, 'Application submitted successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            resetFileInputs(form);
        }, function(error) {
            console.error('FAILED...', error);
            showMessage(messageDiv, 'Failed to submit application. Please try again.', 'error');
        })
        .finally(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Generate email message from form data
 * @param {FormData} formData - The form data
 * @param {string} applicationType - Type of application
 * @returns {string} Formatted email message
 */
function generateEmailMessage(formData, applicationType) {
    let message = `New ${applicationType} Application for Braam Fashion Week:\n\n`;
    
    // Define field labels for better formatting
    const fieldLabels = {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        age: 'Age',
        brand: 'Brand Name',
        experience: 'Experience Level',
        style: 'Design Style/Aesthetic',
        theme: 'Collection Theme',
        motivation: 'Motivation',
        height: 'Height (cm)',
        measurements: 'Measurements',
        location: 'Current Location',
        skills: 'Special Skills/Talents'
    };
    
    for (let [key, value] of formData.entries()) {
        if (value && value.trim() !== '' && key !== 'portfolio' && key !== 'photos') {
            const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
            message += `${label}: ${value}\n`;
        }
    }

    message += '\n---\nSubmitted via Braam Fashion Week Applications Portal';
    
    return message;
}

/**
 * Show success or error message
 * @param {HTMLElement} messageDiv - The message container
 * @param {string} text - Message text
 * @param {string} type - Message type (success/error)
 */
function showMessage(messageDiv, text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.add('show');
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

/**
 * Handle file selection display
 * @param {HTMLInputElement} fileInput - The file input element
 */
function handleFileSelection(fileInput) {
    const button = fileInput.parentNode.querySelector('.file-input-button');
    const fileCount = fileInput.files.length;
    
    if (fileCount > 0) {
        const fileText = fileCount === 1 ? 'file' : 'files';
        button.innerHTML = `<i class="fas fa-check"></i> ${fileCount} ${fileText} selected`;
        button.style.background = 'linear-gradient(45deg, #ffffff, #808080)';
        button.style.color = '#000000';
    } else {
        // Reset button to original state
        if (fileInput.id.includes('portfolio')) {
            button.innerHTML = '<i class="fas fa-upload"></i> Upload Portfolio';
        } else {
            button.innerHTML = '<i class="fas fa-camera"></i> Upload Photos';
        }
        button.style.background = 'linear-gradient(45deg, #808080, #ffffff)';
        button.style.color = '#000000';
    }
}

/**
 * Reset file inputs after form submission
 * @param {HTMLFormElement} form - The form element
 */
function resetFileInputs(form) {
    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const button = input.parentNode.querySelector('.file-input-button');
        if (input.id.includes('portfolio')) {
            button.innerHTML = '<i class="fas fa-upload"></i> Upload Portfolio';
        } else {
            button.innerHTML = '<i class="fas fa-camera"></i> Upload Photos';
        }
        button.style.background = 'linear-gradient(45deg, #808080, #ffffff)';
        button.style.color = '#000000';
    });
}

/**
 * Validate form before submission
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#808080';
            field.style.boxShadow = '0 0 10px rgba(128, 128, 128, 0.5)';
            isValid = false;
            
            // Reset border color after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '#333';
                field.style.boxShadow = 'none';
            }, 3000);
        }
    });
    
    return isValid;
}

/**
 * Format phone number input (optional enhancement)
 * @param {HTMLInputElement} input - Phone input element
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})/, '($1) ');
    }
    
    input.value = value;
}

// Add phone number formatting to phone inputs (optional)
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

/**
 * Handle form validation on input change
 */
document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('required') && e.target.value.trim()) {
        e.target.style.borderColor = '#333';
    }
});

/**
 * Enhanced form submission with validation
 */
function submitFormWithValidation(formId, messageId, applicationType) {
    const form = document.getElementById(formId);
    
    if (!validateForm(form)) {
        showMessage(document.getElementById(messageId), 'Please fill in all required fields.', 'error');
        return;
    }
    
    submitForm(formId, messageId, applicationType);
}

/**
 * Initialize EmailJS with error handling
 */
function initializeEmailJS() {
    try {
        // Replace with your actual EmailJS public key
        emailjs.init("YOUR_PUBLIC_KEY");
        console.log('EmailJS initialized successfully');
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
    }
}

/**
 * Check if EmailJS is properly configured
 * @returns {boolean} Whether EmailJS is configured
 */
function isEmailJSConfigured() {
    return typeof emailjs !== 'undefined' && 
           emailjs.send && 
           typeof emailjs.send === 'function';
}

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!isEmailJSConfigured()) {
        console.warn('EmailJS is not properly loaded. Please check your configuration.');
    } else {
        initializeEmailJS();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitForm,
        generateEmailMessage,
        showMessage,
        validateForm,
        formatPhoneNumber
    };
}