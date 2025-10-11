# Subscription Modal Component

A reusable subscription modal component built with SweetAlert2 for the Edatsu Media application.

## Overview

This component provides a standardized subscription modal that can be used across different pages in the application. It features a clean, modern design with form validation, loading states, and comprehensive error handling.

## Features

- 🎨 Modern, responsive design with clean styling
- 📝 Form validation for first name, last name, and email
- 🔄 Loading states with visual feedback
- ⚠️ Comprehensive error handling for different API responses
- ✅ Success confirmation with custom styling
- 🎛️ Highly customizable through options parameter
- 🔒 Built-in security messaging

## Usage

### Basic Import

```javascript
import { showSubscriptionModal, showToolsSubscriptionModal, showOpportunitiesSubscriptionModal } from '@/Components/SubscriptionModal';
```

### Pre-configured Variants

#### For Tools Page
```javascript
// Use the pre-configured tools variant
<button onClick={showToolsSubscriptionModal}>
    Subscribe to Tools
</button>
```

#### For Opportunities Page
```javascript
// Use the pre-configured opportunities variant
<button onClick={showOpportunitiesSubscriptionModal}>
    Subscribe to Opportunities
</button>
```

### Custom Configuration

```javascript
// Fully customizable modal
const handleCustomSubscription = () => {
    showSubscriptionModal({
        title: "Custom Newsletter",
        description: "Get our custom content delivered weekly",
        emailPlaceholder: "Enter your email address",
        successTitle: "Welcome aboard!",
        successMessage: "You'll receive our newsletter every week",
        submitButtonText: "Join Newsletter",
        loadingText: "Joining...",
        modalClass: "custom-modal-class",
        endpoint: "/custom-subscribe"
    });
};
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Subscribe" | Modal title text |
| `description` | string | "Get the latest updates delivered to your inbox" | Description text below title |
| `emailPlaceholder` | string | "Enter your email" | Placeholder for email input |
| `successTitle` | string | "Successfully Subscribed!" | Success modal title |
| `successMessage` | string | "You'll receive the latest updates directly in your inbox." | Success modal message |
| `submitButtonText` | string | "Subscribe Now" | Submit button text |
| `loadingText` | string | "Subscribing..." | Loading button text |
| `modalClass` | string | "subscription-modal-popup" | Custom CSS class for modal |
| `endpoint` | string | "/subscribe" | API endpoint for subscription |

## API Integration

The modal expects the subscription endpoint to:

### Request Format
```javascript
{
    first_name: "John",
    last_name: "Doe", 
    email: "john@example.com"
}
```

### Success Response
```javascript
{
    success: true,
    message: "Subscription successful"
}
```

### Error Responses

#### Validation Errors (422)
```javascript
{
    errors: {
        email: ["The email field is required."]
    },
    first_error: "The email field is required."
}
```

#### Conflict/Duplicate (409)
```javascript
{
    message: "This email is already subscribed."
}
```

## Styling

The component uses inline styles for consistency but includes CSS classes for customization:

- `subscription-modal-popup` - Default modal class
- `auth-modal-popup` - Alternative modal class for opportunities
- `compact-swal-popup` - Success/error modal class
- `compact-swal-title` - Success/error title class
- `compact-swal-content` - Success/error content class
- `compact-swal-button` - Success/error button class

## Migration from Inline Modals

### Before (Inline Implementation)
```javascript
// Old approach - duplicated code
const showSubscriptionModal = () => {
    Swal.fire({
        // ... lots of duplicated HTML and logic
    });
};
```

### After (Reusable Component)
```javascript
// New approach - clean and reusable
import { showToolsSubscriptionModal } from '@/Components/SubscriptionModal';

// Simply call the function
<button onClick={showToolsSubscriptionModal}>Subscribe</button>
```

## Dependencies

- SweetAlert2
- Axios (for API calls)

## Browser Compatibility

Compatible with all modern browsers that support:
- ES6+ features
- CSS Flexbox
- CSS Grid (for responsive design)
- Fetch API or XMLHttpRequest

## Contributing

When adding new subscription modal variants:

1. Create a new pre-configured function in `SubscriptionModal.js`
2. Export it from the module
3. Update this documentation with usage examples
4. Ensure consistent styling and error handling

## Examples in the Codebase

- **Toolshed Page**: `resources/js/Pages/Toolshed.jsx`
- **Opportunities Page**: `resources/js/Pages/Opportunities.jsx`