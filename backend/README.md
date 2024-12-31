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
## Actividades (`/activities`)

### Endpoints:

#### GET `/`:
* Responde:
```json
[
  {
    "id": "de2fcc50-72af-4aa7-9e17-49176aa9edc5",
    "name": "football"
  },
  {
    "id": "0259f490-0e13-4a4f-96ee-465b05cbc939",
    "name": "tennis"
  },
  {
    "id": "69f7c96d-8d82-4545-a0d4-bd28f82595b9",
    "name": "basketball"
  }
]
```

## Bookings (`/bookings`)

### Endpoints:

#### POST `/`:
* Requiere autenticación
* Recibe `CreateBookingDto`
* Responde `Booking`
* Si el usuario tiene el rol `customer`, requiere que el `appointer`, `appointee` y el usuario que ha iniciado tengan todos la misma UUID
* Si el usuario tiene un rol superior, no hay requisitos en cuanto a la creación
* `appointer` es la persona que crea la reserva, y `appointee` la persona que atiende a ella

#### GET `/`:
* Requiere autenticación
* Recibe `QueryBookingDto`
* Responde con `QueryResults<Booking>`
* Si el usuario tiene el rol `customer`, automaticamente filtrará para mostrar solo las reservas a las que deba atender él
* No se aplican filtros automáticos de seguridad para ningún otro rol

#### GET `/{uid}`:
* Requiere autenticación con rol `receptionist` o superior
* Responde con `Booking`

#### PATCH `/{uid}`:
* Requiere autenticación con rol `receptionist` o superior
* Responde con `UpdateResults` 

#### DELETE `/{uid}`:
* Requiere autenticación con rol `receptionist` o superior
* Responde con `DeleteResults`

### DTOs:

```ts
export class CreateBookingDto {
  @MinDate(new Date(new Date().setHours(0, 0, 0, 0)))
  date: Date;

  @IsEnum(BookingTurn)
  turn: BookingTurn;

  @IsUUID()
  appointerId: string;

  @IsUUID()
  appointeeId: string;

  @IsUUID()
  venueId: string;
}
```

```ts
export class UpdateBookingDto extends PartialType(
  PickType(CreateBookingDto, ['date', 'turn', 'venueId'] as const)
) {}
```

```ts
export class QueryBookingDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  appointerId: string;

  @IsOptional()
  @IsUUID()
  appointeeId: string;

  @IsOptional()
  @IsUUID()
  venueId: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value as Date).setHours(0, 0, 0, 0))
  after: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value as Date).setHours(0, 0, 0, 0))
  before: Date;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC';
}
```

```ts
export enum BookingTurn {
  TURN_08_00 = '08:00',
  TURN_09_30 = '09:30',
  TURN_11_00 = '11:00',
  TURN_12_30 = '12:30',
  TURN_14_00 = '14:00',
  TURN_15_30 = '15:30',
  TURN_17_00 = '17:00',
  TURN_18_30 = '18:30',
  TURN_20_00 = '20:00',
  TURN_21_30 = '21:30',
}
```