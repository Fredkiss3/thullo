import { __UC__Request } from './__UC__Request';
import { __UC__Presenter } from './__UC__Presenter';
import { __UC__Response } from './__UC__Response';
import { FieldErrors } from '../../lib/types';
import Validator from 'validatorjs';
Validator.useLang('fr');

export class __UC__UseCase {
  // TODO : Add Validation Rules
  RULES = {};

  async execute(
    request: __UC__Request,
    presenter: __UC__Presenter
  ): Promise<void> {
    // TODO : UseCase Logic
    let errors = this.validate(request);
    presenter.present(new __UC__Response(errors));
  }

  validate(request: __UC__Request): FieldErrors {
    // TODO : Validation Rules
    const validation = new Validator(request, this.RULES, {});

    if (validation.passes()) {
      return null;
    }

    return validation.errors.all();
  }
}
