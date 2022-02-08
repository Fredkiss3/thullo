import * as React from 'react';
import { getInitials } from '../lib/functions';
import cls from '../styles/components/avatar.module.scss';

export interface AvatarProps {
    photoURL?: string;
    className?: string;
    name: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    photoURL,
    className,
    name,
}) => (
    <div className={`${cls.avatar} ${className ?? ''}`}>
        {photoURL ? (
            <img
                src={photoURL}
                alt={`Photo de ${name}`}
                className={cls.avatar__image}
            />
        ) : (
            <span className={cls.avatar__placeholder}>{getInitials(name)}</span>
        )}
    </div>
);
