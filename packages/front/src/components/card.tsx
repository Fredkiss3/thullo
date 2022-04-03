import * as React from 'react';
import { clsx } from '@/lib/functions';
import { Card as CardType } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Icon } from './icon';
import { Tag as TagComponent } from './tag';

import cls from '@/styles/components/card.module.scss';

export interface CardProps {
    card: CardType;
    boardId: string;
    style?: React.CSSProperties;
    isDragging?: boolean;
    isOverlay?: boolean;
    isPlaceholder?: boolean;
    dragEnabled?: boolean;
    otherProps?: any;
}

export const Card = React.forwardRef<HTMLAnchorElement, CardProps>(
    (
        {
            card: { id, title, coverURL, labels },
            boardId,
            style,
            otherProps,
            dragEnabled = true,
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
                    {coverURL && (
                        <img
                            className={cls.card__cover}
                            src={coverURL}
                            alt={`${title} cover`}
                        />
                    )}

                    <span className={cls.card__title}>{title}</span>

                    <ul className={cls.card__tags}>
                        {labels.map((label) => (
                            <li key={label.id} className={cls.card__tag}>
                                <TagComponent
                                    color={label.color}
                                    text={label.name}
                                />
                            </li>
                        ))}
                    </ul>

                    {dragEnabled && id !== undefined && (
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
