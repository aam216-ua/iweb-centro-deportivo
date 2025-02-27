--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: booking_turn_enum; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.booking_turn_enum AS ENUM (
    '08:00',
    '09:30',
    '11:00',
    '12:30',
    '14:00',
    '15:30',
    '17:00',
    '18:30',
    '20:00',
    '21:30'
);


ALTER TYPE public.booking_turn_enum OWNER TO "user";

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.user_role_enum AS ENUM (
    'superadmin',
    'admin',
    'receptionist',
    'customer'
);


ALTER TYPE public.user_role_enum OWNER TO "user";

--
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.user_status_enum AS ENUM (
    'pending',
    'created',
    'blocked'
);


ALTER TYPE public.user_status_enum OWNER TO "user";

--
-- Name: venue_status_enum; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.venue_status_enum AS ENUM (
    'available',
    'unavailable'
);


ALTER TYPE public.venue_status_enum OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.activity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.activity OWNER TO "user";

--
-- Name: booking; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.booking (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date date NOT NULL,
    turn public.booking_turn_enum NOT NULL,
    fee numeric(6,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "appointerId" uuid NOT NULL,
    "appointeeId" uuid NOT NULL,
    "venueId" uuid NOT NULL
);


ALTER TABLE public.booking OWNER TO "user";

--
-- Name: password; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.password (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" uuid
);


ALTER TABLE public.password OWNER TO "user";

--
-- Name: user; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    phone character varying NOT NULL,
    role public.user_role_enum DEFAULT 'customer'::public.user_role_enum NOT NULL,
    balance numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    status public.user_status_enum DEFAULT 'pending'::public.user_status_enum NOT NULL
);


ALTER TABLE public."user" OWNER TO "user";

--
-- Name: venue; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.venue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    capacity integer NOT NULL,
    status public.venue_status_enum DEFAULT 'available'::public.venue_status_enum NOT NULL,
    fee numeric(6,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "activityId" uuid NOT NULL
);


ALTER TABLE public.venue OWNER TO "user";

