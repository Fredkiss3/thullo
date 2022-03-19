import * as React from 'react';
import {
    closestCenter,
    DndContext,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
    DragEndEvent,
    DragCancelEvent,
    getFirstCollision,
    pointerWithin,
    CollisionDetection,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { range } from '@/lib/functions';

export interface TestDndkitProps {}

interface ItemProps {
    isDragging?: boolean;
    transform?: any;
    otherProps?: any;
    children: React.ReactNode;
    isOverlay?: boolean;
    transition?: string;
}

const DraggableItem = React.forwardRef(
    (
        {
            isDragging,
            otherProps,
            transform,
            children,
            isOverlay,
            transition,
        }: ItemProps,
        ref
    ) => {
        const style = {
            // Outputs `translate3d(x, y, 0)`
            transform: CSS.Translate.toString(transform),
            cursor: isDragging ? 'grabbing' : 'pointer',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1rem',
            width: '100%',
            transition,
            // transition: 'all 0.1s ease',
            display: 'flex',
            flexDirection: 'column',
            alignitems: 'start',
            gap: '1rem',
            border: '1px solid transparent',
            position: 'relative',
            ...(isDragging && {
                borderRadius: 'var(--border-radius-lg)',
                backgroundColor: 'var(--primary-color-hollow)',
                border: '1px dashed var(--primary-color)',
                // position: 'absolute',
            }),
        };

        return (
            // @ts-ignore
            <a ref={ref} style={style} {...otherProps}>
                {children}
            </a>
        );
    }
);

export function Droppable(props: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: props.id,
    });
    const style = {
        width: '100%',
        minHeight: '400px',
        minWidth: '400px',
        padding: '1rem',
        backgroundColor: '#0ff',
        margin: '1rem',
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
    };

    return (
        // @ts-ignore
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}

export function Sortable(props: { item: Item; children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.item.id });

    return (
        <DraggableItem
            ref={setNodeRef}
            isDragging={isDragging}
            otherProps={{ ...listeners, ...attributes }}
            transform={transform}
            transition={transition}
        >
            {props.children}
        </DraggableItem>
    );
}

type Item = {
    id: string;
};

type List = {
    id: string;
    items: Item[];
};

export function TestDndkit({}: TestDndkitProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [lists, setLists] = React.useState<List[]>(
        range(0, 3).map((i) => ({
            id: `list-${i}`,
            items:
                i !== 0
                    ? []
                    : range(0, 5).map((j) => ({
                          id: `item-${j}`,
                      })),
        }))
    );

    const [clonedLists, setClonedLists] = React.useState<List[] | null>(null);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragCancel={handleCancelDrag}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                }}
            >
                {lists.map((list) => {
                    return (
                        <Droppable id={list.id} key={list.id}>
                            <div>{list.id}</div>
                            <SortableContext
                                id={list.id}
                                key={list.id}
                                items={list.items.map(({ id }) => ({ id }))}
                                strategy={verticalListSortingStrategy}
                            >
                                {list.items.map((item) => (
                                    <Sortable item={item} key={item.id}>
                                        {item.id}
                                    </Sortable>
                                ))}
                            </SortableContext>
                        </Droppable>
                    );
                })}
            </div>

            <DragOverlay>
                {activeId ? (
                    <DraggableItem isOverlay>
                        {activeId} (Dragging)
                    </DraggableItem>
                ) : null}
            </DragOverlay>
        </DndContext>
    );

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        setClonedLists(null);

        const { over, active } = event;

        // if (over) {
        //     const currentPosition = draggables.find(
        //         (draggable) => draggable.id === active.id
        //     )!.position;
        //
        //     if (over.id.startsWith('droppable')) {
        //         setDraggables((draggables) => {
        //             const draggablesForDestination = draggables.filter(
        //                 (draggable) => draggable.parent === over.id
        //             );
        //
        //             const newDraggables = draggables.map((draggable) =>
        //                 draggable.id === active.id
        //                     ? {
        //                           ...draggable,
        //                           parent: over.id,
        //                       }
        //                     : draggable
        //             );
        //
        //             console.log({ newDraggables });
        //             return newDraggables;
        //         });
        //     } else if (over.id.startsWith('draggable')) {
        //         const parent = draggables.find(
        //             ({ id }) => id === over.id
        //         )?.parent;
        //
        //         const newPosition = destination!.position;
        //
        //         if (parent) {
        //             setDraggables((draggables) => {
        //                 const newDraggables = draggables.map((draggable) =>
        //                     draggable.id === active.id
        //                         ? {
        //                               ...draggable,
        //                               parent,
        //                               position: newPosition,
        //                           }
        //                         : draggable.id === destination?.id
        //                         ? {
        //                               ...draggable,
        //                               position: currentPosition,
        //                           }
        //                         : draggable
        //                 );
        //
        //                 console.log({ newDraggables });
        //                 return newDraggables;
        //             });
        //         }
        //     }
        // }

        // setDestination(null);
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id);
        setClonedLists(lists);
    }

    function findList(id: string) {
        return lists.find((list) => list.id === id);
    }

    function findParentList(parentListId: string) {
        return lists.find(({ items }) =>
            items.some(({ id }) => id === parentListId)
        );
    }

    function findItem(itemId: string, listsToSearch: List[] = lists) {
        return listsToSearch
            .flatMap((list) => list.items)
            .find(({ id }) => id === itemId);
    }

    function handleDragOver({ over, active, collisions }: DragOverEvent) {
        // active = item that is being dragged
        // over = (item or list) that is being dragged over

        console.log({
            collisions,
        });

        if (over) {
            const destList = findList(over.id); // list that is being dragged over
            // console.log({
            //     active: active.id,
            //     over: over.id,
            //     activeRect: active.rect.current.translated,
            //     overRect: over.rect,
            // });

            // over is a list
            if (destList) {
                setLists((lists) => {
                    const newLists = [...lists];

                    const srcList = newLists.find(({ items }) =>
                        items.some((item) => item.id === active.id)
                    )!;
                    const destList = newLists.find(
                        (list) => list.id === over.id
                    )!;

                    if (srcList.id === destList.id) {
                        // if it is the same list, do nothing
                        return newLists;
                    }

                    // remove the item from the source list
                    const itemIndex = srcList.items.findIndex(
                        ({ id }) => id === active.id
                    );

                    srcList.items.splice(itemIndex, 1);

                    // add the item to the destination list at the end
                    destList.items.push(active);

                    return newLists;
                });
            } else {
                // over is an item and not the same as the active item
                if (active.id !== over.id) {
                    setLists((lists) => {
                        const newLists = [...lists];

                        const srcList = newLists.find(({ items }) =>
                            items.some((item) => item.id === active.id)
                        )!;
                        const destList = newLists.find(({ items }) =>
                            items.some((item) => item.id === over.id)
                        )!;

                        // find the position to replace the item in the destination list
                        const overItemIndex = destList.items.findIndex(
                            ({ id }) => id === over.id
                        );

                        // remove the item from the source list
                        const itemIndex = srcList.items.findIndex(
                            ({ id }) => id === active.id
                        );

                        srcList.items.splice(itemIndex, 1);

                        // add the item to the destination list at the specified position
                        destList.items.splice(overItemIndex, 0, active);

                        return newLists;
                    });
                }
            }
        }
    }

    function handleCancelDrag(event: DragCancelEvent) {
        clonedLists && setLists(clonedLists);

        // Reset items to their original state in case items have been
        // Dragged across containers

        setActiveId(null);
        setClonedLists(null);
    }
}
