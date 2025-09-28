import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Microsoft Flat Button Component
 * 
 * A reusable button component that implements Microsoft's flat design principles.
 * Can be used as a regular button or as a Link component for navigation.
 * 
 * @param {string} variant - Button style variant (primary, secondary, success, danger, warning, info, light, dark, outline-primary, outline-secondary)
 * @param {string} size - Button size (sm, lg, or default)
 * @param {boolean} disabled - Whether the button is disabled
 * @param {boolean} loading - Whether to show loading state
 * @param {string} href - If provided, renders as Link component
 * @param {string} type - Button type (button, submit, reset)
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @param {object} children - Button content
 */
export default function FlatButton({
    variant = 'primary',
    size = '',
    disabled = false,
    loading = false,
    href = null,
    type = 'button',
    onClick,
    className = '',
    children,
    ...props
}) {
    // Construct CSS classes
    const baseClasses = 'btn-flat';
    const variantClass = `btn-flat-${variant}`;
    const sizeClass = size ? `btn-flat-${size}` : '';
    const additionalClasses = [baseClasses, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(' ');

    // Button content with loading state
    const buttonContent = loading ? (
        <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading...
        </>
    ) : (
        children
    );

    // Render as Link if href is provided
    if (href) {
        return (
            <Link
                href={href}
                className={additionalClasses}
                {...props}
            >
                {buttonContent}
            </Link>
        );
    }

    // Render as button
    return (
        <button
            type={type}
            className={additionalClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {buttonContent}
        </button>
    );
}

/**
 * Pre-configured flat button variants for common use cases
 */

// Primary action button
export const PrimaryFlatButton = (props) => (
    <FlatButton variant="primary" {...props} />
);

// Secondary action button
export const SecondaryFlatButton = (props) => (
    <FlatButton variant="secondary" {...props} />
);

// Success action button
export const SuccessFlatButton = (props) => (
    <FlatButton variant="success" {...props} />
);

// Danger action button
export const DangerFlatButton = (props) => (
    <FlatButton variant="danger" {...props} />
);

// Warning action button
export const WarningFlatButton = (props) => (
    <FlatButton variant="warning" {...props} />
);

// Info action button
export const InfoFlatButton = (props) => (
    <FlatButton variant="info" {...props} />
);

// Light action button
export const LightFlatButton = (props) => (
    <FlatButton variant="light" {...props} />
);

// Dark action button
export const DarkFlatButton = (props) => (
    <FlatButton variant="dark" {...props} />
);

// Outline primary button
export const OutlinePrimaryFlatButton = (props) => (
    <FlatButton variant="outline-primary" {...props} />
);

// Outline secondary button
export const OutlineSecondaryFlatButton = (props) => (
    <FlatButton variant="outline-secondary" {...props} />
);