import {
    BoardAggregate,
    Card,
    Colors,
    List,
    ListNotFoundError,
    Member,
    OperationUnauthorizedError
} from '@thullo/domain';
import { randomUUID as uuidv4 } from 'crypto';

const BOARD_ID = uuidv4();

const participants: Member[] = [
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

describe('Board aggregate test', () => {
    beforeEach(() => {
        lists = [
            { id: uuidv4(), boardId: BOARD_ID, position: 0, name: 'BackLog' },
            {
                id: uuidv4(),
                boardId: BOARD_ID,
                position: 1,
                name: 'In Progress'
            },
            { id: uuidv4(), boardId: BOARD_ID, position: 2, name: 'Completed' }
        ];

        cards = [
            {
                id: uuidv4(),
                parentListId: lists[0].id,
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
                id: uuidv4(),
                parentListId: lists[0].id,
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
                id: uuidv4(),
                parentListId: lists[2].id,
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

        aggregate = new BoardAggregate(BOARD_ID, participants[2].id, {
            cards,
            lists,
            participants: []
        });
    });

    it('should show cards organised by list Ids', async () => {
        const list = aggregate.cardsByLists[lists[0].id];
        expect(list).toHaveLength(2);
        expect(list).toContainEqual(cards[0]);

        const list2 = aggregate.cardsByLists[lists[1].id];
        expect(list2).toHaveLength(0);

        const list3 = aggregate.cardsByLists[lists[2].id];
        expect(list3).toHaveLength(1);
        expect(list3).toContainEqual(cards[2]);
    });

    it('should cards ordered by positions', async () => {
        const list = aggregate.cardsByLists[lists[0].id];
        expect(list[0].position).toBeLessThan(list[1].position);
    });

    it('should show lists organised by ids', () => {
        const list = aggregate.lists[lists[0].id];
        expect(list).toStrictEqual(lists[0]);
    });

    it('can add a new list', () => {
        aggregate.addList('New List');
        expect(Object.values(aggregate.lists)).toHaveLength(4);
    });

    it('should set new list position to last if no position specified', () => {
        const lastListId = aggregate.addList('New List');
        expect(aggregate.lists[lastListId].position).toBe(3);
    });

    it('should reorder board when a list is inserted', () => {
        aggregate.addList('New List', 1);
        expect(aggregate.lists[lists[0].id].position).toBe(0);
        expect(aggregate.lists[lists[1].id].position).toBe(2);
        expect(aggregate.lists[lists[2].id].position).toBe(3);
    });

    it('can add a card to a list', () => {
        aggregate.addCardToList('New Card', lists[1].id);
        const list = aggregate.cardsByLists[lists[1].id];
        expect(list).toHaveLength(1);
    });

    it('cannot add a card to a nonexistant list', () => {
        const test = () => aggregate.addCardToList('New Card', 'id');
        expect(test).toThrow(ListNotFoundError);
    });

    it.todo('should reorder the list when a card is moved');

    it.todo('should be able to move cards between lists');

    it('can add a member to the Board', () => {
        aggregate.addMemberToBoard(participants[0]);
        expect(aggregate.participants).toHaveLength(1);
    });

    it('cannot add an admin in a board', () => {
        expect.assertions(1);

        try {
            expect(() => aggregate.addMemberToBoard(participants[2])).toThrow(
                OperationUnauthorizedError
            );

            expect(true).toBe(false);
        } catch (e) {
            // @ts-ignore
            expect(e.message).toBe('Ce membre participe déjà au tableau');
            expect(aggregate.participants).toHaveLength(0);
        }
    });

    it('cannot add a member two times in a board', () => {
        expect.assertions(1);
        try {
            expect(() => {
                aggregate.addMemberToBoard(participants[0]);
                aggregate.addMemberToBoard(participants[0]);
            }).toThrow(OperationUnauthorizedError);
        } catch (e) {
            // @ts-ignore
            expect(e.message).toBe('Ce membre participe déjà au tableau');
            expect(aggregate.participants).toHaveLength(1);
        }
    });

    it.todo('should be able to attach a link to a card');
    it.todo('should be able to add comments to cards');
    it.todo('should be able to add labels to cards');

    it.todo(
        'should only set dirty flag to differents' +
            'entity types when an operation is executed'
    );
});
