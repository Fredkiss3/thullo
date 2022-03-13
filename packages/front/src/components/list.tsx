import { List as ListType, Card as CardType } from '@/lib/types';
import cls from '@/styles/components/list.module.scss';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { useToastContext } from '@/context/toast.context';
import { Card } from './card';
import { useState } from 'react';
import { AddCardForm } from './addcard-form';
import { Droppable } from 'react-beautiful-dnd';

export interface ListProps {
    list: ListType;
    boardId: string;
    className?: string;
    isUserParticipant: boolean;
    dragDestination: {
        listId: string;
        position: number;
    } | null;
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
                    {(provided, snapshot) => {
                        // insert a placeholder at the dragDestination position

                        console.log({
                            positions: cards
                                .sort((a, b) => a.position - b.position)
                                .map((card) => card.position),
                        });

                        return (
                            <ul
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cls.list__cards}
                            >
                                {cards
                                    .sort((a, b) => a.position - b.position)
                                    .map((card, index) => (
                                        <li key={card.id}>
                                            <Card
                                                boardId={boardId}
                                                card={card}
                                            />
                                        </li>
                                    ))}

                                {/* {snapshot.isDraggingOver && (
                                    <li
                                        className={cls.list__cards__placeholder}
                                    />
                                )} */}

                                {provided.placeholder}

                                {!snapshot.isDraggingOver && isUserParticipant && (
                                    <li>
                                        {!isAddingCard ? (
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
                                                    className={
                                                        cls.add_button__icon
                                                    }
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
                                        )}
                                    </li>
                                )}
                            </ul>
                        );
                    }}
                </Droppable>
            ) : (
                <ul className={cls.list__cards}></ul>
            )}
        </div>
    );
}
