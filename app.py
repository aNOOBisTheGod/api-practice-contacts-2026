import sqlite3
from pathlib import Path

from flask import Flask, abort, g, jsonify, redirect, render_template, request, send_file

app = Flask(__name__)
app.config['DATABASE'] = Path(__file__).with_name('data.sqlite3')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024

FIELDS = {
    'authors': ['name'],
    'libraries': ['name', 'city'],
    'books': ['name', 'author_id', 'library_id'],
    'contacts': ['name', 'phone'],
    'games': ['title', 'genre', 'price'],
}


def database():
    if 'db' not in g:
        g.db = sqlite3.connect(app.config['DATABASE'])
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA foreign_keys = ON')
    return g.db


@app.teardown_appcontext
def close_database(error=None):
    if 'db' in g:
        g.db.close()


def init_database():
    with app.app_context():
        database().executescript('''
            CREATE TABLE IF NOT EXISTS authors (
                id INTEGER PRIMARY KEY, name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS libraries (
                id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY, name TEXT NOT NULL,
                author_id INTEGER NOT NULL REFERENCES authors(id),
                library_id INTEGER NOT NULL REFERENCES libraries(id)
            );
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY, title TEXT NOT NULL,
                genre TEXT NOT NULL, price REAL NOT NULL CHECK(price >= 0)
            );
        ''')


def read_values(resource, data):
    if not isinstance(data, dict):
        abort(400, 'Нужен JSON-объект')
    values = []
    for field in FIELDS[resource]:
        value = data.get(field, '')
        try:
            if field.endswith('_id'):
                value = int(value)
            elif field == 'price':
                value = float(value)
                if not 0 <= value < float('inf'):
                    raise ValueError()
            else:
                if not isinstance(value, str) or not value.strip():
                    raise ValueError()
                value = value.strip()
        except (ValueError, TypeError, OverflowError):
            abort(400, f'Некорректное поле: {field}')
        values.append(value)
    return values


@app.route('/api/<resource>', methods=['GET', 'POST'])
@app.route('/api/<resource>/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def api(resource, item_id=None):
    if resource not in FIELDS:
        abort(404)
    db = database()
    # Названия таблиц и полей берутся только из FIELDS, значения - через параметры.
    fields = FIELDS[resource]
    row = None
    if item_id is not None:
        row = db.execute(f'SELECT * FROM {resource} WHERE id = ?', (item_id,)).fetchone()
        if row is None:
            abort(404, 'Запись не найдена')

    if request.method == 'GET':
        if row is not None:
            return jsonify(dict(row))
        rows = db.execute(f'SELECT * FROM {resource} ORDER BY id').fetchall()
        return jsonify([dict(row) for row in rows])

    if request.method == 'DELETE':
        db.execute(f'DELETE FROM {resource} WHERE id = ?', (item_id,))
        db.commit()
        return '', 204

    values = read_values(resource, request.get_json())
    if request.method == 'POST':
        placeholders = ', '.join('?' for field in fields)
        cursor = db.execute(
            f'INSERT INTO {resource} ({", ".join(fields)}) VALUES ({placeholders})',
            values,
        )
        item_id = cursor.lastrowid
    else:
        assignments = ', '.join(f'{field} = ?' for field in fields)
        db.execute(f'UPDATE {resource} SET {assignments} WHERE id = ?', [*values, item_id])
    db.commit()
    row = db.execute(f'SELECT * FROM {resource} WHERE id = ?', (item_id,)).fetchone()
    return jsonify(dict(row)), 201 if request.method == 'POST' else 200


@app.route('/', methods=['GET', 'POST'])
def contacts():
    db = database()
    if request.method == 'POST':
        values = read_values('contacts', request.form.to_dict())
        if request.form.get('id'):
            db.execute('UPDATE contacts SET name = ?, phone = ? WHERE id = ?', [*values, request.form['id']])
        else:
            db.execute('INSERT INTO contacts (name, phone) VALUES (?, ?)', values)
        db.commit()
        return redirect('/')
    rows = db.execute('SELECT * FROM contacts ORDER BY id').fetchall()
    editing = db.execute('SELECT * FROM contacts WHERE id = ?', (request.args.get('edit'),)).fetchone()
    return render_template('index.html', contacts=rows, editing=editing)


@app.post('/contacts/<int:item_id>/delete')
def delete_contact(item_id):
    database().execute('DELETE FROM contacts WHERE id = ?', (item_id,))
    database().commit()
    return redirect('/')


@app.get('/docs')
def docs():
    return render_template('docs.html')


@app.get('/openapi.json')
def specification():
    return send_file(Path(__file__).with_name('openapi.json'))


@app.errorhandler(sqlite3.IntegrityError)
def invalid_relation(error):
    return jsonify(error='Проверьте данные и существование автора/библиотеки'), 400


@app.errorhandler(400)
@app.errorhandler(404)
def request_error(error):
    return jsonify(error=error.description), error.code


if __name__ == '__main__':
    init_database()
    app.run(host='127.0.0.1', port=8000)
