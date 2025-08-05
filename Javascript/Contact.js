// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showSuccessMessage();
            resetForm();
            hideLoadingState();
        }, 2000);
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
        // Create or update error message element
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
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
            `;
            contactForm.insertBefore(errorDiv, contactForm.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 5000);
    }

    // Show success message
    function showSuccessMessage() {
        // Create success message element
        let successDiv = document.querySelector('.success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
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
            `;
            contactForm.insertBefore(successDiv, contactForm.firstChild);
        }
        successDiv.textContent = '✓ Thank you for your message! We will get back to you soon.';
        successDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successDiv) {
                successDiv.style.display = 'none';
            }
        }, 5000);
    }

    // Show loading state
    function showLoadingState() {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
        sendBtn.textContent = 'SENDING...';
        sendBtn.style.cursor = 'not-allowed';
    }

    // Hide loading state
    function hideLoadingState() {
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        sendBtn.textContent = 'SEND MESSAGE';
        sendBtn.style.cursor = 'pointer';
    }

    // Reset form
    function resetForm() {
        contactForm.reset();
        resetErrorStates();
        
        // Hide any existing messages
        const errorDiv = document.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
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
    });

    // Add smooth scroll effect for form focus
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
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'all 0.3s ease';
        });

        wrapper.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Character counter for message field
    const maxLength = 500;
    const charCounter = document.createElement('div');
    charCounter.style.cssText = `
        color: #808080;
        font-size: 1.2rem;
        text-align: right;
        margin-top: 0.5rem;
    `;
    charCounter.textContent = `0/${maxLength}`;
    messageInput.parentNode.insertBefore(charCounter, messageInput.nextSibling);

    messageInput.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            charCounter.style.color = '#ff4444';
        } else if (currentLength > maxLength * 0.7) {
            charCounter.style.color = '#ffaa00';
        } else {
            charCounter.style.color = '#808080';
        }
    });
});