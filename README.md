# О проекте

React-typescript Ionic Pwa проект.

За основу взят официальный boilerplate Ionic Rect Pwa (https://ionicframework.com/docs/react/pwa).

Приложение расчитано на использование с мобильных устройств

## Подготовка проекта 

1. Установите зависимости

```shell
yarn install
```

## Запуск проекта

1.1 Для запуска в режиме разрботки выполните команду

```shell
yarn start
```

Откройте страницу в вашем браузере по адресу [http://localhost:3000](http://localhost:3000)

1.2 Для запуска в prod, последовательно выполните команды

```shell
yarn build
serve -s build
```

убедитесь что у Вас глобально установлен serve.
Откройте страницу в вашем браузере по адресу [http://localhost:3000](http://localhost:3000)

## Тестирование

1. Для тестирования кода выполните команду 

```shell
yarn lint
```