# Documentación de la API

URL: `http://localhost:3000/api`

## Sesión (`/auth`)

### Endpoints:

#### POST `/signin`:
* Recibe `auth-credentials`
* Responde:
```json
{
  "token": "jwt_token",
  "user": {}
}
```

#### PATCH `/reset`:
* Recibe unión de `auth-credentials` y `update-credentials`
* Responde únicamente con un status code

#### POST `/signout`: No implementado

### DTOs:

#### `auth-credentials`:
```json
{
  "email": "email",
  "password": "password"
}
```
#### `update-credentials`:
```json
{
  "newPassword": "newpassword"
}
```

## Usuarios (`/users`)

### Endpoints:

#### POST `/`:
* Recibe `create-user`
* Responde `user`

#### GET `/`:
* Recibe dos parámetros query opcionales
  * `page` (`int >= 0`), número de página
  * `size` (`int > 0`), tamaño de página
* Responde:
```json
{
  "meta": {
    "page": 0,
    "size": 10,
    "total": 3,
  },
  "data": []
}
```

#### GET `/{uuid}`:
* Responde:
```json
{
  "id": "290fe31e-68aa-4a95-83c6-994af2e76e0f",
  "email": "user@ua.es",
  "name": "Hugo",
  "surname": "Huertas",
  "phone": "+34637672450",
  "role": "customer",
  "balance": "$0.00",
  "createdAt": "2024-12-27T16:55:37.283Z",
  "updatedAt": "2024-12-27T16:55:37.283Z",
  "deletedAt": null
}
```

#### PATCH `/{uuid}`:
* Recibe `update-user`
* Responde con `update-results`

#### DELETE `/{uuid}`:
* Responde únicamente con un status code

### DTOs:

#### `create-user`:
```json
{
  "email": "hhb1@alu.ua.es",
  "password": "password",
  "name": "Hugo",
  "surname": "Huertas",
  "phone": "+34 637000000"
}
```

#### `update-user`:
```json
{
  "email": "hhb1@alu.ua.es",
  "name": "Hugo",
  "surname": "Huertas",
  "phone": "+34 637000000"
}
```
* Todos los parámetros son opcionales