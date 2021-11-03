import {
  SeeBoardsRequest,
  SeeBoardsUseCase,
  SeeBoardsPresenter,
  SeeBoardsResponse,
  MemberRepository,
  Member,
  BoardRepository,
  Board
} from '@thullo/domain';
import { v4 as uuidv4 } from 'uuid';
import { MemberRepositoryBuilder } from '../builder/MemberRepositoryBuilder';
import { BoardRepositoryBuilder } from '../builder/BoardRepositoryBuilder';

/**
 * =========================
 *         Data
 * =========================
 **/
const presenter = new (class implements SeeBoardsPresenter {
  response?: SeeBoardsResponse | null;

  present(response: SeeBoardsResponse): void {
    this.response = response;
  }
})();

const ZEUS_ID = uuidv4();

const participants: Record<string, Member> = {
  adam: {
    id: uuidv4(),
    login: 'adamthe1',
    password:
      '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Adam the first man',
    avatarURL: 'adam-naked.png'
  },
  kratos: {
    id: uuidv4(),
    login: 'kratos123',
    password:
      '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Kratos the God of war',
    avatarURL: 'kratos-killing-gods.png'
  },
  zeus: {
    id: ZEUS_ID,
    login: 'zeus',
    password:
      '$2a$12$wAw/.WVPaDZXyFT7FIfkGOrCAYTfHPrgXLd7ABu8WBl6.ResQDvSq', // "password123."
    name: 'Zeus God of thunder',
    avatarURL: 'thunder.png'
  }
};

const boardsExpected: Board[] = [
  {
    id: uuidv4(),
    name: 'Gods Tournament',
    coverURL: 'tournament.png',
    private: false,
    description: 'The only tournament to kill all the gods 👿',
    ownerId: participants.kratos.id,
    participants: Object.values(participants),
  },
  {
    id: uuidv4(),
    name: 'All my Beautiful human wives',
    coverURL: 'sexy-lady.png',
    private: true,
    description: 'I love them so much !',
    ownerId: participants.zeus.id,
    participants: []
  }
];

const request: SeeBoardsRequest = {
  memberId: ZEUS_ID
};

/**
 * =========================
 *          Tests
 * =========================
 */
describe('SeeBoards Use case', () => {
  it('is successful', async () => {
    // Given
    const memberRepo: MemberRepository = new MemberRepositoryBuilder()
      .withGetMemberById(async (id) => {
        return participants.zeus;
      })
      .build();

    const boardRepo: BoardRepository = new BoardRepositoryBuilder()
      .withGetAllBoardsWhereMemberIsPresentOrIsOwner(async (memberId) =>
        boardsExpected.slice(0, 2)
      )
      .build();

    const useCase = new SeeBoardsUseCase(memberRepo, boardRepo);

    // When
    await useCase.execute(request, presenter);

    // Then
    expect(presenter.response?.boards).not.toBe(null);
    expect(presenter.response?.boards).toStrictEqual(
      boardsExpected.slice(0, 2)
    );
  });

  it('Shows error if memberId is not valid', async () => {
    // Given
    const memberRepo: MemberRepository = new MemberRepositoryBuilder()
      .withGetMemberById(async (id) => {
        return (
          Object.values(participants).find((m) => m.id === id) ?? null
        );
      })
      .build();

    const boardRepo: BoardRepository = new BoardRepositoryBuilder().build();

    const useCase = new SeeBoardsUseCase(memberRepo, boardRepo);

    // When
    await useCase.execute(
      {
        memberId: uuidv4()
      },
      presenter
    );

    // Then
    expect(presenter.response?.errors).not.toBe(null);
    expect(presenter.response?.errors?.memberId).toContainEqual(
      "Il n'existe aucun utilisateur ayant cet Id"
    );
    expect(presenter.response?.boards).toBe(null);
  });
});
