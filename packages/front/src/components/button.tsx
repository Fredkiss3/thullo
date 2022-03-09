import * as React from 'react';
import { forwardRef } from 'react';
import cls from '@/styles/components/button.module.scss';

export const ButtonVariants = [
    'primary',
    'outline',
    'hollow',
    'black',
    'danger',
    'danger-hollow',
    'primary-hollow',
    'success',
] as const;

export const ButtonSizes = ['small', 'medium', 'large'] as const;

export interface ButtonProps {
    testId?: string;
    variant?: typeof ButtonVariants[number];
    disabled?: boolean;
    renderLeadingIcon?: (classNames: string) => JSX.Element;
    renderTrailingIcon?: (classNames: string) => JSX.Element;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    size?: typeof ButtonSizes[number];
    isStatic?: boolean;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
    square?: boolean;
    block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant,
            disabled,
            renderLeadingIcon,
            renderTrailingIcon,
            onClick,
            className,
            size,
            isStatic = false,
            type = 'button',
            ariaLabel,
            square = false,
            block = false,
            testId,
        },
        ref
    ) => {
        return (
            <button
                data-test-id={testId}
                ref={ref}
                type={type}
                disabled={disabled}
                onClick={onClick}
                aria-label={ariaLabel}
                className={`
                    ${cls.btn} 
                    ${cls[`btn--${variant}`]} 
                    ${cls[`btn--${size}`]}
                    ${disabled && cls['btn--disabled']}
                    ${className ?? ''}
                    ${isStatic && cls['btn--static']}
                    ${square && cls['btn--square']}
                    ${block && cls['btn--block']}
            `}
            >
                {renderLeadingIcon && renderLeadingIcon(cls.btn__leading_icon)}
                {children}
                {renderTrailingIcon &&
                    renderTrailingIcon(cls.btn__trailing_icon)}
            </button>
        );
    }
);
