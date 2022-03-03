import * as React from 'react';
import cls from '../styles/components/input.module.scss';

export interface InputProps {
    trailingElement?: React.ReactNode;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    className?: string;
    onChange?: (newValue: string) => void;
    value?: string;
    onBlur?: () => void;
    onFocus?: () => void;
}

export function Input({
    trailingElement,
    type = 'text',
    placeholder,
    className,
    onChange,
    value,
    onBlur,
    onFocus,
}: InputProps) {
    return (
        <div className={`${cls.input} ${className ?? ''}`}>
            <input
                onBlur={onBlur}
                onFocus={onFocus}
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
