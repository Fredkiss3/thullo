import * as React from 'react';

import { List as ListType, ListWithId, CardWithId } from '@/lib/types';
import cls from '@/styles/components/list.module.scss';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { useToastContext } from '@/context/toast.context';
import { Card, CardProps } from './card';
import { useState } from 'react';
import { AddCardForm } from './addcard-form';
import { clsx } from '@/lib/functions';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

export interface ListProps {
    list: ListType;
    boardId: string;
    className?: string;
    isUserParticipant: boolean;
}

function isListWithId(list: ListType): list is ListWithId {
    return list.id !== undefined;
}

export function List({ list, className, ...props }: ListProps) {
    const { dispatch } = useToastContext();

    return (
        <div className={clsx(cls.list, className)}>
            <div className={cls.list__header}>
                <span>{list.name}</span>
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
            {isListWithId(list) ? (
                <CardSection {...props} list={list} />
            ) : (
                // Render an empty list
                <ul className={cls.list__cards} />
            )}
        </div>
    );
}
export interface CardSectionProps extends ListProps {
    list: ListWithId;
}

export function CardSection({
    list,
    boardId,
    isUserParticipant,
}: CardSectionProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);

    const { setNodeRef } = useDroppable({
        id: list.id,
    });

    const cardsWithId: CardWithId[] = list.cards.filter(
        (card) => card.id !== undefined
    ) as CardWithId[];
    const cardsWithoutId = list.cards.filter((card) => card.id === undefined);

    return (
        <div className={cls.list__cards} ref={setNodeRef}>
            {/* Only cards with ids are sortable */}
            <SortableContext
                id={list.id}
                items={cardsWithId.map(({ id }) => ({ id }))}
                strategy={verticalListSortingStrategy}
            >
                {cardsWithId.map((card, index) => (
                    <SortableCard
                        listId={list.id}
                        index={index}
                        key={card.id}
                        card={card}
                        boardId={boardId}
                    />
                ))}
            </SortableContext>

            {cardsWithoutId.map((card, index) => (
                <Card key={index} card={card} boardId={boardId} />
            ))}

            {isUserParticipant &&
                (!isAddingCard ? (
                    <Button
                        testId="add-list-btn"
                        className={cls.add_button}
                        onClick={() => setIsAddingCard(true)}
                        variant={`primary-hollow`}
                    >
                        <span>
                            {list.cards.length === 0
                                ? 'Add a card'
                                : 'Add another card'}
                        </span>
                        <Icon icon="plus" className={cls.add_button__icon} />
                    </Button>
                ) : (
                    <AddCardForm
                        listId={list.id!}
                        boardId={boardId}
                        onCancel={() => setIsAddingCard(false)}
                    />
                ))}
        </div>
    );
}

interface SortableCardProps extends CardProps {
    card: CardWithId;
    listId: string;
    index: number;
}

function SortableCard({ card, index, listId, ...props }: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            card,
            index,
            listId,
        },
    });

    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            {...props}
            style={style}
            isDragging={isDragging}
            card={card}
            otherProps={{ ...listeners, ...attributes }}
        />
    );
}
