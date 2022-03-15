import * as React from 'react';
import cls from '@/styles/components/card.module.scss';
import { Card as CardType } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Icon } from './icon';

import type {
    DraggableProvidedDraggableProps,
    DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';
import { clsx } from "@/lib/functions";

export interface CardProps {
    card: CardType;
    boardId: string;
    style?: React.CSSProperties;
    draggableProps?: DraggableProvidedDraggableProps;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    isDragging?: boolean;
}

export const Card = React.forwardRef<HTMLAnchorElement, CardProps>(
    (
        {
            card: { id, title },
            boardId,
            style,
            draggableProps,
            dragHandleProps,
            isDragging= false,
        },
        ref
    ) => {
        const Tag = id ? Link : (props: any) => <div {...props} />;
        return (
            <>
                <Tag
                    ref={ref}
                    {...draggableProps}
                    {...dragHandleProps}
                    style={style}
                    className={clsx(cls.card, {
                        [cls[`card--dragging`]]: isDragging,
                    })}
                    to={`/dashboard/${boardId}/card/${id}`}
                >
                    <span className={cls.card__title}>{title}</span>

                    <Button
                        square
                        isStatic
                        disabled={!id}
                        className={cls.card__button}
                        variant="primary"
                        renderTrailingIcon={(clsx) => (
                            <Icon
                                icon="plus"
                                className={`${clsx} ${cls.card__button__icon}`}
                            />
                        )}
                    />
                </Tag>
            </>
        );
    }
);
