import * as React from 'react';
import { TextAreaProps } from '@/components/textarea';

import cls from '@/styles/components/textarea-autogrow.module.scss';
import { clsx } from '@/lib/functions';

export interface TextareaAutogrowProps extends Omit<TextAreaProps, 'rows'> {
    minHeight?: number;
    style?: Record<string, string | number | boolean | null>;
}

export const TextareaAutogrow = React.forwardRef<
    HTMLTextAreaElement,
    TextareaAutogrowProps
>(
    (
        {
            className,
            value,
            onChange,
            placeholder,
            onBlur,
            onFocus,
            minHeight = 100,
            style,
        },
        ref
    ) => {
        return (
            <div
                className={clsx(cls.autogrow, className)}
                data-replicated-value={value}
                onBlur={onBlur}
                onFocus={onFocus}
                style={{
                    ...style,
                    // @ts-ignore
                    '--min-height': `${minHeight}px`,
                }}
            >
                <textarea
                    value={value}
                    ref={ref}
                    placeholder={placeholder}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            </div>
        );
    }
);
