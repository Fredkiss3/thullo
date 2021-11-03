import { SeeBoardDetailsRequest } from './SeeBoardDetailsRequest';
import { SeeBoardDetailsPresenter } from './SeeBoardDetailsPresenter';
import { SeeBoardDetailsResponse } from './SeeBoardDetailsResponse';
import { FieldErrors } from '../../utils/types';
import Validator from 'validatorjs';
Validator.useLang('fr');

export class SeeBoardDetailsUseCase {
  // TODO : Add Validation Rules
  RULES = {};

  async execute(
    request: SeeBoardDetailsRequest,
    presenter: SeeBoardDetailsPresenter
  ): Promise<void> {
    // TODO : UseCase Logic
    let errors = this.validate(request);
    presenter.present(new SeeBoardDetailsResponse(errors));
  }

  validate(request: SeeBoardDetailsRequest): FieldErrors {
    // TODO : Validation Rules
    const validation = new Validator(request, this.RULES, {});

    if (validation.passes()) {
      return null;
    }

    return validation.errors.all();
  }
}
