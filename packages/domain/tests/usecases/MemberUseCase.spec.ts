import {
  MemberRequest,
  MemberUseCase,
  MemberPresenter,
  MemberResponse,
} from '@thullo/domain';

class MemberPresenterStub implements MemberPresenter {
  response?: MemberResponse | null;

  present(response: MemberResponse): void {
    this.response = response;
  }
}

const presenter = new MemberPresenterStub();

describe('Member Use case', () => {
  beforeEach(() => {
    presenter.response = null;
  });

  it('is successful', async () => {
    // Given
    const useCase = new MemberUseCase();
    const request: MemberRequest = {};

    // When
    await useCase.execute(request, presenter);

    // Then
    expect(presenter.response).not.toBe(null);
  });

  it.todo('Negative Use Case');

  describe('Invalid Requests', () => {
    const dataset: { label: string; request: MemberRequest }[] = [];

    it.each(dataset)(
      'shows errors with invalid request : "$label"',
      async ({ request }) => {
        // Given
        const useCase = new MemberUseCase();

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response?.errors).not.toBe(null);
        expect(presenter.response?.company).toBe(null);
      }
    );
  });
});
