import * as React from 'react';
import { clsx } from '@/lib/functions';
import { Card as CardType } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Icon } from './icon';

import cls from '@/styles/components/card.module.scss';

export interface CardProps {
    card: CardType;
    boardId: string;
    style?: React.CSSProperties;
    isDragging?: boolean;
    isOverlay?: boolean;
    isPlaceholder?: boolean;
    dragDisabled?: boolean;
    otherProps?: any;
}

export const Card = React.forwardRef<HTMLAnchorElement, CardProps>(
    (
        {
            card: { id, title },
            boardId,
            style,
            otherProps,
            dragDisabled = false,
            isDragging = false,
            isOverlay = false,
        },
        ref
    ) => {
        const Tag = id ? Link : (props: any) => <div {...props} />;
        return (
            <>
                <Tag
                    ref={ref}
                    style={style}
                    className={clsx(cls.card, {
                        [cls[`card--dragging`]]: isDragging,
                        [cls[`card--overlay`]]: isOverlay,
                    })}
                    to={`/dashboard/${boardId}/card/${id}`}
                >
                    <span className={cls.card__title}>{title}</span>
                    {!dragDisabled && (
                        <button
                            className={cls.card__drag_handle}
                            {...otherProps}
                        >
                            <Icon
                                icon="drag-handle"
                                className={cls.card__drag_handle__icon}
                            />
                        </button>
                    )}
                    <Button
                        square
                        isStatic
                        disabled={!id || isDragging}
                        className={cls.card__button}
                        variant="primary"
                        renderTrailingIcon={(clsx) => (
                            <Icon icon="plus" className={clsx} />
                        )}
                    />
                </Tag>
            </>
        );
    }
);
