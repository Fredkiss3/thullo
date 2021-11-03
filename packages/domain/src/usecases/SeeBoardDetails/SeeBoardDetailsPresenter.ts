import { SeeBoardDetailsResponse } from './SeeBoardDetailsResponse';

export interface SeeBoardDetailsPresenter {
  present: (response: SeeBoardDetailsResponse) => void;
}
