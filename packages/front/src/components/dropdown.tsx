import * as React from 'react';
import cls from '../styles/components/dropdown.module.scss';
import { clsx } from '@/lib/functions';

export interface DropdownProps {
    testId?: string;
    children?: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export function Dropdown({
    children,
    className,
    align = 'left',
    testId,
}: DropdownProps) {
    return (
        <div
            data-test-id={testId}
            className={clsx(className, cls.dropdown, cls[`dropdown--${align}`])}
        >
            {children}
        </div>
    );
}
