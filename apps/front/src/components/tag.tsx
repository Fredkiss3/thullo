import * as React from 'react';
import { Color } from '@/lib/types';
import { clsx } from '@/lib/functions';

import cls from '@/styles/components/tag.module.scss';
import { Icon } from './icon';
import { TAG_COLORS } from '@/lib/constants';

export interface TagProps {
    color: Color;
    text: string;
    rounded?: boolean;
    selected?: boolean;
    onRemove?: () => void;
    onSelect?: () => void;
    disabled?: boolean;
}

export function Tag({
    color,
    text,
    onRemove,
    onSelect,
    selected = false,
    rounded = true,
    disabled = false,
}: TagProps) {
    const Element = !!onRemove || !!onSelect ? 'button' : 'small';

    return (
        <Element
            disabled={disabled}
            className={clsx(cls.tag, {
                [cls[`tag--rounded`]]: rounded,
                [cls[`tag--disabled`]]: disabled,
                [cls[`tag--closeable`]]: !!onRemove,
                [cls[`tag--selectable`]]: !!onSelect,
                [cls[`tag--selected`]]: !!onSelect && selected,
            })}
            onClick={onRemove || onSelect}
            style={{
                // @ts-ignore
                '--bg-color': TAG_COLORS[color].bg,
                '--text-color': !onRemove
                    ? TAG_COLORS[color].bg
                    : color === 'LIGHTGREY'
                    ? 'var(--text-color)'
                    : '#fff',
                '--fg-color': TAG_COLORS[color].fg,
            }}
        >
            {text}

            {!!onRemove && !disabled && (
                <Icon icon="x-icon" className={cls.tag__close_icon} />
            )}

            {!!onSelect && selected && (
                <Icon icon="check" className={cls.tag__selected_icon} />
            )}
        </Element>
    );
}
