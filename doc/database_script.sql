CREATE TYPE "user_status" AS ENUM (
  'pendiente',
  'aceptado',
  'bloqueado',
  'de_baja'
);

CREATE TYPE "user_privileges" AS ENUM (
  'socio',
  'recepcionista',
  'administrador'
);

CREATE TYPE "horarios" AS ENUM (
  '0800_0930',
  '0930_1100',
  '1100_1230',
  '1230_1400',
  '1400_1530',
  '1530_1700',
  '1700_1830',
  '1830_2000'
);

CREATE TYPE "tipo_instalacion" AS ENUM (
  'campo_futbol',
  'campo_rugby',
  'pista_baloncesto',
  'pista_futbol_sala',
  'pista_tenis',
  'pista_atletismo',
  'otros'
);

CREATE TABLE "Usuario" (
  "id" integer PRIMARY KEY,
  "email" varchar2 UNIQUE NOT NULL,
  "password" hash NOT NULL,
  "nombre" varchar NOT NULL,
  "apellidos" varchar2,
  "telefono" integer,
  "saldo" integer NOT NULL,
  "estado" user_status NOT NULL,
  "tipo" user_privileges NOT NULL
);

CREATE TABLE "Instalacion" (
  "id" integer PRIMARY KEY,
  "nombre" varchar2 NOT NULL,
  "precio" integer NOT NULL,
  "tipo" tipo_instalacion NOT NULL,
  "descripcion" varchar2
);

CREATE TABLE "Reserva" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "instalacion_id" integer NOT NULL,
  "precio_instalacion" integer NOT NULL,
  "contacto" varchar2,
  "fecha_reserva" date NOT NULL,
  "horario" horarios NOT NULL,
  "fecha_uso" date NOT NULL
);

ALTER TABLE "Usuario" ADD FOREIGN KEY ("id") REFERENCES "Reserva" ("user_id");

ALTER TABLE "Instalacion" ADD FOREIGN KEY ("id") REFERENCES "Reserva" ("instalacion_id");

ALTER TABLE "Instalacion" ADD FOREIGN KEY ("precio") REFERENCES "Reserva" ("precio_instalacion");
