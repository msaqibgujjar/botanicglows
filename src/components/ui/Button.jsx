import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    type = 'button',
    fullWidth = false,
    disabled = false,
    ...props
}) => {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'bg-secondary text-primary-dark hover:bg-opacity-80',
        outline: 'btn-outline',
        ghost: 'hover:bg-gray-100 text-text-main'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
