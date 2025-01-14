CREATE TYPE "privilegios" AS ENUM (
  'no_socio',
  'socio',
  'recepcionista',
  'web_master'
);

CREATE TYPE "estado" AS ENUM (
  'pendiente',
  'activo',
  'bloqueado',
  'de_baja'
);

CREATE TYPE "horarios" AS ENUM (
  '0800_0930',
  '0930_1100',
  '1100_1230',
  '1230_1400',
  '1400_1530',
  '1530_1700',
  '1700_1830',
  '1830_2000',
  '2000_2130'
);

CREATE TABLE "pista" (
  "id" uuid PRIMARY KEY,
  "tipo" uuid NOT NULL,
  "descripcion" varchar2,
  "estado" varchar2 NOT NULL,
  "precio" float NOT NULL,
  "imagen" blob
);

CREATE TABLE "reserva" (
  "id" uuid,
  "id_usuario" uuid,
  "id_usuario_reserva" uuid,
  "id_pista" uuid,
  "horario" horarios NOT NULL,
  "fecha" date NOT NULL,
  "precio" float NOT NULL,
  PRIMARY KEY ("id", "id_usuario", "id_usuario_reserva", "id_pista")
);

CREATE TABLE "usuario" (
  "id" uuid PRIMARY KEY,
  "email" varchar2 NOT NULL,
  "nombre" varchar2 NOT NULL,
  "apellidos" varchar2,
  "teléfono" varchar2,
  "privilegios" privilegios NOT NULL,
  "estado" estado NOT NULL,
  "saldo" float
);

CREATE TABLE "pswd_usuario" (
  "id" uuid,
  "id_usuario" uuid,
  "fecha" date NOT NULL,
  PRIMARY KEY ("id", "id_usuario")
);

CREATE TABLE "tipo" (
  "id" uuid PRIMARY KEY,
  "nombre" varchar2 NOT NULL
);

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "pswd_usuario" ("id_usuario");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_usuario");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_usuario_reserva");

ALTER TABLE "pista" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_pista");

ALTER TABLE "pista" ADD FOREIGN KEY ("precio") REFERENCES "reserva" ("precio");

ALTER TABLE "tipo" ADD FOREIGN KEY ("id") REFERENCES "pista" ("tipo");
