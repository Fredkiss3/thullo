import { List as ListType } from '@/lib/types';
import cls from '@/styles/components/list.module.scss';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { useToastContext } from '@/context/toast.context';
import { Card } from './card';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { TextArea } from './textarea';
import { useAddCardMutation } from '@/lib/queries';
import { AddCardForm } from './addcard-form';

export interface ListProps {
    list: ListType;
    boardId: string;
    className?: string;
}

export function List({
    list: { id, cards, name },
    className,
    boardId,
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
            <ul className={cls.list__cards}>
                {cards.map((card) => (
                    <li key={card.id}>
                        <Card boardId={boardId} card={card} />
                    </li>
                ))}

                {id && (
                    <li>
                        {!isAddingCard ? (
                            <Button
                                testId="add-list-btn"
                                className={cls.add_button}
                                onClick={() => setIsAddingCard(true)}
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
                                onCancel={() => setIsAddingCard(false)}
                            />
                        )}
                    </li>
                )}
            </ul>
        </div>
    );
}