--
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.activity (id, name) FROM stdin;
84619cfc-2e12-47af-9df7-05dce103e9ea	Pádel
8d4413cf-82d0-4b74-beb0-1ee0b0082e9e	Baloncesto
557eba62-c2ba-48b3-9117-4c703c7f787e	Fútbol
968af143-2b03-411a-b5cd-e37a285ff403	Bádminton
4cfa6c82-4f81-4846-8292-c86c502e0b19	Voleyball
6db20603-e31b-419f-96b6-32b232664890	Tenis
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.booking (id, date, turn, fee, "createdAt", "updatedAt", "appointerId", "appointeeId", "venueId") FROM stdin;
d884e028-382a-4051-9e5b-d7f49ea4e974	2025-01-18	09:30	30.00	2025-01-17 12:10:38.086542	2025-01-17 12:10:38.086542	ca0be172-c368-4771-88db-545ac8fa7a7f	ca0be172-c368-4771-88db-545ac8fa7a7f	39be3227-04bd-4fb0-b5e2-679c872e5629
4bdb07f7-a861-4ff4-b2d6-14f59bbc3990	2025-01-18	09:30	15.00	2025-01-17 12:10:45.792204	2025-01-17 12:10:45.792204	ca0be172-c368-4771-88db-545ac8fa7a7f	ca0be172-c368-4771-88db-545ac8fa7a7f	8242871b-531f-4046-89a3-ba1ac0123a00
c035e40f-afb0-405d-be18-5653916ab505	2025-01-18	09:30	12.00	2025-01-17 12:10:57.558765	2025-01-17 12:10:57.558765	ca0be172-c368-4771-88db-545ac8fa7a7f	ca0be172-c368-4771-88db-545ac8fa7a7f	c9427871-f907-42c5-aa3a-98748652c4d8
8ad18e6f-1dc2-4e92-9fc5-ec99f80797c8	2025-01-19	12:30	25.00	2025-01-17 12:14:07.433546	2025-01-17 12:14:07.433546	500fcbd6-42c5-4e27-8f4d-604ab83509d0	37c686b3-8786-4dbd-8412-cc7a73cc0e7b	32c52414-365c-48b1-a535-07a0dc3f2076
e626cd3d-d1fc-4101-986a-b9ec8f6b9c2e	2025-01-20	11:00	30.00	2025-01-17 12:26:50.501155	2025-01-17 12:26:50.501155	500fcbd6-42c5-4e27-8f4d-604ab83509d0	37c686b3-8786-4dbd-8412-cc7a73cc0e7b	a868a2cd-019a-41dc-ab38-13823cd6edff
3a0fbdb8-9313-43ee-a920-b8616d48c18f	2025-01-30	20:00	35.00	2025-01-17 12:27:12.834666	2025-01-17 12:27:12.834666	500fcbd6-42c5-4e27-8f4d-604ab83509d0	37c686b3-8786-4dbd-8412-cc7a73cc0e7b	640464bc-bd52-4a72-b55b-8d5b9148c54e
c8718a4e-db86-4c2e-832d-b45abfdb606f	2025-01-22	21:30	18.00	2025-01-17 12:30:26.132297	2025-01-17 12:30:26.132297	500fcbd6-42c5-4e27-8f4d-604ab83509d0	ef08e663-bf78-43d0-9228-c9d1263332ec	266451b9-1410-4d1c-ac4e-ebcfc789dd2d
45bcf150-4ef8-464f-a4b2-9dd06b08e31d	2025-01-24	20:00	35.00	2025-01-17 12:31:03.762867	2025-01-17 12:31:03.762867	500fcbd6-42c5-4e27-8f4d-604ab83509d0	ef08e663-bf78-43d0-9228-c9d1263332ec	640464bc-bd52-4a72-b55b-8d5b9148c54e
db896cb9-4ff1-4c54-b043-27da86b47145	2025-01-31	08:00	100.00	2025-01-17 12:31:19.793864	2025-01-17 12:31:19.793864	500fcbd6-42c5-4e27-8f4d-604ab83509d0	ef08e663-bf78-43d0-9228-c9d1263332ec	64799bd0-44f1-4bb4-8fb4-8cfa2d1b916c
15d2a72c-a28f-4917-b4c3-d490ab988337	2025-01-22	12:30	20.00	2025-01-17 12:41:39.067869	2025-01-17 12:41:39.067869	f16a4ea1-ff3e-49d3-825f-009a38bba512	f16a4ea1-ff3e-49d3-825f-009a38bba512	48a7ec53-e696-4d68-bb8c-bd71da23728c
e8b03095-51bb-4c30-bc0b-fed7d938f973	2025-01-30	15:30	20.00	2025-01-17 12:42:04.529974	2025-01-17 12:42:04.529974	f16a4ea1-ff3e-49d3-825f-009a38bba512	f16a4ea1-ff3e-49d3-825f-009a38bba512	be5fa23d-a1aa-47d8-b826-132913122112
ad471c77-ff42-4830-bdf8-90685410888d	2025-01-12	20:00	30.00	2025-01-17 12:41:21.397129	2025-01-17 12:41:21.397129	f16a4ea1-ff3e-49d3-825f-009a38bba512	f16a4ea1-ff3e-49d3-825f-009a38bba512	9681f954-0f0f-4713-8d87-999ac3f6638b
\.


