import * as React from 'react';
import cls from '../styles/components/pulse.module.scss';

export interface PulseProps {
    classNames?: string;
}

export const Pulse: React.FC<PulseProps> = ({ children, classNames }) => {
    return (
        <div className={`${cls.pulseWrapper} ${classNames ?? ''}`}>
            {children}
        </div>
    );
};
