import {
    SeeBoardDetailsRequest,
    SeeBoardDetailsUseCase,
    SeeBoardDetailsPresenter,
    SeeBoardDetailsResponse
} from '@thullo/domain';

const presenter = new (class implements SeeBoardDetailsPresenter {
    response?: SeeBoardDetailsResponse | null;

    present(response: SeeBoardDetailsResponse): void {
        this.response = response;
    }
})();

const request: SeeBoardDetailsRequest = {};

describe('SeeBoardDetails Use case', () => {
    it('is successful', async () => {
        // Given
        const useCase = new SeeBoardDetailsUseCase();

        // When
        await useCase.execute(request, presenter);

        // Then
        expect(presenter.response).not.toBe(null);
    });

    it.todo('Negative Use Case');

    describe('Invalid Requests', () => {
        const dataset: { label: string; request: SeeBoardDetailsRequest }[] = [
            // TODO: Specify requests
            {
                label: 'Example label',
                request: {
                    ...request
                }
            }
        ];

        it.each(dataset)(
            'shows errors with invalid request : "$label"',
            async ({ request }) => {
                // Given
                const useCase = new SeeBoardDetailsUseCase();

                // When
                await useCase.execute(request, presenter);

                // Then
                expect(presenter.response?.errors).not.toBe(null);
            }
        );
    });
});
