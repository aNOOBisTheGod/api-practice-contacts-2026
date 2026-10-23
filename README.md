# Практические 4–6: Flask + SQLite

## Запуск

Нужен Python 3.10+. Из папки проекта:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Windows: вместо первых двух команд — `py -m venv .venv` и `.venv\Scripts\activate`.

Открыть http://127.0.0.1:8000. Остановить: Ctrl+C.
При следующих запусках достаточно активировать окружение и выполнить `python app.py`.
SQLite создаётся автоматически в `data.sqlite3`. Данные сохраняются после перезапуска.
Docker, Node.js и отдельный сервер базы не нужны. Интернет нужен для установки Flask и загрузки ReDoc; приложение работает локально без интернета.

## Что есть

- № 4: `/api/authors`, `/api/libraries`, `/api/books`.
- № 5: контакты на главной странице и `/api/contacts`.
- № 6: `/api/games`, спецификация `/openapi.json`, документация `/docs`.

Для всех ресурсов: GET — список, POST — создание. По адресу `/api/ресурс/id`: GET — чтение, PUT — замена, DELETE — удаление.
База изначально пустая. Сначала создайте автора и библиотеку, затем книгу с их ID.

```bash
curl -H 'Content-Type: application/json' -d '{"name":"Булгаков"}' http://127.0.0.1:8000/api/authors
curl -H 'Content-Type: application/json' -d '{"name":"Центральная","city":"Москва"}' http://127.0.0.1:8000/api/libraries
curl -H 'Content-Type: application/json' -d '{"name":"Мастер и Маргарита","author_id":1,"library_id":1}' http://127.0.0.1:8000/api/books
curl http://127.0.0.1:8000/api/books
curl -H 'Content-Type: application/json' -d '{"title":"Portal 2","genre":"Головоломка","price":399}' http://127.0.0.1:8000/api/games
```

POST возвращает созданную запись с ID и код 201. GET возвращает JSON и код 200. PUT принимает все поля записи. DELETE возвращает 204, чтение удалённой записи — 404.

## Отличия от методички

По запросу использованы Flask и SQLite вместо json-server, Angular, Express, MongoDB и Prism. В № 6 работает настоящий API с сохранением данных, а не имитационный сервер. OpenAPI и ReDoc сохранены. Облачное размещение в эту локальную версию не входит. Замену стека и отсутствие облачного размещения нужно согласовать с преподавателем.

Краткий отчёт: `output/pdf/report.pdf`.