--
-- Data for Name: password; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.password (id, password, "createdAt", "deletedAt", "userId") FROM stdin;
69c8c3d1-b62c-4e52-b7c6-69c1df4b869a	$argon2id$v=19$m=65536,t=3,p=4$zXByy6rTEVp/3sl7i29AbQ$j2H6qBhvMgotEe9vAJ/c7Lxcsv9dzQZZlXb5blWF+8k	2024-12-30 23:37:08.427862	\N	ca0be172-c368-4771-88db-545ac8fa7a7f
08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd	$argon2id$v=19$m=65536,t=3,p=4$Ogkw4qSAFDMPNK+YkRaQ7w$vM+qRJ8+f0JINOmCUrlDjihupIOyaeFADApXvP7uzmg	2024-12-30 23:37:56.423025	\N	500fcbd6-42c5-4e27-8f4d-604ab83509d0
8da7d749-8997-4115-a896-1301d2d19da5	$argon2id$v=19$m=65536,t=3,p=4$W9pBnWQk8bVwQ1++ylmfkA$he37fipogNiahJNzkZOSO05uEKOxfZBBrxi+imtbhY8	2024-12-30 23:38:29.012537	\N	1eaf5e0e-bb26-4279-8a6f-8ecbe74bd2f4
380dea2d-f492-47a8-ba34-a966f33407e4	$argon2id$v=19$m=65536,t=3,p=4$7AM9lnBKQz0lvqBf++2ypA$CnLRa3B16vfRJmBTk6dpwZzisypzCcxEMqMqvJHN5Uk	2024-12-30 23:38:49.648643	\N	281f1361-ce49-4d4b-88aa-cb8025fe9a0a
eebe622e-5610-444e-9cc2-b359b4d04638	$argon2id$v=19$m=65536,t=3,p=4$1G96erHWoK0aJTXyO7/11Q$lNctsRTmvN5hadxzY7aCm7/PU+OaPvwecz3KnSMqbEk	2025-01-17 11:12:08.89243	\N	f16a4ea1-ff3e-49d3-825f-009a38bba512
da2142af-0180-4012-952a-c2c168a069e1	$argon2id$v=19$m=65536,t=3,p=4$h2ft4IH4ACXLm2E3LoFkVw$eRBFzYx7lTPz2mhllPOsADCnsornN3TRKV+mk6CaLLc	2025-01-17 11:52:25.89419	\N	1b330e8a-9cb1-492b-a027-9bd4c6a94dfe
51e5c80b-5033-4f1b-ab16-79d1a1931587	$argon2id$v=19$m=65536,t=3,p=4$Subzum/VtJbpuVObjUYIoA$egdkQtNdyWza4D/EomFmswRjekjykVDbZsis32d+/Ho	2025-01-17 12:34:05.239562	\N	9ae1ae19-8a1c-45f0-a5c1-b6bc0a620287
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."user" (id, email, name, surname, phone, role, balance, "createdAt", "updatedAt", "deletedAt", status) FROM stdin;
1eaf5e0e-bb26-4279-8a6f-8ecbe74bd2f4	admin@ua.es	admin	example	1	admin	0.00	2024-12-30 23:38:29.012537	2024-12-30 23:38:29.012537	\N	created
281f1361-ce49-4d4b-88aa-cb8025fe9a0a	superadmin@ua.es	superadmin	example	0	superadmin	0.00	2024-12-30 23:38:49.648643	2024-12-30 23:38:49.648643	\N	created
500fcbd6-42c5-4e27-8f4d-604ab83509d0	receptionist@ua.es	receptionist	example	2	receptionist	0.00	2024-12-30 23:37:56.423025	2024-12-30 23:37:56.423025	\N	created
ca0be172-c368-4771-88db-545ac8fa7a7f	customer@ua.es	customer	example	3	customer	43.00	2024-12-30 23:37:08.427862	2025-01-17 12:10:57.548834	\N	created
37c686b3-8786-4dbd-8412-cc7a73cc0e7b	mario@ua.es	Mario	Davo	+34 966 00 00 02	customer	0.00	2025-01-17 12:12:05.298151	2025-01-17 12:12:05.298151	\N	pending
ef08e663-bf78-43d0-9228-c9d1263332ec	hugo@ua.es	Hugo	Huertas	+34 966 00 00 03	customer	0.00	2025-01-17 12:29:53.698242	2025-01-17 12:29:53.698242	\N	pending
1b330e8a-9cb1-492b-a027-9bd4c6a94dfe	aurora@ua.es	Aurora	Andreu	+34 966 00 00 01	customer	0.00	2025-01-17 11:52:25.89419	2025-01-17 12:32:52.515006	\N	pending
9ae1ae19-8a1c-45f0-a5c1-b6bc0a620287	arturo@ua.es	Arturo	Sanchez	+34 966 00 00 04	customer	0.00	2025-01-17 12:33:32.514473	2025-01-17 12:35:38.426966	\N	blocked
f16a4ea1-ff3e-49d3-825f-009a38bba512	ruben@ua.es	Ruben	Castillo	+34 966 00 00 00	customer	130.00	2025-01-17 11:12:08.89243	2025-01-17 12:42:04.519507	\N	created
\.


