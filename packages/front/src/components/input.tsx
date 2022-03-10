import * as React from 'react';
import cls from '../styles/components/input.module.scss';
import { forwardRef } from 'react';

export interface InputProps {
    testId?: string;
    trailingElement?: React.ReactNode;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    className?: string;
    onChange?: (newValue: string) => void;
    value?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            trailingElement,
            type = 'text',
            placeholder,
            className,
            onChange,
            value,
            onBlur,
            onFocus,
            testId,
            disabled,
        },
        ref
    ) => {
        return (
            <div
                className={`${cls.input} ${className ?? ''}`}
                onBlur={onBlur}
                onFocus={onFocus}
            >
                <input
                    data-test-id={testId}
                    ref={ref}
                    disabled={disabled}
                    // onBlur={onBlur}
                    // onFocus={onFocus}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    type={type}
                    placeholder={placeholder}
                    className={cls.input__field}
                />
                {trailingElement && (
                    <div className={cls.input__trailing}>{trailingElement}</div>
                )}
            </div>
        );
    }
);
