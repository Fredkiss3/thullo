import * as React from 'react';
import cls from '../styles/components/dropdown.module.scss';

export interface DropdownProps {
    children: React.ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    children,
    className,
    align = 'left',
}) => {
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
};
