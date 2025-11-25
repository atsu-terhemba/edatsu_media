import Swal from 'sweetalert2';
import axios from 'axios';

/**
 * Reusable subscription modal using SweetAlert2
 * @param {Object} options - Configuration options for the modal
 * @param {string} options.title - Modal title (default: "Subscribe")
 * @param {string} options.description - Modal description text
 * @param {string} options.emailPlaceholder - Email input placeholder (default: "Enter your email")
 * @param {string} options.successTitle - Success modal title (default: "Successfully Subscribed!")
 * @param {string} options.successMessage - Success modal message
 * @param {string} options.submitButtonText - Submit button text (default: "Subscribe Now")
 * @param {string} options.loadingText - Loading button text (default: "Subscribing...")
 * @param {string} options.modalClass - Custom CSS class for modal styling (default: "subscription-modal-popup")
 * @param {string} options.endpoint - API endpoint for subscription (default: "/subscribe")
 * @param {string} options.subscriptionType - Type of subscription: 'opportunities' or 'tools' (optional)
 */
export const showSubscriptionModal = (options = {}) => {
    const {
        title = "Subscribe",
        description = "Get the latest updates delivered to your inbox",
        emailPlaceholder = "Enter your email",
        successTitle = "Successfully Subscribed!",
        successMessage = "You'll receive the latest updates directly in your inbox.",
        submitButtonText = "Subscribe Now",
        loadingText = "Subscribing...",
        modalClass = "subscription-modal-popup",
        endpoint = "/subscribe",
        subscriptionType = null
    } = options;

    Swal.fire({
        title: '',
        html: `
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">${title}</h3>
                <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    ${description}
                </p>
                            
                <form id="subscription-form" style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <input type="text" id="firstName" name="firstName" placeholder="First name" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <input type="text" id="lastName" name="lastName" placeholder="Last name" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <input type="email" id="email" name="email" placeholder="${emailPlaceholder}" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <button type="submit" id="subscribe-btn"
                            style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                        ${submitButtonText}
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        🔒 Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '480px',
        padding: '0',
        background: 'white',
        customClass: {
            popup: modalClass,
            closeButton: 'subscription-modal-close'
        },
        didOpen: () => {
            const form = document.getElementById('subscription-form');
            const subscribeBtn = document.getElementById('subscribe-btn');
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                
                // Disable button and show loading state
                subscribeBtn.disabled = true;
                subscribeBtn.innerHTML = loadingText;
                
                try {
                    const response = await axios.post(endpoint, {
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        subscription_type: subscriptionType // Include subscription type (opportunities/tools)
                    });
                    
                    if (response.data.success) {
                        // Close the modal first
                        Swal.close();
                        
                        // Show toast notification
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 4000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        Toast.fire({
                            icon: "success",
                            title: successTitle,
                            text: successMessage
                        });
                    }
                } catch (error) {
                    console.error('Subscription error:', error);
                    
                    let errorMessage = 'An error occurred. Please try again.';
                    
                    // Handle different error scenarios
                    if (error.response && error.response.status === 422) {
                        const errors = error.response.data.errors;
                        if (errors) {
                            errorMessage = error.response.data.first_error || Object.values(errors)[0][0];
                        }
                    } else if (error.response && error.response.status === 409) {
                        errorMessage = error.response.data.message || 'This email is already subscribed.';
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                    
                    // Show toast notification for error
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    Toast.fire({
                        icon: "error",
                        title: "Subscription Failed",
                        text: errorMessage
                    });
                    
                    // Reset button
                    subscribeBtn.disabled = false;
                    subscribeBtn.innerHTML = submitButtonText;
                }
            });
        }
    });
};

// Pre-configured modal variants for common use cases
export const showToolsSubscriptionModal = () => {
    showSubscriptionModal({
        description: "Get the latest tools delivered to your inbox",
        successMessage: "You'll receive the latest tools and updates directly in your inbox.",
        modalClass: "subscription-modal-popup",
        subscriptionType: "tools"
    });
};

export const showOpportunitiesSubscriptionModal = () => {
    showSubscriptionModal({
        description: "Get opportunities delivered to your inbox",
        successTitle: "Subscribed!",
        successMessage: "You'll receive opportunities in your inbox",
        submitButtonText: "Subscribe",
        modalClass: "auth-modal-popup",
        subscriptionType: "opportunities"
    });
};

export default { showSubscriptionModal, showToolsSubscriptionModal, showOpportunitiesSubscriptionModal };