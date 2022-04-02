import * as React from 'react';
import { Color } from '@/lib/types';
import { clsx } from '@/lib/functions';

import cls from '@/styles/components/tag.module.scss';
import { Icon } from './icon';
import { TAG_COLORS } from '@/lib/constants';

export interface TagProps {
    color: Lowercase<Color>;
    text: string;
    closeable?: boolean;
    rounded?: boolean;
    onClose?: () => void;
}

export function Tag({
    color,
    text,
    onClose,
    closeable = false,
    rounded = true,
}: TagProps) {
    return (
        <small
            className={clsx(cls.tag, {
                [cls[`tag--rounded`]]: rounded,
                [cls[`tag--closeable`]]: closeable,
            })}
            onClick={onClose}
            style={{
                // @ts-ignore
                '--bg-color': !closeable
                    ? TAG_COLORS[color].bg
                    : color === 'lightgrey'
                    ? 'var(--text-color)'
                    : '#fff',
                '--fg-color': TAG_COLORS[color].fg,
            }}
        >
            {text}

            {closeable && (
                <Icon icon="x-icon" className={cls.tag__close_icon} />
            )}
        </small>
    );
}
