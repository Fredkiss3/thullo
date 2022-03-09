import * as React from 'react';
// Functions & Others
import { getInitials } from '@/lib/functions';

// styles
import cls from '@/styles/components/avatar.module.scss';

export interface AvatarProps {
    photoURL?: string | null;
    className?: string;
    name: string;
    username: string;
}

export function Avatar({ photoURL, className, name, username }: AvatarProps) {
    return (
        <div
            className={`${cls.avatar} ${className ?? ''}`}
            data-test-id="avatar"
        >
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
