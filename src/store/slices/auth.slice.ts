import { saveDataToLs } from '../../utils/helpers';

export function setStartPoint(action: string): void {
  saveDataToLs(action, '-pt');
}

export function setRegistrationStatus(action: string): void {
  saveDataToLs(action, '-rsv');
  window.dispatchEvent(new Event('storage'));
}
