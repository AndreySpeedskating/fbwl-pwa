export const validEmailShcema = /^[\w&*+-]+(?:\.[\w&*+-]+)*@(?:[\dA-Za-z-]+\.)+[A-Za-z]{2,7}$/;

export const FORM_TEXT = {
  OTP: {
    title: 'Введите код для входа',
    button: 'Войти',
  },
  EMAIL: {
    title: 'Введите e-mail',
    button: 'Отправить',
  },
  REFRESH: 'Отправить код повторно ',
};

export const DESCRIPTION = (email?: string): any => ({
  OTP: {
    description: `Мы отправили код на почту ${email}`,
  },
  EMAIL: {
    description: 'На вашу электронную почту прийдёт одноразовый пароль для входа',
  },
});

export const REFRESH_TIMER = 30;

export enum ESteps {
  EMAIL = 'EMAIL',
  OTP = 'OTP',
}
