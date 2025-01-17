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
\.


--
-- Data for Name: password; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.password (id, password, "createdAt", "deletedAt", "userId") FROM stdin;
69c8c3d1-b62c-4e52-b7c6-69c1df4b869a	$argon2id$v=19$m=65536,t=3,p=4$zXByy6rTEVp/3sl7i29AbQ$j2H6qBhvMgotEe9vAJ/c7Lxcsv9dzQZZlXb5blWF+8k	2024-12-30 23:37:08.427862	\N	ca0be172-c368-4771-88db-545ac8fa7a7f
08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd	$argon2id$v=19$m=65536,t=3,p=4$Ogkw4qSAFDMPNK+YkRaQ7w$vM+qRJ8+f0JINOmCUrlDjihupIOyaeFADApXvP7uzmg	2024-12-30 23:37:56.423025	\N	500fcbd6-42c5-4e27-8f4d-604ab83509d0
8da7d749-8997-4115-a896-1301d2d19da5	$argon2id$v=19$m=65536,t=3,p=4$W9pBnWQk8bVwQ1++ylmfkA$he37fipogNiahJNzkZOSO05uEKOxfZBBrxi+imtbhY8	2024-12-30 23:38:29.012537	\N	1eaf5e0e-bb26-4279-8a6f-8ecbe74bd2f4
380dea2d-f492-47a8-ba34-a966f33407e4	$argon2id$v=19$m=65536,t=3,p=4$7AM9lnBKQz0lvqBf++2ypA$CnLRa3B16vfRJmBTk6dpwZzisypzCcxEMqMqvJHN5Uk	2024-12-30 23:38:49.648643	\N	281f1361-ce49-4d4b-88aa-cb8025fe9a0a
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."user" (id, email, name, surname, phone, role, balance, "createdAt", "updatedAt", "deletedAt", status) FROM stdin;
1eaf5e0e-bb26-4279-8a6f-8ecbe74bd2f4	admin@ua.es	admin	example	1	admin	0.00	2024-12-30 23:38:29.012537	2024-12-30 23:38:29.012537	\N	created
281f1361-ce49-4d4b-88aa-cb8025fe9a0a	superadmin@ua.es	superadmin	example	0	superadmin	0.00	2024-12-30 23:38:49.648643	2024-12-30 23:38:49.648643	\N	created
500fcbd6-42c5-4e27-8f4d-604ab83509d0	receptionist@ua.es	receptionist	example	2	receptionist	0.00	2024-12-30 23:37:56.423025	2024-12-30 23:37:56.423025	\N	created
ca0be172-c368-4771-88db-545ac8fa7a7f	customer@ua.es	customer	example	3	customer	0.00	2024-12-30 23:37:08.427862	2024-12-30 23:37:08.427862	\N	created
\.


--
-- Data for Name: venue; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.venue (id, name, description, capacity, status, fee, "createdAt", "updatedAt", "activityId") FROM stdin;
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
