FROM node:14 as builder

# Переменные среды из --build-arg

WORKDIR /usr/src/app

# Сборка приложения
COPY . .

RUN yarn install
RUN yarn build

# Запуск приложения

FROM alpine:3.16
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3180
CMD ["nginx", "-g", "daemon off;"]

