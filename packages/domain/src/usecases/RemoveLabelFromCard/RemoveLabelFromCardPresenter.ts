import { RemoveLabelFromCardResponse } from './RemoveLabelFromCardResponse';

export interface RemoveLabelFromCardPresenter {
  present: (response: RemoveLabelFromCardResponse) => void;
}