--
-- Data for Name: venue; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.venue (id, name, description, capacity, status, fee, "createdAt", "updatedAt", "activityId") FROM stdin;
32c52414-365c-48b1-a535-07a0dc3f2076	Pista de Pádel Cubierta	Ideal para jugar en cualquier clima, cuenta con iluminación LED y suelo de césped sintético.	4	available	25.00	2025-01-17 11:56:10.444501	2025-01-17 11:56:10.444501	84619cfc-2e12-47af-9df7-05dce103e9ea
3304f19a-a53a-47b1-8eca-c669031e1527	Pista de Pádel Exterior	Superficie de cristal y césped artificial, perfecta para disfrutar del aire libre	4	available	18.00	2025-01-17 11:57:07.514456	2025-01-17 11:57:07.514456	84619cfc-2e12-47af-9df7-05dce103e9ea
7046c7ac-04af-41e7-9bea-52abc2f2b2f5	Pista de áídel Premium	Cubierta, con climatización y suelo profesional de World Padel Tour.	4	available	35.00	2025-01-17 11:57:27.533662	2025-01-17 11:57:27.533662	84619cfc-2e12-47af-9df7-05dce103e9ea
39be3227-04bd-4fb0-b5e2-679c872e5629	Pista de Baloncesto Indoor	Pavimento de madera con sistema de amortiguación, ideal para competiciones.	12	available	30.00	2025-01-17 11:59:22.680739	2025-01-17 11:59:22.680739	8d4413cf-82d0-4b74-beb0-1ee0b0082e9e
8242871b-531f-4046-89a3-ba1ac0123a00	Pista de Baloncesto Exterior	Cancha de hormigón pulido con marcajes profesionales y aros de altura regulable.	18	available	15.00	2025-01-17 11:59:53.918113	2025-01-17 11:59:53.918113	8d4413cf-82d0-4b74-beb0-1ee0b0082e9e
c9427871-f907-42c5-aa3a-98748652c4d8	Pista de Baloncesto 3x3	Espacio reducido con suelo de resina especial, perfecta para partidos rápidos.	8	available	12.00	2025-01-17 12:00:17.537193	2025-01-17 12:00:17.537193	8d4413cf-82d0-4b74-beb0-1ee0b0082e9e
64799bd0-44f1-4bb4-8fb4-8cfa2d1b916c	Campo de Fútbol 11	Césped natural, iluminación profesional y gradería para espectadores.	30	available	100.00	2025-01-17 12:01:08.923311	2025-01-17 12:01:08.923311	557eba62-c2ba-48b3-9117-4c703c7f787e
972c0809-89d1-4ced-9761-141f78f9a166	Campo de Fútbol 7	Césped artificial de última generación con zonas de seguridad.	20	available	50.00	2025-01-17 12:01:32.77217	2025-01-17 12:01:32.77217	557eba62-c2ba-48b3-9117-4c703c7f787e
9681f954-0f0f-4713-8d87-999ac3f6638b	Campo de Fútbol Sala	Pista cubierta de parquet con medidas reglamentarias FIFA.	15	available	30.00	2025-01-17 12:01:55.60803	2025-01-17 12:01:55.60803	557eba62-c2ba-48b3-9117-4c703c7f787e
48a7ec53-e696-4d68-bb8c-bd71da23728c	Pista de Badminton Indoor	Suelo de vinilo con amortiguación, ideal para torneos.	2	available	20.00	2025-01-17 12:02:36.980866	2025-01-17 12:02:36.980866	968af143-2b03-411a-b5cd-e37a285ff403
cca9b4e3-9af0-49c3-8d5b-a81351c4017b	Pista de Badminton Exterior	Superficie de resina con red desmontable.	2	available	12.00	2025-01-17 12:03:01.153542	2025-01-17 12:03:01.153542	968af143-2b03-411a-b5cd-e37a285ff403
a868a2cd-019a-41dc-ab38-13823cd6edff	Pista de Badminton Profesional	Instalación climatizada con suelo certificado.	4	available	30.00	2025-01-17 12:03:19.481052	2025-01-17 12:03:19.481052	968af143-2b03-411a-b5cd-e37a285ff403
266451b9-1410-4d1c-ac4e-ebcfc789dd2d	Pista de Voley Playa	Arena fina con red de competición, ideal para entrenamientos y torneos.	12	available	18.00	2025-01-17 12:03:54.650424	2025-01-17 12:03:54.650424	4cfa6c82-4f81-4846-8292-c86c502e0b19
64914e95-8492-4788-ba11-472a3a7de90c	Pista de Voley Cubierta	Suelo de goma y altura reglamentaria para partidos oficiales.	12	available	25.00	2025-01-17 12:04:11.993284	2025-01-17 12:04:11.993284	4cfa6c82-4f81-4846-8292-c86c502e0b19
914f5486-3524-467e-ae77-d904fa5be59b	Pista de Voley Exterior	Superficie de hormigón con pintura antideslizante.	10	available	15.00	2025-01-17 12:04:33.554626	2025-01-17 12:04:33.554626	4cfa6c82-4f81-4846-8292-c86c502e0b19
dafd0c52-1b1d-403a-ab71-21954564f430	Pista de Tenis de Tierra Batida	Superficie clásica con drenaje avanzado y mantenimiento diario.	4	available	30.00	2025-01-17 12:07:04.143611	2025-01-17 12:07:04.143611	6db20603-e31b-419f-96b6-32b232664890
be5fa23d-a1aa-47d8-b826-132913122112	Pista de Tenis Dura	Cancha de resina sintética, rápida y con excelente bote de la pelota.	4	available	20.00	2025-01-17 12:07:19.070833	2025-01-17 12:07:19.070833	6db20603-e31b-419f-96b6-32b232664890
640464bc-bd52-4a72-b55b-8d5b9148c54e	Pista de Tenis Cubierta	Instalación climatizada con superficie de césped artificial.	4	available	35.00	2025-01-17 12:07:44.444279	2025-01-17 12:07:44.444279	6db20603-e31b-419f-96b6-32b232664890
\.

