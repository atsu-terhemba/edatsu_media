import React, { useCallback, useState } from 'react';


const ClickEffectButton = (({
  children,
  className = '',
  variant = 'primary',
  size,
  disabled,
  loading = false,
  type=null,
  onClick,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback((e) => {
    if (disabled || loading || isAnimating) return;

    setIsAnimating(true);
    onClick?.(e);

    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  }, [disabled, loading, isAnimating, onClick]);

  // Construct Bootstrap classes
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    isAnimating && 'btn-pressed',
    loading && 'disabled',
    className
  ].filter(Boolean).join(' ');

  // Add custom CSS for the pressed effect
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .btn-pressed {
        transform: scale(0.95);
        transition: transform 0.2s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Loading...
        </>
      ) : children}
    </button>
  );
});

ClickEffectButton.displayName = 'ClickEffectButton';

export default ClickEffectButton;