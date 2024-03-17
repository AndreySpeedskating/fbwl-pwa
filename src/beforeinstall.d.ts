declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface Window {
    appIsAlredyInstalled: boolean;
    deferredInstallPrompt: BeforeInstallPromptEvent;
  }
}
