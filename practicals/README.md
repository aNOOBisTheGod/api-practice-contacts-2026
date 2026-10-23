# Запуск практических работ

```text
Практические работы 4–8.
Требования: Node.js 22+, npm; для № 5 — MongoDB.
Все команды выполнять из каталога practicals.
Установка: npm ci
4: cp lab4/db.seed.json lab4/db.json; npx json-server --watch lab4/db.json --host 127.0.0.1 --port 3104
5: mongod --dbpath <пустой каталог данных> --bind_ip 127.0.0.1 --port 27028
   npm run build:contacts
   node lab5/server.cjs (http://127.0.0.1:3105)
   Сборка Angular: npx esbuild lab5/client.js --bundle --outfile=lab5/public/app.js
   MONGODB_URI и PORT можно задать переменными окружения.
6: npx prism mock lab6/openapi.yaml --host 127.0.0.1 --port 3106
   Документация: lab6/redoc.html; спецификация: lab6/openapi.yaml
7: node lab7/server.mjs
   Веб-клиент: python3 -m http.server 3110 --bind 127.0.0.1
   Открыть http://127.0.0.1:3110/lab7/client.html
   Для документации № 6 открыть http://127.0.0.1:3110/lab6/redoc.html
8: node lab8/server.cjs
   Клиент: node lab8/client.cjs create "Подготовить отчёт"
   node lab8/client.cjs list
   node lab8/client.cjs update ID "Подготовить отчёт" true
   node lab8/client.cjs delete ID
Все демонстрационные данные вымышлены. GraphQL и gRPC хранят данные в памяти.
```
