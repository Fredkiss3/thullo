import * as React from 'react';
import { getInitials } from '../lib/functions';
import cls from '../styles/components/avatar.module.scss';

export interface AvatarProps {
    photoURL?: string | null;
    className?: string;
    name: string;
    username: string;
}

export function Avatar({ photoURL, className, name, username }: AvatarProps) {
    return (
        <div className={`${cls.avatar} ${className ?? ''}`}>
            {photoURL ? (
                <img
                    title={`${name} @${username}`}
                    src={photoURL}
                    alt={`Photo de ${name}`}
                    className={cls.avatar__image}
                />
            ) : (
                <span className={cls.avatar__placeholder}>
                    {getInitials(name)}
                </span>
            )}
        </div>
    );
}
