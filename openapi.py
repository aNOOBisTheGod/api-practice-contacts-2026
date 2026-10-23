"""Описание CRUD API из того же списка полей, который использует сервер."""


def field_schema(field):
    if field.endswith('_id'):
        return {'type': 'integer', 'example': 1}
    if field == 'price':
        return {'type': 'number', 'minimum': 0, 'example': 399}
    return {'type': 'string', 'minLength': 1, 'pattern': r'\S', 'example': 'Пример'}


def json_content(schema):
    return {'application/json': {'schema': schema}}


def make_openapi(resources):
    paths = {}
    schemas = {}
    for resource, fields in resources.items():
        input_schema = {
            'type': 'object',
            'required': list(fields),
            'properties': {field: field_schema(field) for field in fields},
        }
        schemas[resource + 'Input'] = input_schema
        schemas[resource] = {
            'type': 'object',
            'required': ['id', *fields],
            'properties': {'id': {'type': 'integer'}, **input_schema['properties']},
        }
        item = {'$ref': f'#/components/schemas/{resource}'}
        body = {
            'required': True,
            'content': json_content({'$ref': f'#/components/schemas/{resource}Input'}),
        }
        collection = {}
        detail = {
            'parameters': [{
                'name': 'id', 'in': 'path', 'required': True,
                'schema': {'type': 'integer', 'minimum': 0},
            }],
        }
        operations = [
            (collection, 'get', 'Список', '200', {'type': 'array', 'items': item}),
            (collection, 'post', 'Создать', '201', item),
            (detail, 'get', 'Получить', '200', item),
            (detail, 'put', 'Изменить', '200', item),
            (detail, 'delete', 'Удалить', '204', None),
        ]
        for target, method, summary, status, schema in operations:
            response = {'description': summary}
            if schema is not None:
                response['content'] = json_content(schema)
            operation = {
                'tags': [resource],
                'summary': summary,
                'responses': {status: response},
            }
            if target is detail:
                operation['responses']['404'] = {'description': 'Запись не найдена'}
            if method in ('post', 'put'):
                operation['requestBody'] = body
                operation['responses']['400'] = {'description': 'Некорректные данные'}
                operation['responses']['415'] = {'description': 'Нужен Content-Type: application/json'}
            target[method] = operation
        paths[f'/api/{resource}'] = collection
        paths[f'/api/{resource}/{{id}}'] = detail
    return {
        'openapi': '3.0.3',
        'info': {'title': 'Практические 4–6: API', 'version': '1.0.0'},
        'servers': [{'url': '/'}],
        'paths': paths,
        'components': {'schemas': schemas},
    }
