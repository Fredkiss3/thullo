import {
    List as ListType,
    Card as CardType,
    DraggableDestination,
} from '@/lib/types';
import cls from '@/styles/components/list.module.scss';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { useToastContext } from '@/context/toast.context';
import { Card } from './card';
import { useState } from 'react';
import { AddCardForm } from './addcard-form';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { clsx } from '@/lib/functions';

export interface ListProps {
    list: ListType;
    boardId: string;
    className?: string;
    isUserParticipant: boolean;
    dragDestination: DraggableDestination | null;
}

type CardOrPlaceholder =
    | CardType
    | {
          id: 'placeholder';
      };

function isCard(el: CardOrPlaceholder): el is CardType {
    return el.id !== 'placeholder';
}

export function List({
    list: { id, cards, name },
    className,
    boardId,
    isUserParticipant,
    dragDestination,
}: ListProps) {
    const { dispatch } = useToastContext();
    const [isAddingCard, setIsAddingCard] = useState(false);

    return (
        <div className={`${cls.list} ${className ?? ''}`}>
            <div className={cls.list__header}>
                <span>{name}</span>
                <Button
                    square
                    renderTrailingIcon={(cls) => (
                        <Icon icon="h-dots" className={cls} />
                    )}
                    onClick={() => {
                        dispatch({
                            type: 'ADD_WARNING',
                            key: 'list',
                            message: 'This feature is not implemented yet',
                        });
                    }}
                />
            </div>

            {id ? (
                <Droppable droppableId={id}>
                    {(droppableProvided, droppableSnapshot) => {
                        return (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                className={cls.list__cards}
                            >
                                {cards.map((card, index) =>
                                    card.id && isUserParticipant ? (
                                        <Draggable
                                            draggableId={card.id}
                                            index={index}
                                            key={card.id}
                                        >
                                            {(
                                                draggableProvided,
                                                draggableSnapshot
                                            ) => {
                                                return (
                                                    <Card
                                                        isDragging={
                                                            draggableSnapshot.isDragging
                                                        }
                                                        draggableProps={
                                                            draggableProvided.draggableProps
                                                        }
                                                        dragHandleProps={
                                                            draggableProvided.dragHandleProps
                                                        }
                                                        ref={
                                                            draggableProvided.innerRef
                                                        }
                                                        style={{
                                                            ...draggableProvided
                                                                .draggableProps
                                                                .style,
                                                            transform: clsx(
                                                                draggableProvided
                                                                    .draggableProps
                                                                    .style
                                                                    ?.transform,
                                                                {
                                                                    'rotate(2.81deg)':
                                                                        draggableSnapshot.isDragging &&
                                                                        !draggableSnapshot.isDropAnimating,
                                                                }
                                                            ),
                                                        }}
                                                        card={card}
                                                        boardId={boardId}
                                                    />
                                                );
                                            }}
                                        </Draggable>
                                    ) : (
                                        <Card card={card} boardId={boardId} />
                                    )
                                )}

                                {droppableSnapshot.isDraggingOver &&
                                    droppableProvided.placeholder}

                                {!droppableSnapshot.isDraggingOver &&
                                    isUserParticipant &&
                                    (!isAddingCard ? (
                                        <Button
                                            testId="add-list-btn"
                                            className={cls.add_button}
                                            onClick={() =>
                                                setIsAddingCard(true)
                                            }
                                            variant={`primary-hollow`}
                                        >
                                            <span>
                                                {cards.length === 0
                                                    ? 'Add a card'
                                                    : 'Add another card'}
                                            </span>
                                            <Icon
                                                icon="plus"
                                                className={cls.add_button__icon}
                                            />
                                        </Button>
                                    ) : (
                                        <AddCardForm
                                            listId={id!}
                                            boardId={boardId}
                                            onCancel={() =>
                                                setIsAddingCard(false)
                                            }
                                        />
                                    ))}
                            </div>
                        );
                    }}
                </Droppable>
            ) : (
                // Render an empty list
                <ul className={cls.list__cards} />
            )}
        </div>
    );
}
