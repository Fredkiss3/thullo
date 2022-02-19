import * as React from 'react';
import cls from '../styles/components/dropdown.module.scss';

export interface DropdownProps {
    children: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export function Dropdown({
    children,
    className,
    align = 'left',
}: DropdownProps) {
    return (
        <div
            className={`
                ${className ?? ''}
                ${cls.dropdown} 
                ${cls[`dropdown--${align}`]}
            `}
        >
            {children}
        </div>
    );
}
