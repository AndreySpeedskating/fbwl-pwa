/* eslint-disable no-return-await */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  prompt(): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly userChoice: Promise<UserChoice>;
}

export interface UserChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

export async function installPWA(
  deferredInstallPrompt: BeforeInstallPromptEvent | null
): Promise<boolean | 'accepted' | 'dismissed' | undefined> {
  deferredInstallPrompt?.prompt();

  return await deferredInstallPrompt?.userChoice
    ?.then((value) => {
      const { outcome } = value;
      if (outcome === 'accepted') {
        localStorage.setItem('already-install', 'true');
        deferredInstallPrompt = null;
      }

      return outcome;
    })
    .catch(() => false);
}
