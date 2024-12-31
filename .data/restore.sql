PGDMP      '                |            database    17.0    17.2      �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16384    database    DATABASE     s   CREATE DATABASE database WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE database;
                     user    false                        3079    16385 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            i           1247    16433    booking_turn_enum    TYPE     �   CREATE TYPE public.booking_turn_enum AS ENUM (
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
 $   DROP TYPE public.booking_turn_enum;
       public               user    false            o           1247    16462    user_role_enum    TYPE     q   CREATE TYPE public.user_role_enum AS ENUM (
    'superadmin',
    'admin',
    'receptionist',
    'customer'
);
 !   DROP TYPE public.user_role_enum;
       public               user    false            c           1247    16415    venue_status_enum    TYPE     U   CREATE TYPE public.venue_status_enum AS ENUM (
    'available',
    'unavailable'
);
 $   DROP TYPE public.venue_status_enum;
       public               user    false            �            1259    16406    activity    TABLE     ~   CREATE TABLE public.activity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.activity;
       public         heap r       user    false    2            �            1259    16453    booking    TABLE     �  CREATE TABLE public.booking (
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
    DROP TABLE public.booking;
       public         heap r       user    false    2    873            �            1259    16396    password    TABLE       CREATE TABLE public.password (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    password character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);
    DROP TABLE public.password;
       public         heap r       user    false    2            �            1259    16471    user    TABLE     0  CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    surname character varying NOT NULL,
    phone character varying NOT NULL,
    role public.user_role_enum DEFAULT 'customer'::public.user_role_enum NOT NULL,
    balance numeric(6,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);
    DROP TABLE public."user";
       public         heap r       user    false    2    879    879            �            1259    16419    venue    TABLE     �  CREATE TABLE public.venue (
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
    DROP TABLE public.venue;
       public         heap r       user    false    2    867    867            �          0    16406    activity 
   TABLE DATA           ,   COPY public.activity (id, name) FROM stdin;
    public               user    false    219   �*       �          0    16453    booking 
   TABLE DATA           y   COPY public.booking (id, date, turn, fee, "createdAt", "updatedAt", "appointerId", "appointeeId", "venueId") FROM stdin;
    public               user    false    221   �+       �          0    16396    password 
   TABLE DATA           S   COPY public.password (id, password, "isActive", "createdAt", "userId") FROM stdin;
    public               user    false    218   �+       �          0    16471    user 
   TABLE DATA           w   COPY public."user" (id, email, name, surname, phone, role, balance, "createdAt", "updatedAt", "deletedAt") FROM stdin;
    public               user    false    222   .       �          0    16419    venue 
   TABLE DATA           u   COPY public.venue (id, name, description, capacity, status, fee, "createdAt", "updatedAt", "activityId") FROM stdin;
    public               user    false    220   "/       �           2606    16413 '   activity PK_24625a1d6b1b089c8ae206fe467 
   CONSTRAINT     g   ALTER TABLE ONLY public.activity
    ADD CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.activity DROP CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467";
       public                 user    false    219            �           2606    16460 &   booking PK_49171efc69702ed84c812f33540 
   CONSTRAINT     f   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.booking DROP CONSTRAINT "PK_49171efc69702ed84c812f33540";
       public                 user    false    221            �           2606    16429 $   venue PK_c53deb6d1bcb088f9d459e7dbc0 
   CONSTRAINT     d   ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "PK_c53deb6d1bcb088f9d459e7dbc0" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.venue DROP CONSTRAINT "PK_c53deb6d1bcb088f9d459e7dbc0";
       public                 user    false    220            �           2606    16482 #   user PK_cace4a159ff9f2512dd42373760 
   CONSTRAINT     e   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760";
       public                 user    false    222            �           2606    16405 '   password PK_cbeb55948781be9257f44febfa0 
   CONSTRAINT     g   ALTER TABLE ONLY public.password
    ADD CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.password DROP CONSTRAINT "PK_cbeb55948781be9257f44febfa0";
       public                 user    false    218            �           2606    16431 $   venue UQ_824a52c2599d374feff4fd67e93 
   CONSTRAINT     a   ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "UQ_824a52c2599d374feff4fd67e93" UNIQUE (name);
 P   ALTER TABLE ONLY public.venue DROP CONSTRAINT "UQ_824a52c2599d374feff4fd67e93";
       public                 user    false    220            �           2606    16486 #   user UQ_8e1f623798118e629b46a9e6299 
   CONSTRAINT     c   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE (phone);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299";
       public                 user    false    222            �           2606    16484 #   user UQ_e12875dfb3b1d92d7d7c5377e22 
   CONSTRAINT     c   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22";
       public                 user    false    222            �           2606    16507 &   booking FK_147c38954821cb6df2d9063f0b7    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_147c38954821cb6df2d9063f0b7" FOREIGN KEY ("venueId") REFERENCES public.venue(id);
 R   ALTER TABLE ONLY public.booking DROP CONSTRAINT "FK_147c38954821cb6df2d9063f0b7";
       public               user    false    3309    220    221            �           2606    16497 &   booking FK_26d64aa5a753a7b0b524532365b    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_26d64aa5a753a7b0b524532365b" FOREIGN KEY ("appointerId") REFERENCES public."user"(id);
 R   ALTER TABLE ONLY public.booking DROP CONSTRAINT "FK_26d64aa5a753a7b0b524532365b";
       public               user    false    221    3315    222            �           2606    16492 $   venue FK_43212964a7411684623abc6f37f    FK CONSTRAINT     �   ALTER TABLE ONLY public.venue
    ADD CONSTRAINT "FK_43212964a7411684623abc6f37f" FOREIGN KEY ("activityId") REFERENCES public.activity(id);
 P   ALTER TABLE ONLY public.venue DROP CONSTRAINT "FK_43212964a7411684623abc6f37f";
       public               user    false    3307    220    219            �           2606    16502 &   booking FK_664606f9da0e132ba5813f1105d    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT "FK_664606f9da0e132ba5813f1105d" FOREIGN KEY ("appointeeId") REFERENCES public."user"(id);
 R   ALTER TABLE ONLY public.booking DROP CONSTRAINT "FK_664606f9da0e132ba5813f1105d";
       public               user    false    222    221    3315            �           2606    16487 '   password FK_dc877602e08545367e6f85b02e5    FK CONSTRAINT     �   ALTER TABLE ONLY public.password
    ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES public."user"(id);
 S   ALTER TABLE ONLY public.password DROP CONSTRAINT "FK_dc877602e08545367e6f85b02e5";
       public               user    false    222    218    3315            �   �   x��An�0E�q�*���{��`,}5M�&�����]�S)�|:p��>��Y��A��E߾��#�����X�0�@CT^����#�Ǒ������lD-C#� ^1{�Ukl��ߩ�$f����ȵ��s
������$>{q]ੴ�R��OZ|G^j��u�￤c,+�l��Y�@f�̥�6ܞ8�ם��RJ��K1      �      x������ � �      �     x����R�P�u���.<�U,�R�S�9W�	��'��*�]Ջ�����������FX���j$W:J�n����K�R�z�#�l? g��&�k~:����>'��(���,y��|�����c?���F�V��g�\;[,�W�L�r��2�Gb
���OD��BrY�GK�T�t0ʴ�A-B�f�� �ݒ1*�ǠU�p.�� �ey�ۇ��r|?�M�ʹ��CҌ��|$� G7����iW]����fz��*�����^|���O�;��E�`��b˺�� 2P8��H r0�N'�R)(Bh�8@"�RN�� /��7/�R�����Z�2KV��P��I�W�I[.�SȾ���cX���X��zoVo���cՃ3""�u`z`�ֈ�Z���/�q8ИH���pW[W�ф�8�P(<�"���6����U��C��S�%���&9�M����c�]}X���n/�q8ގ���z~x-٧�ǩ�DX��G��.q��^Kk`��
^i�㿽8�����      �     x�}�Aj1е���Y�mMV=AO��l�hҐI��ﴄI
av��=PU,�3AI�s� �
D�Z�k��]��ׯ�]�o:ڼ�ξ�x�4����<A�7
��w(#S�D[��c�������F`�ҹAB�"!���]���z�:��]��*���Ŵ�Hq�Zd޴GC�R藗'M�j�̥Qg��x8�I�j���Bv4��)��U-�}H��ܸ,�R�Zdav��ͷ�]�%�`��s���ӘX��j1��a~ ����      �      x������ � �     