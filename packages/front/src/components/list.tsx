import * as React from 'react';

// functions & others
import type { List as ListType, ListWithId, CardWithId } from '@/lib/types';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useDropdownToggle, useOnClickOutside } from '@/lib/hooks';
import { clsx } from '@/lib/functions';
import { useDeleteListMutation, useRenameListMutation } from '@/lib/queries';

// Components
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { Card, CardProps } from '@/components/card';
import { AddCardForm } from '@/components/addcard-form';
import { Dropdown } from '@/components/dropdown';
import { Input } from '@/components/input';

// Styles
import cls from '@/styles/components/list.module.scss';
import { useToastContext } from '@/context/toast.context';

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
    const renameListMutation = useRenameListMutation();
    const deleteListMutation = useDeleteListMutation();
    const { dispatch } = useToastContext();

    // state
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [name, setName] = React.useState(list.name);
    const [ref, isOpen, toggle] = useDropdownToggle();

    const inputRef = React.useRef<HTMLInputElement>(null);

    // focus input on click
    React.useEffect(() => {
        if (isEditingName) {
            inputRef.current?.focus();
        }
    }, [isEditingName]);

    // update list name
    React.useEffect(() => {
        if (list.name) {
            setName(list.name);
        }
    }, [list]);

    return (
        <div className={clsx(cls.list, className)}>
            <div className={cls.list__header}>
                {isEditingName &&
                isListWithId(list) &&
                props.isUserParticipant ? (
                    <Input
                        value={name}
                        onChange={setName}
                        ref={inputRef}
                        onBlur={updateListName}
                    />
                ) : (
                    <span
                        style={{
                            cursor: props.isUserParticipant
                                ? 'pointer'
                                : 'default',
                        }}
                        onClick={() =>
                            props.isUserParticipant && setIsEditingName(true)
                        }
                    >
                        {name}
                    </span>
                )}

                {isListWithId(list) && props.isUserParticipant && (
                    <div className={cls.list__header__dropdown} ref={ref}>
                        <Button
                            square
                            renderTrailingIcon={(cls) => (
                                <Icon icon="h-dots" className={cls} />
                            )}
                            onClick={toggle}
                        />

                        <Dropdown
                            align={'left'}
                            className={clsx(cls.list__header__dropdown__menu, {
                                [cls[`list__header__dropdown__menu--open`]]:
                                    isOpen,
                            })}
                        >
                            <Button
                                variant={`danger-hollow`}
                                onClick={deleteList}
                            >
                                Delete this list
                            </Button>
                        </Dropdown>
                    </div>
                )}
            </div>
            {isListWithId(list) ? (
                <CardSection {...props} list={list} />
            ) : (
                // Render an empty list
                <ul className={cls.list__cards} />
            )}
        </div>
    );

    function updateListName() {
        if (name.trim().length > 0 && name.trim() !== list.name) {
            renameListMutation.mutate({
                boardId: props.boardId,
                listId: list.id!,
                newName: name.trim(),
                oldName: list.name,
                onSuccess: () => {
                    dispatch({
                        type: 'ADD_SUCCESS',
                        key: `board-rename-list-${new Date().getTime()}`,
                        message: 'List renamed successfully',
                    });
                },
            });

            setName(name.trim());
        } else {
            setName(list.name);
        }

        setIsEditingName(false);
    }

    function deleteList() {
        deleteListMutation.mutate({
            boardId: props.boardId,
            list: list as ListWithId,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `board-delete-list-${new Date().getTime()}`,
                    message: 'List deleted successfully',
                });
            },
        });
    }
}

export interface CardSectionProps extends ListProps {
    list: ListWithId;
}

export function CardSection({
    list,
    boardId,
    isUserParticipant,
}: CardSectionProps) {
    const [isAddingCard, setIsAddingCard] = React.useState(false);

    const { setNodeRef } = useDroppable({
        id: list.id,
        disabled: !isUserParticipant,
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
                        disabled={!isUserParticipant}
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
    disabled?: boolean;
}

function SortableCard({
    card,
    index,
    listId,
    disabled,
    ...props
}: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        disabled,
        data: {
            card,
            index,
            listId,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            {...props}
            dragEnabled={!disabled}
            style={style}
            isDragging={isDragging}
            card={card}
            otherProps={{ ...listeners, ...attributes }}
        />
    );
}
