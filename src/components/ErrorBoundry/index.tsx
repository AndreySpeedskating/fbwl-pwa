import React, { Component, ErrorInfo, ReactElement, ReactNode } from 'react';

import { IonButton } from '@ionic/react';

import { STORAGE } from '../../store/slices/indexedDb';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactElement | ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: 24,
          }}
        >
          <h1>Ошибка загрузки страницы</h1>
          <IonButton
            onClick={() => {
              // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
              STORAGE.removeItem('feed-storage').finally(() => {
                window.location.reload();
              });
            }}
          >
            Обновить страницу
          </IonButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
