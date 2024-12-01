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
  "id" double PRIMARY KEY,
  "tipo" varchar2 NOT NULL,
  "descripcion" varchar2,
  "estado" varchar2
);

CREATE TABLE "reserva" (
  "id" double,
  "id_usuario" double,
  "id_usuario_reserva" double,
  "id_pista" double,
  "horario" horarios NOT NULL,
  "fecha" date NOT NULL,
  PRIMARY KEY ("id", "id_usuario", "id_usuario_reserva", "id_pista")
);

CREATE TABLE "usuario" (
  "id" double PRIMARY KEY,
  "email" varchar2 NOT NULL,
  "nombre" varchar2 NOT NULL,
  "apellidos" varchar2,
  "teléfono" varchar2,
  "privilegios" privilegios NOT NULL,
  "estado" estado NOT NULL,
  "saldo" float
);

CREATE TABLE "pswd_usuario" (
  "id" double,
  "id_usuario" double,
  "fecha" date NOT NULL,
  PRIMARY KEY ("id", "id_usuario")
);

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "pswd_usuario" ("id_usuario");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_usuario");

ALTER TABLE "usuario" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_usuario_reserva");

ALTER TABLE "pista" ADD FOREIGN KEY ("id") REFERENCES "reserva" ("id_pista");
