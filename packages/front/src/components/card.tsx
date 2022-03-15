import * as React from 'react';
import cls from '@/styles/components/card.module.scss';
import { Card as CardType } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Icon } from './icon';
import { Draggable } from 'react-beautiful-dnd';

export interface CardProps {
    card: CardType;
    boardId: string;
    index: number;
}

export function Card({ card: { id, title }, boardId, index }: CardProps) {
    return (
        <>
            {id ? (
                <Draggable draggableId={id} index={index}>
                    {(provided, snapshot) => {
                        return (
                            <Link
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${cls.card}`}
                                to={`/dashboard/${boardId}/card/${id}`}
                                style={{
                                    ...provided.draggableProps.style,
                                    transform: `${
                                        provided.draggableProps.style
                                            ?.transform ?? ''
                                    } ${
                                        snapshot.isDragging && !snapshot.isDropAnimating
                                            ? 'rotate(2.81deg)'
                                            : ''
                                    }`,
                                }}
                            >
                                <span className={cls.card__title}>{title}</span>

                                <Button
                                    square
                                    isStatic
                                    className={cls.card__button}
                                    variant="primary"
                                    renderTrailingIcon={(clsx) => (
                                        <Icon
                                            icon="plus"
                                            className={`${clsx} ${cls.card__button__icon}`}
                                        />
                                    )}
                                />
                            </Link>
                        );
                    }}
                </Draggable>
            ) : (
                <div className={cls.card}>
                    <span className={cls.card__title}> {title}</span>

                    <Button
                        square
                        isStatic
                        disabled
                        className={cls.card__button}
                        variant="primary"
                        renderTrailingIcon={(clsx) => (
                            <Icon
                                icon="plus"
                                className={`${clsx} ${cls.card__button__icon}`}
                            />
                        )}
                    />
                </div>
            )}
        </>
    );
}
