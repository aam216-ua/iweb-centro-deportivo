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

## Pistas (`/venues`)

### Endpoints:

#### POST `/`:
* Recibe `create-venue`
* Responde con `venue`

#### GET `/`:
* Recibe parámetros query opcionales
  * `page` (`int >= 0`), número de página
  * `size` (`int > 0`), tamaño de página
  * `activityId` (`uuid`), filtro tipo de actividad
  * `maxFee` (`0 < float <= 9999.99`), filtro coste máximo
  * `minCapacity` (`0 < int <= 200`), filtro capacidad mínima
  * `status` (`venue-status`), filtro estado de la pista
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

#### GET `/{uid}`:
* Responde:
```json
{
  "id": "e05c9664-2d03-42e1-a601-df5007b7375c",
  "name": "Football Venue",
  "description": "This is a venue",
  "capacity": 15,
  "status": "available",
  "fee": 10.95,
  "activity": {
    "id": "14d8b8e0-31b1-43cf-85f4-f89d9812b1f1",
    "name": "football"
  }
}
```

#### PATCH `/{uid}`
* Recibe `update-user`
* Responde con `update-results`

#### DELETE `/{uid}`
* Responde con `delete-results`

### DTOs:

#### `create-user`
```json
{
  "name": "Football Venue 4112",
  "description": "This is a venue (optional description)",
  "capacity": 15,
  "fee": 325.55,
  "activityId": "{{uuid}}",
  "status": "(optional status, defaults to available)",
}
```

#### `update-user`
* Exactamene igual que `create-user` pero con todos los campos opcionales

#### `venue-status`
```ts
enum VenueStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}
```