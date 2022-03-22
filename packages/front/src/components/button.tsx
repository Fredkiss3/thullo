import * as React from 'react';
import { forwardRef } from 'react';
import cls from '@/styles/components/button.module.scss';
import { clsx } from '@/lib/functions';

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
    style?: React.CSSProperties;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant,
            renderLeadingIcon,
            renderTrailingIcon,
            onClick,
            className,
            size,
            ariaLabel,
            testId,
            style,
            type = 'button',
            isStatic = false,
            disabled = false,
            square = false,
            block = false,
        },
        ref
    ) => {
        return (
            <button
               style={style}
                data-test-id={testId}
                ref={ref}
                type={type}
                disabled={disabled}
                onClick={onClick}
                aria-label={ariaLabel}
                className={clsx(
                    cls.btn,
                    cls[`btn--${variant}`],
                    cls[`btn--${size}`],
                    className,
                    {
                        [cls['btn--disabled']]: disabled,
                        [cls['btn--static']]: isStatic,
                        [cls['btn--square']]: square,
                        [cls['btn--block']]: block,
                    }
                )}
            >
                {renderLeadingIcon && renderLeadingIcon(cls.btn__leading_icon)}
                {children}
                {renderTrailingIcon &&
                    renderTrailingIcon(cls.btn__trailing_icon)}
            </button>
        );
    }
);