--
-- Name: activity PK_24625a1d6b1b089c8ae206fe467; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY (id);


--
-- Name: booking PK_49171efc69702ed84c812f33540; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY (id);


--
-- Name: venue PK_c53deb6d1bcb088f9d459e7dbc0; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "PK_c53deb6d1bcb088f9d459e7dbc0" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: password PK_cbeb55948781be9257f44febfa0; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.password
    ADD CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY (id);


--
-- Name: venue UQ_824a52c2599d374feff4fd67e93; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "UQ_824a52c2599d374feff4fd67e93" UNIQUE (name);


--
-- Name: user UQ_8e1f623798118e629b46a9e6299; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE (phone);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: booking FK_147c38954821cb6df2d9063f0b7; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_147c38954821cb6df2d9063f0b7" FOREIGN KEY ("venueId") REFERENCES public.venue(id);


--
-- Name: booking FK_26d64aa5a753a7b0b524532365b; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_26d64aa5a753a7b0b524532365b" FOREIGN KEY ("appointerId") REFERENCES public."user"(id);


--
-- Name: venue FK_43212964a7411684623abc6f37f; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "FK_43212964a7411684623abc6f37f" FOREIGN KEY ("activityId") REFERENCES public.activity(id);


--
-- Name: booking FK_664606f9da0e132ba5813f1105d; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_664606f9da0e132ba5813f1105d" FOREIGN KEY ("appointeeId") REFERENCES public."user"(id);


--
-- Name: password FK_dc877602e08545367e6f85b02e5; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.password
    ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--
