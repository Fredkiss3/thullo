import {
    BoardAggregate,
    BoardAggregateBuilder,
    Card,
    CardNotFoundError,
    Colors,
    InvalidPositionError,
    List,
    ListNotFoundError,
    Member,
    MemberNotInBoardError,
    OperationUnauthorizedError
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';

const BOARD_ID = uuidv4();

const members: Member[] = [
    {
        id: uuidv4(),
        login: 'adamthe1',
        name: 'Adam the first man',
        avatarURL: 'https://www.photos.com/adam-naked.png'
    },
    {
        id: uuidv4(),
        login: 'kratos123',
        name: 'Kratos the God of war',
        avatarURL: 'https://www.photos.com/kratos-killing-gods.png'
    },
    {
        id: uuidv4(),
        login: 'zeus',
        name: 'Zeus God of thunder',
        avatarURL: 'https://www.photos.com/thunder.png'
    }
];

let lists: List[];

let cards: Card[];

let aggregate: BoardAggregate;

const todoListID = uuidv4();
const InProgressListID = uuidv4();
const DoneListID = uuidv4();

const firstCardID = uuidv4();
const secondCardID = uuidv4();
const thirdCardID = uuidv4();

describe('Board aggregate test', () => {
    beforeEach(() => {
        lists = [
            {
                id: todoListID,
                name: 'To do',
                position: 0,
                boardId: BOARD_ID
            },
            {
                id: InProgressListID,
                name: 'In progress',
                position: 1,
                boardId: BOARD_ID
            },
            {
                id: DoneListID,
                name: 'Done',
                position: 2,
                boardId: BOARD_ID
            }
        ];

        cards = [
            {
                id: firstCardID,
                parentListId: todoListID,
                title: "Add What you'd like to work on below",
                position: 1,
                cover: null,
                labels: [
                    {
                        id: uuidv4(),
                        color: Colors.BLACK,
                        name: 'Concept',
                        parentBoardId: BOARD_ID
                    }
                ],
                attachments: [],
                description: '',
                comments: []
            },
            {
                id: secondCardID,
                parentListId: todoListID,
                cover: null,
                title: 'Github Jobs challenge',
                position: 0,
                labels: [
                    {
                        id: uuidv4(),
                        color: Colors.BLACK,
                        name: 'Technical',
                        parentBoardId: BOARD_ID
                    },
                    {
                        id: uuidv4(),
                        color: Colors.GREEN,
                        name: 'Design',
                        parentBoardId: BOARD_ID
                    }
                ],
                attachments: [],
                comments: [],
                description: ''
            },
            {
                id: thirdCardID,
                cover: null,
                parentListId: DoneListID,
                title: 'A task well done',
                position: 0,
                labels: [
                    {
                        id: uuidv4(),
                        color: Colors.BLUE,
                        name: 'Technical',
                        parentBoardId: BOARD_ID
                    },
                    {
                        id: uuidv4(),
                        color: Colors.PURPLE,
                        name: 'Concept',
                        parentBoardId: BOARD_ID
                    }
                ],
                attachments: [],
                comments: [],
                description: ''
            }
        ];

        aggregate = new BoardAggregateBuilder()
            .withBoardId(BOARD_ID)
            .withName('Dev Challenge Boards')
            .withCards(cards)
            .withLists(lists)
            .withIsPrivate(true)
            .withDescription('')
            .withParticipants([{ isAdmin: true, member: members[2] }])
            .build();
    });

    describe('Board Organization', function () {
        it('should show cards organised by list Ids', () => {
            const list = aggregate.cardsByLists[todoListID];
            expect(list).toHaveLength(2);
            expect(list).toContainEqual(cards[0]);

            const list2 = aggregate.cardsByLists[InProgressListID];
            expect(list2).toHaveLength(0);

            const list3 = aggregate.cardsByLists[DoneListID];
            expect(list3).toHaveLength(1);
            expect(list3).toContainEqual(cards[2]);
        });

        it('Should prevent unwanted participants from having access to the board', () => {
            expect(aggregate.isParticipant(members[0].id)).toBe(false);
            expect(aggregate.isParticipant(members[2].id)).toBe(true);
        });

        it('should cards ordered by positions', () => {
            const list = aggregate.cardsByLists[todoListID];
            expect(list[0].position).toBeLessThan(list[1].position);
        });

        it('should show lists organised by ids', () => {
            const list = aggregate.listsByIds[todoListID];
            expect(list).toStrictEqual(lists[0]);
        });
    });

    describe('Adding a list the board', function () {
        it('can add a new list', () => {
            aggregate.addList('New List');
            expect(Object.values(aggregate.listsByIds)).toHaveLength(4);
        });

        it('can add a card to a list', () => {
            aggregate.addCardToList('New Card', InProgressListID);
            const list = aggregate.cardsByLists[InProgressListID];
            expect(list).toHaveLength(1);
        });

        it('reorder correclty cards when added to a list', () => {
            const card1 = aggregate.addCardToList('New Card', InProgressListID);
            const card2 = aggregate.addCardToList(
                'New Card 2',
                InProgressListID
            );
            const list = aggregate.cardsByLists[InProgressListID];
            expect(list).toHaveLength(2);

            expect(card1.position).toBe(0);
            expect(card2.position).toBe(1);
        });

        it('cannot add a card to a nonexistant list', () => {
            const test = () => aggregate.addCardToList('New Card', 'id');
            expect(test).toThrow(ListNotFoundError);
        });
    });

    describe('Setting Board Visibility', function () {
        it('can set the visibility of the board', () => {
            aggregate.setVisibility(false, members[2].id);
            expect(aggregate.isPrivate).toBe(false);
        });

        it('cannot set the visibility of the board if not admin', () => {
            expect(() => aggregate.setVisibility(false, members[0].id)).toThrow(
                OperationUnauthorizedError
            );
            expect(aggregate.isPrivate).toBe(true);
        });
    });

    describe('Adding a member to the board', function () {
        it('can add a member to the Board', () => {
            aggregate.addMemberToBoard(members[0]);
            expect(aggregate.participants).toHaveLength(2);
            expect(aggregate.participants[1].isAdmin).toBe(false);
        });

        it('should not add the new member if they are already a participant', () => {
            aggregate.addMemberToBoard(members[0]);
            aggregate.addMemberToBoard(members[0]);
            expect(aggregate.participants).toHaveLength(2);
        });
    });

    describe('Changing the name of the board', function () {
        it('can change the name of the board', () => {
            aggregate.setName('New Name', members[2].id);
            expect(aggregate.name).toBe('New Name');
        });

        it('cannot change the name of the board is not admin', () => {
            expect(() => aggregate.setName('New Name', members[0].id)).toThrow(
                OperationUnauthorizedError
            );
            expect(aggregate.name).toBe('Dev Challenge Boards');
        });
    });

    describe('Removing members from the board', function () {
        it('can remove participant from the board', () => {
            // Given
            aggregate.addMemberToBoard(members[0]);

            // When
            aggregate.removeMemberFromBoard(members[0], members[2].id);

            // Then
            expect(aggregate.participants).toHaveLength(1);
        });

        it('cannot remove member from board if not admin', () => {
            // Given
            aggregate.addMemberToBoard(members[0]);

            // When
            expect(() =>
                aggregate.removeMemberFromBoard(members[0], members[0].id)
            ).toThrow(OperationUnauthorizedError);

            // Then
            expect(aggregate.participants).toHaveLength(2);
        });

        it('cannot remove oneself from board', () => {
            expect(() =>
                aggregate.removeMemberFromBoard(members[2], members[2].id)
            ).toThrow(OperationUnauthorizedError);

            expect(aggregate.participants).toHaveLength(1);
        });

        it('cannot remove a member not in board', () => {
            expect(() =>
                aggregate.removeMemberFromBoard(members[0], members[2].id)
            ).toThrow(MemberNotInBoardError);

            // Then
            expect(aggregate.participants).toHaveLength(1);
        });
    });

    describe('Moving card between lists', function () {
        it('can move cards between lists', () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    },
                    {
                        id: InProgressListID,
                        name: 'In Progress',
                        position: 1
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    },
                    {
                        id: secondCardID,
                        parentListId: todoListID,
                        title: 'Github Jobs challenge',
                        position: 1
                    }
                ])
                .build();

            // When
            boardAggregate.moveCard(secondCardID, InProgressListID, 0);

            // Then
            const todoList = boardAggregate.cardsByLists[todoListID];

            // The first list should have only one card left
            expect(todoList).toHaveLength(1);

            const inProgressList =
                boardAggregate.cardsByLists[InProgressListID];

            // The second list should have one card and the second card should be in the first position
            expect(inProgressList).toHaveLength(1);
            expect(inProgressList[0].id).toBe(secondCardID);
            expect(inProgressList[0].position).toBe(0);
        });

        it('should reorder the old list when a card is moved', () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    },
                    {
                        id: InProgressListID,
                        name: 'In Progress',
                        position: 1
                    }
                ])
                .withCards([
                    {
                        id: secondCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    },
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: 'Github Jobs challenge',
                        position: 1
                    }
                ])
                .build();

            // When
            boardAggregate.moveCard(secondCardID, InProgressListID, 0);

            // the cards of the lists should be reordered by position
            const todoList = boardAggregate.cardsByLists[todoListID];
            expect(todoList[0].id).toBe(firstCardID);
            expect(todoList[0].position).toBe(0);
        });

        it('should reorder the new list when a card is moved', () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    },
                    {
                        id: DoneListID,
                        name: 'Done',
                        position: 1
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 1
                    },
                    {
                        id: secondCardID,
                        parentListId: todoListID,
                        title: 'Github Jobs challenge',
                        position: 0
                    },
                    {
                        id: thirdCardID,
                        parentListId: DoneListID,
                        title: 'A task well done',
                        position: 0
                    }
                ])
                .build();

            // When
            boardAggregate.moveCard(thirdCardID, todoListID, 1);

            // the cards of the lists should be reordered by position
            const todoList = boardAggregate.cardsByLists[todoListID];
            expect(todoList).toHaveLength(3);

            // Each card should have its position updated
            expect(todoList[0].id).toBe(secondCardID);
            expect(todoList[0].position).toBe(0);

            expect(todoList[1].id).toBe(thirdCardID);
            expect(todoList[1].position).toBe(1);

            expect(todoList[2].id).toBe(firstCardID);
            expect(todoList[2].position).toBe(2);
        });

        it('should just reorder the list if the card is moved to the same list', () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    },
                    {
                        id: secondCardID,
                        parentListId: todoListID,
                        title: 'Github Jobs challenge',
                        position: 1
                    }
                ])
                .build();

            // When
            boardAggregate.moveCard(secondCardID, todoListID, 0);

            const todoList = boardAggregate.cardsByLists[todoListID];
            // Then
            expect(todoList).toHaveLength(2);
            expect(todoList[0].id).toBe(secondCardID);
            expect(todoList[0].position).toBe(0);
        });

        it('should not be able to set the new position to a number less than Zero', async () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    },
                    {
                        id: InProgressListID,
                        name: 'In Progress',
                        position: 1
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    }
                ])
                .build();

            // When
            expect(() =>
                boardAggregate.moveCard(firstCardID, InProgressListID, -1)
            ).toThrow(InvalidPositionError);

            // Then
            const todoList = boardAggregate.cardsByLists[todoListID];
            expect(todoList).toHaveLength(1);
        });

        it('should not be able to set the new position to a number greater than the length of the destination list', async () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    },
                    {
                        id: InProgressListID,
                        name: 'In Progress',
                        position: 1
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    },
                    {
                        id: thirdCardID,
                        parentListId: InProgressListID,
                        title: 'Github Jobs challenge',
                        position: 0
                    }
                ])
                .build();

            // When
            expect(() =>
                boardAggregate.moveCard(firstCardID, InProgressListID, 2)
            ).toThrow(InvalidPositionError);

            // Then
            const todoList = boardAggregate.cardsByLists[todoListID];
            expect(todoList).toHaveLength(1);
        });

        it('should not be able to set the new position to the length of the destination list if the card is moved to the same list', async () => {
            // Given
            const boardAggregate: BoardAggregate = new BoardAggregateBuilder()
                .withBoardId(BOARD_ID)
                .withLists([
                    {
                        id: todoListID,
                        name: 'Todo',
                        position: 0
                    }
                ])
                .withCards([
                    {
                        id: firstCardID,
                        parentListId: todoListID,
                        title: "Add What you'd like to work on below",
                        position: 0
                    }
                ])
                .build();

            // When
            expect(() =>
                boardAggregate.moveCard(firstCardID, todoListID, 1)
            ).toThrow(InvalidPositionError);
        });

        it('cannot move to an inexistant list', () => {
            expect(() =>
                aggregate.moveCard(firstCardID, 'inexistant', 0)
            ).toThrow(ListNotFoundError);
        });

        it('cannot move an inexistant card', () => {
            expect(() =>
                aggregate.moveCard('inexistant', todoListID, 0)
            ).toThrow(CardNotFoundError);
        });
    });
});
