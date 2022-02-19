import * as React from 'react';
import cls from '../styles/components/pulse.module.scss';

export interface PulseProps {
    classNames?: string;
}

export function Pulse({ children, classNames }: PulseProps) {
    return (
        <div className={`${cls.pulseWrapper} ${classNames ?? ''}`}>
            {children}
        </div>
    );
}
