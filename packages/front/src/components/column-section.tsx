import * as React from 'react';

// functions & others
import { useToastContext } from '@/context/toast.context';
import { useMoveCardMutation } from '@/lib/queries';
import {
    BoardDetails,
    List as ListType,
    Card as CardType,
    DraggableCardData,
    ListWithId,
    DragHistory,
} from '@/lib/types';
import {
    closestCenter,
    DndContext,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// components
import { List } from './list';
import { Button } from './button';
import { Icon } from './icon';
import { AddListForm } from './add-list-form';

// styles
import cls from '@/styles/components/column-section.module.scss';
import {
    arrayToRecord,
    deepCopy,
    getNextCollision,
    moveCardBetweenLists,
} from '@/lib/functions';
import { Card } from './card';

export interface ColumnSectionProps extends BoardDetails {
    userIsParticipant: boolean;
}

export function ColumnsSection({
    lists,
    userIsParticipant,
    id: boardId,
}: ColumnSectionProps) {
    const mutation = useMoveCardMutation();
    const { dispatch } = useToastContext();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // State
    const [isAddingList, setIsAddingList] = React.useState(false);

    const [dragHistory, setDragHistory] = React.useState<DragHistory | null>(
        null
    );

    const [listsToReorder, setListsToReorder] = React.useState(
        arrayToRecord(lists)
    );

    // sort lists by position
    const listsToShow = Object.entries(listsToReorder).sort(
        ([_a, listA], [_b, listB]) => {
            return listA.position - listB.position;
        }
    );

    const [activeCard, setActiveCard] = React.useState<CardType | null>(null);

    // the clone to remember the value of the list when dragging
    const [listsToReorderCloned, setListsToReorderCloned] =
        React.useState<Record<string, ListType> | null>(null);

    // Effect
    React.useEffect(() => {
        setListsToReorder(arrayToRecord(lists));
    }, [lists]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragCancel={handleCancelDrag}
        >
            <section className={cls.column_section}>
                {listsToShow.map(([id, list]) => (
                    <List
                        isUserParticipant={userIsParticipant}
                        boardId={boardId}
                        key={id}
                        list={list}
                        className={cls.column_section__list}
                    />
                ))}

                {userIsParticipant && (
                    <div className={cls.column_section__list}>
                        {!isAddingList ? (
                            <Button
                                testId="add-list-btn"
                                className={cls.add_button}
                                onClick={() => setIsAddingList(true)}
                                variant={`primary-hollow`}
                            >
                                <span>
                                    {lists.length === 0
                                        ? 'Add a list'
                                        : 'Add another list'}
                                </span>
                                <Icon
                                    icon="plus"
                                    className={cls.add_button__icon}
                                />
                            </Button>
                        ) : (
                            <AddListForm
                                boardId={boardId}
                                onCancel={() => setIsAddingList(false)}
                            />
                        )}
                    </div>
                )}
            </section>

            <DragOverlay>
                {activeCard && (
                    <Card isOverlay card={activeCard} boardId={boardId} />
                )}
            </DragOverlay>
        </DndContext>
    );

    function moveCard(
        cardId: string,
        srcListId: string,
        destListId: string,
        newPosition: number,
        oldPosition: number
    ) {
        mutation.mutate({
            boardId,
            cardId,
            srcListId,
            destListId,
            position: newPosition,
            oldPosition,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `card-move-${new Date().getTime()}`,
                    message: 'Card successfully moved.',
                });
            },
        });
    }

    function handleDragStart(event: DragStartEvent) {
        const data = event.active
            .data as React.MutableRefObject<DraggableCardData>;
        setActiveCard(data.current.card);
        setListsToReorderCloned(() => deepCopy(listsToReorder));

        setDragHistory({
            cardId: event.active.id,
            srcListId: data.current.listId,
            oldPosition: data.current.index,
        });
    }

    function handleDragOver(event: DragOverEvent) {
        const { over, active, collisions } = event;
        const data = event.active
            .data as React.MutableRefObject<DraggableCardData>;
        const overData = event.over
            ?.data as React.MutableRefObject<DraggableCardData>;

        if (over) {
            if (over.id in listsToReorder) {
                let srcList: ListWithId | null = null;
                let destList: ListWithId | null = null;
                let destPosition: number | null = null;

                // if the destination list is empty
                if (listsToReorder[over.id].cards.length === 0) {
                    destPosition = 0;

                    ({ srcList, destList } = moveCardBetweenLists({
                        srcList: listsToReorder[
                            data.current.listId
                        ] as ListWithId,
                        destList: listsToReorder[over.id] as ListWithId,
                        srcIndex: data.current.index,
                        destIndex: 0,
                    }));
                } else {
                    // if dragging over a list find the next collision corresponding to a card
                    const collision = getNextCollision(
                        collisions,
                        over.id,
                        active.id,
                        listsToReorder
                    );

                    if (collision) {
                        const cardData = collision.data?.droppableContainer.data
                            .current as DraggableCardData;

                        // console.log({
                        //     cardData,
                        //     collision,
                        // });

                        if (cardData) {
                            ({ srcList, destList } = moveCardBetweenLists({
                                srcList: listsToReorder[
                                    data.current.listId
                                ] as ListWithId,
                                destList: listsToReorder[over.id] as ListWithId,
                                srcIndex: data.current.index,
                                destIndex: cardData.index,
                            }));

                            destPosition = cardData.index;
                        }
                    }
                }

                setDragHistory((prev) => {
                    if (prev && srcList && destList && destPosition !== null) {
                        return {
                            ...prev,
                            destListId: destList.id,
                            newPosition: destPosition,
                        };
                    }
                    return prev;
                });

                setListsToReorder((prev) => {
                    if (srcList && destList) {
                        return {
                            ...prev,
                            [srcList.id]: deepCopy(srcList),
                            [destList.id]: deepCopy(destList),
                        };
                    }

                    return prev;
                });
            } else {
                // over is an item and not the same as the active item
                if (active.id !== over.id && overData.current) {
                    const { srcList, destList } = moveCardBetweenLists({
                        srcList: listsToReorder[
                            data.current.listId
                        ] as ListWithId,
                        destList: listsToReorder[
                            overData.current.listId
                        ] as ListWithId,
                        srcIndex: data.current.index,
                        destIndex: overData.current.index,
                    });

                    setDragHistory((prev) => {
                        if (prev) {
                            return {
                                ...prev,
                                destListId: destList.id,
                                newPosition: overData.current.index,
                            };
                        }
                        return prev;
                    });

                    setListsToReorder((prev) => ({
                        ...prev,
                        [srcList.id]: deepCopy(srcList),
                        [destList.id]: deepCopy(destList),
                    }));
                }
            }
        }
    }

    function handleDragEnd() {
        if (
            dragHistory?.destListId &&
            dragHistory?.newPosition !== undefined &&
            !(
                // No change in position and list
                (
                    dragHistory.destListId === dragHistory.srcListId &&
                    dragHistory.oldPosition === dragHistory.newPosition
                )
            )
        ) {
            moveCard(
                dragHistory.cardId,
                dragHistory.srcListId,
                dragHistory.destListId,
                dragHistory.newPosition,
                dragHistory.oldPosition
            );
        }

        setActiveCard(null);
        setListsToReorderCloned(null);
        setDragHistory(null);
    }

    function handleCancelDrag() {
        // Reset items to their original state in case items have been
        // Dragged across containers
        listsToReorderCloned && setListsToReorder({ ...listsToReorderCloned });
        setActiveCard(null);
        setListsToReorderCloned(null);
        setDragHistory(null);
    }
}
