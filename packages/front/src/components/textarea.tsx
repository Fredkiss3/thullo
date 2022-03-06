import * as React from 'react';
import cls from '../styles/components/textarea.module.scss';

export interface TextAreaProps {
    placeholder?: string;
    className?: string;
    onChange?: (newValue: string) => void;
    value?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    rows?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        { placeholder, className, onChange, value, onBlur, onFocus, rows = 5 },
        ref
    ) => {
        return (
            <div
                className={`${cls.textarea} ${className ?? ''}`}
                onBlur={onBlur}
                onFocus={onFocus}
            >
                <textarea
                    ref={ref}
                    // onBlur={onBlur}
                    // onFocus={onFocus}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder={placeholder}
                    className={cls.textarea__field}
                    rows={rows}
                />
            </div>
        );
    }
);
