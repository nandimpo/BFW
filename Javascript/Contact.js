// EmailJS Configuration
// Replace these with your actual EmailJS credentials from your dashboard
const EMAILJS_PUBLIC_KEY = 'mt1qmNzZCtYXdR25w';      // Get from EmailJS Account → General → Public Key
const EMAILJS_SERVICE_ID = 'service_po4sj8i';      // Get from EmailJS Email Services
const EMAILJS_TEMPLATE_ID = 'template_w1efp71';    // Get from EmailJS Email Templates

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const sendBtn = document.querySelector('.send-btn');

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validation
        if (!validateForm(name, email, message)) {
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Prepare email parameters for EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            reply_to: email,
            message: message,
            subject: 'Contact Form Submission'
        };
        
        // Send email using EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                hideLoadingState();
                showSuccessMessage();
                resetForm();
            })
            .catch(function(error) {
                console.error('Email failed to send:', error);
                hideLoadingState();
                showErrorMessage('Failed to send message. Please try again or contact us directly.');
            });
    });

    // Form validation function
    function validateForm(name, email, message) {
        let isValid = true;
        let errorMessage = '';

        // Reset previous error states
        resetErrorStates();

        // Name validation
        if (!name) {
            showFieldError(nameInput, 'Name is required');
            errorMessage += 'Please enter your name.\n';
            isValid = false;
        } else if (name.length < 2) {
            showFieldError(nameInput, 'Name must be at least 2 characters');
            errorMessage += 'Name must be at least 2 characters long.\n';
            isValid = false;
        }

        // Email validation
        if (!email) {
            showFieldError(emailInput, 'Email is required');
            errorMessage += 'Please enter your email address.\n';
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Please enter a valid email');
            errorMessage += 'Please enter a valid email address.\n';
            isValid = false;
        }

        // Message validation
        if (!message) {
            showFieldError(messageInput, 'Message is required');
            errorMessage += 'Please enter your message.\n';
            isValid = false;
        } else if (message.length < 10) {
            showFieldError(messageInput, 'Message must be at least 10 characters');
            errorMessage += 'Message must be at least 10 characters long.\n';
            isValid = false;
        } else if (message.length > 500) {
            showFieldError(messageInput, 'Message is too long (max 500 characters)');
            errorMessage += 'Message must be less than 500 characters.\n';
            isValid = false;
        }

        // Show error message if validation fails
        if (!isValid) {
            showErrorMessage(errorMessage.trim());
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show field error
    function showFieldError(field, message) {
        field.style.borderColor = '#ff4444';
        field.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.3)';
        
        // Add error class for additional styling if needed
        field.classList.add('error');
    }

    // Reset error states
    function resetErrorStates() {
        const fields = [nameInput, emailInput, messageInput];
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            field.classList.remove('error');
        });
    }

    // Show error message
    function showErrorMessage(message) {
        // Remove any existing messages first
        removeExistingMessages();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background-color: #ff4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            font-size: 1.4rem;
            line-height: 1.4;
            white-space: pre-line;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        contactForm.insertBefore(errorDiv, contactForm.firstChild);

        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                errorDiv.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 8000);
    }

    // Show success message
    function showSuccessMessage() {
        // Remove any existing messages first
        removeExistingMessages();
        
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background-color: #4CAF50;
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
            font-size: 1.6rem;
            text-align: center;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `;
        successDiv.innerHTML = '✓ Thank you for your message!<br>We will get back to you soon.';
        contactForm.insertBefore(successDiv, contactForm.firstChild);

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (successDiv && successDiv.parentNode) {
                successDiv.style.opacity = '0';
                successDiv.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 300);
            }
        }, 8000);
    }

    // Remove existing messages
    function removeExistingMessages() {
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        
        if (existingError && existingError.parentNode) {
            existingError.parentNode.removeChild(existingError);
        }
        if (existingSuccess && existingSuccess.parentNode) {
            existingSuccess.parentNode.removeChild(existingSuccess);
        }
    }

    // Show loading state
    function showLoadingState() {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
        sendBtn.textContent = 'SENDING...';
        sendBtn.style.cursor = 'not-allowed';
        
        // Add loading animation
        sendBtn.style.position = 'relative';
        sendBtn.innerHTML = `
            <span style="opacity: 0.7;">SENDING...</span>
            <div style="
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;
    }

    // Hide loading state
    function hideLoadingState() {
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        sendBtn.textContent = 'SEND MESSAGE';
        sendBtn.style.cursor = 'pointer';
        sendBtn.innerHTML = 'SEND MESSAGE';
    }

    // Reset form
    function resetForm() {
        contactForm.reset();
        resetErrorStates();
        removeExistingMessages();
        updateCharCounter(); // Update character counter after reset
    }

    // Add input event listeners for real-time validation feedback
    nameInput.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim().length >= 2) {
            this.style.borderColor = '';
            this.style.boxShadow = '';
            this.classList.remove('error');
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error') && isValidEmail(this.value.trim())) {
            this.style.borderColor = '';
            this.style.boxShadow = '';
            this.classList.remove('error');
        }
    });

    messageInput.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim().length >= 10) {
            this.style.borderColor = '';
            this.style.boxShadow = '';
            this.classList.remove('error');
        }
        updateCharCounter();
    });

    // Add smooth focus effects for form inputs
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add icon hover effects
    const iconWrappers = document.querySelectorAll('.icon-wrapper');
    iconWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });

        wrapper.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Character counter for message field
    const maxLength = 500;
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = `
        color: #808080;
        font-size: 1.2rem;
        text-align: right;
        margin-top: 0.5rem;
        transition: color 0.3s ease;
    `;
    messageInput.parentNode.insertBefore(charCounter, messageInput.nextSibling);

    // Update character counter function
    function updateCharCounter() {
        const currentLength = messageInput.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength) {
            charCounter.style.color = '#ff4444';
            charCounter.style.fontWeight = 'bold';
        } else if (currentLength > maxLength * 0.9) {
            charCounter.style.color = '#ff4444';
            charCounter.style.fontWeight = 'normal';
        } else if (currentLength > maxLength * 0.7) {
            charCounter.style.color = '#ffaa00';
            charCounter.style.fontWeight = 'normal';
        } else {
            charCounter.style.color = '#808080';
            charCounter.style.fontWeight = 'normal';
        }
    }

    // Initialize character counter
    updateCharCounter();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes spin {
            from { transform: translateY(-50%) rotate(0deg); }
            to { transform: translateY(-50%) rotate(360deg); }
        }
        
        .contact-form input:focus,
        .contact-form textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        .contact-form input.error:focus,
        .contact-form textarea.error:focus {
            border-color: #ff4444;
            box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.3);
        }
    `;
    document.head.appendChild(style);
});

// Error handling for EmailJS initialization
window.addEventListener('error', function(e) {
    if (e.message.includes('emailjs')) {
        console.error('EmailJS failed to load. Please check your internet connection and EmailJS configuration.');
    }
});