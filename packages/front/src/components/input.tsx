import * as React from 'react';
import cls from '../styles/components/input.module.scss';

export interface InputProps {
    trailingElement?: React.ReactNode;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    trailingElement,
    type = 'text',
    placeholder,
    className,
}) => {
    return (
        <div className={`${cls.input} ${className ?? ''}`}>
            <input type={type} placeholder={placeholder} />
            {trailingElement && <div>{trailingElement}</div>}
        </div>
    );
};
