# Практические работы № 4–8 — API

| Работа | Исходники |
|---|---|
| № 4: json-server, библиотека | [practicals/lab4](practicals/lab4) |
| № 5: Angular + Express + MongoDB | [practicals/lab5](practicals/lab5) |
| № 6: OpenAPI + ReDoc + Prism | [practicals/lab6](practicals/lab6) |
| № 7: GraphQL, книги | [practicals/lab7](practicals/lab7) |
| № 8: gRPC, задачи | [practicals/lab8](practicals/lab8) |

[Инструкция запуска](practicals/README.md). Общие зависимости находятся в `practicals/package.json`.

Корень репозитория содержит версию № 5 для развёртывания на Render.
[Работающее приложение](https://api-practice-contacts-2026.onrender.com).

## Учебное REST CRUD-приложение «Контакты»
Практическая работа 5: Angular, Express, MongoDB, Node.js.

Демонстрация работает в Docker на бесплатном Render. MongoDB доступна только внутри контейнера; внешне открыт HTTP интерфейс приложения. Данные учебные, без авторизации. Не вводите личные данные. После перезапуска бесплатного контейнера база сбрасывается.

Локально: npm ci, запустить MongoDB на порту 27028, npm start.
Docker: docker build -t api-contacts . && docker run --rm -p 10000:10000 api-contacts
API: GET/POST /api/contacts; GET/PUT/DELETE /api/contacts/:id; GET /health.

Исходник Angular: client.js; public/app.js — собранный клиент.
