import {
    BoardAggregate,
    Card,
    Colors,
    List,
    ListNotFoundError,
    Member,
    MemberAlreadyInBoardError,
    MemberNotInBoardError,
    OperationUnauthorizedError
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';

const BOARD_ID = uuidv4();

const members: Member[] = [
    {
        id: uuidv4(),
        login: 'adamthe1',
        password:
            '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
        name: 'Adam the first man',
        avatarURL: 'https://www.photos.com/adam-naked.png'
    },
    {
        id: uuidv4(),
        login: 'kratos123',
        password:
            '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
        name: 'Kratos the God of war',
        avatarURL: 'https://www.photos.com/kratos-killing-gods.png'
    },
    {
        id: uuidv4(),
        login: 'zeus',
        password:
            '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
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
                labels: [
                    {
                        id: uuidv4(),
                        color: Colors.BLACK,
                        name: 'Concept',
                        parentBoardId: BOARD_ID
                    }
                ],
                attachments: [],
                coverURL: null,
                description: '',
                comments: []
            },
            {
                id: secondCardID,
                parentListId: todoListID,
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
                coverURL: 'https://picsum.photos/200/400',
                description: ''
            },
            {
                id: thirdCardID,
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
                coverURL: 'https://picsum.photos/200/400',
                description: ''
            }
        ];

        aggregate = new BoardAggregate(
            {
                id: BOARD_ID,
                name: 'Dev Challenge Boards',
                description: '',
                private: true
            },
            {
                cards,
                lists,
                participants: [{ isAdmin: true, member: members[2] }]
            }
        );
    });

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

    it('should cards ordered by positions', () => {
        const list = aggregate.cardsByLists[todoListID];
        expect(list[0].position).toBeLessThan(list[1].position);
    });

    it('should show lists organised by ids', () => {
        const list = aggregate.listsByIds[todoListID];
        expect(list).toStrictEqual(lists[0]);
    });

    it('can add a new list', () => {
        aggregate.addList('New List');
        expect(Object.values(aggregate.listsByIds)).toHaveLength(4);
    });

    it('should set new list position to last if no position specified', () => {
        const lastListId = aggregate.addList('New List');
        expect(aggregate.listsByIds[lastListId].position).toBe(3);
    });

    it('should reorder board when a list is inserted', () => {
        aggregate.addList('New List', 1);
        expect(aggregate.listsByIds[todoListID].position).toBe(0);
        expect(aggregate.listsByIds[InProgressListID].position).toBe(2);
        expect(aggregate.listsByIds[DoneListID].position).toBe(3);
    });

    it('can add a card to a list', () => {
        aggregate.addCardToList('New Card', InProgressListID);
        const list = aggregate.cardsByLists[InProgressListID];
        expect(list).toHaveLength(1);
    });

    it('cannot add a card to a nonexistant list', () => {
        const test = () => aggregate.addCardToList('New Card', 'id');
        expect(test).toThrow(ListNotFoundError);
    });

    it('can set the visibility of the board', () => {
        aggregate.setVisibility(false, members[2].id);
        expect(aggregate.isPrivate).toBe(false);
    });

    it('cannot set the visibility of the board if not admin', () => {
        expect(() =>
            aggregate.setVisibility(false, members[0].id)
        ).toThrow(OperationUnauthorizedError);
        expect(aggregate.isPrivate).toBe(true);
    });

    it('can add a member to the Board', () => {
        aggregate.addMemberToBoard(members[0]);
        expect(aggregate.participants).toHaveLength(2);
        expect(aggregate.participants[1].isAdmin).toBe(false);
    });

    it('cannot add a member two times in a board', () => {
        expect(() => {
            aggregate.addMemberToBoard(members[0]);
            aggregate.addMemberToBoard(members[0]);
        }).toThrow(MemberAlreadyInBoardError);
        expect(aggregate.participants).toHaveLength(2);
    });

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

    it('can grant admin privileges to a participant', () => {
        // Given
        aggregate.addMemberToBoard(members[0]);

        // When
        aggregate.grantPrivileges(members[0], members[2].id);

        // Then
        const participant = aggregate.participants[1];
        expect(participant.isAdmin).toBe(true);
    });

    it('cannot grant admin privileges to a participant if initiator is not admin', () => {
        // Given
        aggregate.addMemberToBoard(members[0]);

        // When
        expect(() => {
            aggregate.grantPrivileges(members[0], members[0].id);
        }).toThrow(OperationUnauthorizedError);

        // Then
        const participant = aggregate.participants[1];
        expect(participant.isAdmin).toBe(false);
    });

    it('can change oneself privileges', () => {
        // Given
        const admin = members[2];

        // When
        aggregate.grantPrivileges(admin, admin.id, false);

        // Then
        const participant = aggregate.participants[0];
        expect(participant.isAdmin).toBe(false);
    });

    it('can remove admin privileges to a participant', () => {
        // Given
        aggregate.addMemberToBoard(members[0]);

        // When
        aggregate.grantPrivileges(members[0], members[2].id);
        aggregate.grantPrivileges(members[0], members[2].id, false);

        // Then
        const participant = aggregate.participants[1];
        expect(participant.isAdmin).toBe(false);
    });

    it('cannot grant or remove admin privileges for a non participant', () => {
        // Given
        const nonParticipant = members[0];
        const admin = members[2];

        expect(() => {
            // When
            aggregate.grantPrivileges(nonParticipant, admin.id);
        }) // Then
            .toThrow(MemberNotInBoardError);
    });

    it('cannot remove admin privileges to a participant if initiator is not admin', () => {
        // Given
        const admin = members[2];
        const firstMember = members[0];
        const secondMember = members[1];

        aggregate.addMemberToBoard(firstMember);
        aggregate.addMemberToBoard(secondMember);

        // aggregate.grantPrivileges(participants[0], participants[2].id);
        aggregate.grantPrivileges(firstMember, admin.id);

        expect(
            () =>
                // When
                aggregate.grantPrivileges(
                    firstMember,
                    secondMember.id,
                    false
                )
            // Then
        ).toThrow(OperationUnauthorizedError);

        // Then
        const participant = aggregate.participants[1];
        expect(participant.isAdmin).toBe(true);
    });

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

    it('cannot remove an admin from the board', () => {
        // Given
        aggregate.addMemberToBoard(members[0]);
        aggregate.grantPrivileges(members[0], members[2].id);

        // When
        expect(() =>
            aggregate.removeMemberFromBoard(members[0], members[2].id)
        ).toThrow(OperationUnauthorizedError);

        // Then
        expect(aggregate.participants).toHaveLength(2);
    });

    it('cannot remove a member not in board', () => {
        expect(() =>
            aggregate.removeMemberFromBoard(members[0], members[2].id)
        ).toThrow(MemberNotInBoardError);

        // Then
        expect(aggregate.participants).toHaveLength(1);
    });


    it('can move cards between lists', () => {
        // Given
        aggregate.moveCard(cards[1], InProgressListID, 0);

        const todoList = aggregate.cardsByLists[todoListID];

        // The first list should have only one card left
        expect(todoList).toHaveLength(1);

        const inProgressList = aggregate.cardsByLists[InProgressListID];
        // The second list should have one card and the second card should be in the first position
        expect(inProgressList).toHaveLength(1);
        expect(inProgressList[0].id).toBe(secondCardID);
        expect(inProgressList[0].position).toBe(0);
    });

    it('should reorder the old list when a card is moved', () => {
        // Given
        aggregate.moveCard(cards[1], InProgressListID, 0);

        // the cards of the lists should be reordered by position
        const todoList = aggregate.cardsByLists[todoListID];
        expect(todoList[0].id).toBe(firstCardID);
        expect(todoList[0].position).toBe(0);
    });

    it('should reorder the new list when a card is moved', () => {
        // Given
        const cardToMove = cards[2];

        // When
        aggregate.moveCard(cardToMove, todoListID, 1);

        // the cards of the lists should be reordered by position
        const todoList = aggregate.cardsByLists[todoListID];
        expect(todoList).toHaveLength(3);

        // Each card should have its position updated
        expect(todoList[0].id).toBe(secondCardID);
        expect(todoList[0].position).toBe(0);

        expect(todoList[1].id).toBe(cardToMove.id);
        expect(cardToMove.position).toBe(1);

        expect(todoList[2].id).toBe(firstCardID);
        expect(todoList[2].position).toBe(2);
    });

    it('should be just reorder the list if the card is moved to the same list', () => {
        // Given
        const cardToMove = cards[0];

        // When
        aggregate.moveCard(cardToMove, todoListID, 0);

        const todoList = aggregate.cardsByLists[todoListID];
        // Then
        expect(todoList).toHaveLength(2);
        expect(todoList[0]).toBe(cardToMove);
        expect(cardToMove.position).toBe(0);
    });

    it('cannot move to an inexistant list', () => {
        // Given
        const cardToMove = cards[0];

        // When
        expect(() =>
            aggregate.moveCard(cardToMove, 'inexistant', 0)
        ).toThrow(ListNotFoundError);
   })
});
