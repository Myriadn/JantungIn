--
-- PostgreSQL database dump
--

\restrict nwjWqmylglnDOA8DjdfUstTF9fyJyOlT3545RT7ivbfgzwoebM19dFN0qprJ4PC

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-04-05 00:33:20

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
-- TOC entry 2 (class 3079 OID 25529)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 898 (class 1247 OID 25461)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin',
    'dokter'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 25486)
-- Name: diagnoses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnoses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_by uuid,
    age bigint NOT NULL,
    sex text NOT NULL,
    chest_pain_type text NOT NULL,
    resting_ecg_results text NOT NULL,
    fasting_blood_sugar numeric NOT NULL,
    resting_blood_pressure numeric NOT NULL,
    maximum_heart_rate bigint NOT NULL,
    exercise_induced_angina text NOT NULL,
    st_segment text NOT NULL,
    major_vessels bigint NOT NULL,
    thalassemia text NOT NULL,
    serum_cholesterol numeric NOT NULL,
    st_depression numeric NOT NULL,
    result_percentage numeric NOT NULL,
    cardiovascular_risk text NOT NULL,
    prediction text DEFAULT 'Berisiko'::character varying NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.diagnoses OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25572)
-- Name: request_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_logs (
    id bigint NOT NULL,
    method text NOT NULL,
    path text NOT NULL,
    status_code bigint NOT NULL,
    ip text NOT NULL,
    user_agent text,
    latency_ms bigint DEFAULT 0 NOT NULL,
    user_id uuid,
    created_at timestamp with time zone
);


ALTER TABLE public.request_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25571)
-- Name: request_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 223
-- Name: request_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_logs_id_seq OWNED BY public.request_logs.id;


--
-- TOC entry 220 (class 1259 OID 25229)
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25727)
-- Name: user_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_agent text NOT NULL,
    ip_address character varying(45) NOT NULL,
    device_fingerprint character varying(255) NOT NULL,
    last_login timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_devices OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25467)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text,
    nik_encrypted text NOT NULL,
    password text NOT NULL,
    date_of_birth date,
    role public.user_role DEFAULT 'user'::public.user_role,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4917 (class 2604 OID 25575)
-- Name: request_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_logs ALTER COLUMN id SET DEFAULT nextval('public.request_logs_id_seq'::regclass);


--
-- TOC entry 5098 (class 0 OID 25486)
-- Dependencies: 222
-- Data for Name: diagnoses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnoses (id, user_id, created_by, age, sex, chest_pain_type, resting_ecg_results, fasting_blood_sugar, resting_blood_pressure, maximum_heart_rate, exercise_induced_angina, st_segment, major_vessels, thalassemia, serum_cholesterol, st_depression, result_percentage, cardiovascular_risk, prediction, created_at, updated_at) FROM stdin;
aab32a33-4680-4d11-924e-606aa6adeab2	9317fafa-3a25-423c-bd40-7d8a222fe629	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	44	Female	Atypical angina	Normal	150	1	150	No	Flat	3	Reversible defect	150	0	27	Low	Tidak Berisiko	2026-02-23 18:51:57.527881+07	2026-02-23 18:51:57.527881+07
961f94d3-3996-4fea-a606-1240c392fb09	f836f2d9-8a4a-4dee-8035-6751a4618aa4	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	44	Female	Atypical angina	Normal	150	1	150	No	Flat	3	Reversible defect	150	0	27	Low	Tidak Berisiko	2026-02-27 13:35:38.718474+07	2026-02-27 13:35:38.718474+07
0226ea7b-1768-47f7-ab37-02ab02a03fc9	9317fafa-3a25-423c-bd40-7d8a222fe629	9317fafa-3a25-423c-bd40-7d8a222fe629	33	Female	Atypical angina	Normal	150	1	150	No	Flat	3	Reversible defect	150	0	16	Low	Tidak Berisiko	2026-02-23 18:30:59.322137+07	2026-02-23 18:30:59.322137+07
aaee4395-4c6f-4ac0-95d9-9335cd16fb97	9317fafa-3a25-423c-bd40-7d8a222fe629	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	33	Female	Atypical angina	Normal	150	1	150	No	Flat	3	Reversible defect	150	0	16	Low	Tidak Berisiko	2026-02-23 18:51:37.670697+07	2026-02-23 18:51:37.670697+07
ff2ab6af-98e7-4648-be4f-04c76b0b7c3f	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	29	Female	Atypical angina	Normal	150	1	150	No	Flat	3	Reversible defect	150	0	16	Low	Tidak Berisiko	2026-02-23 18:50:33.774216+07	2026-02-23 18:50:33.774216+07
6728c394-b77e-4ba3-b2ad-5d732207bb52	9317fafa-3a25-423c-bd40-7d8a222fe629	9afcca00-28fd-46e0-a282-5ec7a595de1c	23	Male	Atypical angina	ST-T wave abnormality	80	100	150	No	Downsloping	1	Fixed defect	105	1	42	Low	Tidak Berisiko	2026-02-28 23:05:39.797286+07	2026-02-28 23:05:39.797286+07
ef287f44-d2e2-4d06-add4-5fdeaa02d88f	5ea20f90-f37c-4d91-8236-75705d8dd207	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	32	Male	Non-anginal pain	ST-T wave abnormality	80	150	150	Yes	Upsloping	2	Fixed defect	150	2	67	High Risk	Berisiko	2026-04-04 23:54:27.598349+07	2026-04-04 23:54:27.598349+07
\.


--
-- TOC entry 5100 (class 0 OID 25572)
-- Dependencies: 224
-- Data for Name: request_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_logs (id, method, path, status_code, ip, user_agent, latency_ms, user_id, created_at) FROM stdin;
1	GET	/api/v1/health	404	::1	PostmanRuntime/7.51.1	0	\N	2026-02-27 14:47:06.43543+07
2	GET	/api/v1/stats	200	::1	PostmanRuntime/7.51.1	4	\N	2026-02-27 14:47:14.670795+07
3	GET	/api/v1/admin/stats	200	::1	PostmanRuntime/7.51.1	4	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:47:17.768716+07
4	GET	/api/v1/auth/profile	200	::1	PostmanRuntime/7.51.1	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:49:10.888363+07
5	GET	/api/v1/admin/diagnosis/patient/9317fafa-3a25-423c-bd40-7d8a222fe629	200	::1	PostmanRuntime/7.51.1	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:49:32.847808+07
6	GET	/api/v1/diagnosis/history	200	::1	PostmanRuntime/7.51.1	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:49:37.135347+07
7	GET	/api/v1/diagnosis/ff2ab6af-98e7-4648-be4f-04c76b0b7c3f	200	::1	PostmanRuntime/7.51.1	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:49:40.817265+07
8	GET	/api/v1/admin/diagnosis/all	200	::1	PostmanRuntime/7.51.1	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:49:43.744837+07
9	GET	/api/v1/admin/stats	200	::1	PostmanRuntime/7.51.1	5	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-27 14:50:05.772784+07
10	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	69	\N	2026-02-28 02:27:06.942167+07
11	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	57	\N	2026-02-28 02:27:08.704279+07
12	GET	/api/v1/diagnosis/history	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	21	f836f2d9-8a4a-4dee-8035-6751a4618aa4	2026-02-28 02:27:24.419057+07
13	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	f836f2d9-8a4a-4dee-8035-6751a4618aa4	2026-02-28 02:27:52.26889+07
14	POST	/api/v1/auth/register	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	197	\N	2026-02-28 21:45:48.555109+07
15	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	59	\N	2026-02-28 21:46:36.752069+07
16	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	f571ef55-8b20-4a29-bd1d-1b053af9d1a6	2026-02-28 21:46:38.138798+07
17	GET	/api/v1/diagnosis/history	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	33	f571ef55-8b20-4a29-bd1d-1b053af9d1a6	2026-02-28 21:46:43.685309+07
18	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	f571ef55-8b20-4a29-bd1d-1b053af9d1a6	2026-02-28 21:46:49.076097+07
19	POST	/api/v1/auth/register	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	59	\N	2026-02-28 21:48:34.265325+07
20	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	58	\N	2026-02-28 21:48:47.298908+07
21	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	47e2ed11-ed15-4e87-9d52-173ca82ef1da	2026-02-28 21:48:48.476995+07
22	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	47e2ed11-ed15-4e87-9d52-173ca82ef1da	2026-02-28 21:48:51.386365+07
23	POST	/api/v1/auth/register	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	61	\N	2026-02-28 21:49:47.318305+07
24	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	81	\N	2026-02-28 21:49:54.100842+07
25	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	6ebe0ffd-05c1-49a9-9266-ccdf2c862843	2026-02-28 21:50:11.242842+07
26	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	6ebe0ffd-05c1-49a9-9266-ccdf2c862843	2026-02-28 21:50:21.933086+07
27	POST	/api/v1/auth/register	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	55	\N	2026-02-28 21:50:49.870679+07
28	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	57	\N	2026-02-28 21:50:55.936717+07
29	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d901fcc5-7d90-40c0-9025-40328d18af1e	2026-02-28 21:50:56.911411+07
30	POST	/api/v1/admin/login	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:05:39.26014+07
31	POST	/api/v1/admin/login	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:07:42.731985+07
32	POST	/api/v1/admin/login	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:12:08.495448+07
33	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	62	\N	2026-02-28 22:15:00.349019+07
34	GET	/api/v1/admin/patients	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:09.3808+07
35	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	10	6ad7e49d-a6dc-4502-b096-b5793496b592	2026-02-28 22:15:10.61458+07
36	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:10.661556+07
37	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:10.681295+07
38	GET	/api/v1/admin/patients/d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:10.711885+07
39	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:29.8046+07
40	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:29.817664+07
41	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	6ad7e49d-a6dc-4502-b096-b5793496b592	2026-02-28 22:15:29.834882+07
42	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:29.849666+07
43	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:29.872038+07
44	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:15:29.884732+07
45	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	56	\N	2026-02-28 22:16:36.087283+07
46	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:20:32.004956+07
47	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:20:32.018672+07
48	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 22:20:32.051826+07
49	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:20:32.06306+07
50	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:20:32.085485+07
51	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:20:32.123012+07
52	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	59	\N	2026-02-28 22:32:26.450567+07
53	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	5	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:32:31.671411+07
54	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:31.683945+07
55	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:31.702989+07
56	GET	/api/v1/admin/patients/d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:31.719721+07
57	GET	/api/v1/admin/patients	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:43.167278+07
58	GET	/api/v1/admin/patients/search	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:57.193957+07
59	GET	/api/v1/admin/patients/search	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:32:59.091854+07
60	GET	/api/v1/admin/patients	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	\N	2026-02-28 22:48:31.586563+07
61	GET	/api/v1/admin/patients/search	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:48:36.701795+07
62	GET	/api/v1/admin/patients/search	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:49:05.3496+07
63	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:49:11.862903+07
64	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:49:11.8729+07
65	GET	/api/v1/admin/diagnosis/all	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:49:12.018769+07
66	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	64	\N	2026-02-28 22:49:24.753012+07
67	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:49:31.369774+07
68	GET	/api/v1/admin/patients/6ebe0ffd-05c1-49a9-9266-ccdf2c862843	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:49:37.145021+07
69	POST	/api/v1/diagnosis	503	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	49	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:50:04.29016+07
70	GET	/api/v1/admin/patients/search	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	5	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:50:58.85375+07
71	GET	/api/v1/admin/patients/search	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:51:05.829538+07
72	POST	/api/v1/auth/login	200	::1	PostmanRuntime/7.51.1	57	\N	2026-02-28 22:51:09.681989+07
73	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:02.2109+07
74	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:54:23.813678+07
75	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 22:54:23.82388+07
76	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	9	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:23.847758+07
77	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:23.863584+07
78	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:23.875289+07
79	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:23.89408+07
80	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:29.283584+07
81	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:29.32693+07
82	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:29.33796+07
83	GET	/api/v1/admin/patients/d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:29.35481+07
84	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 22:54:33.117695+07
85	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:03:31.206401+07
86	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:04:02.396544+07
87	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	9	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:04:19.137138+07
88	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:04:21.196024+07
89	POST	/api/v1/diagnosis	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:04:47.124055+07
90	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:04:51.079769+07
91	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:04:51.090266+07
92	GET	/api/v1/admin/diagnosis/all	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:04:51.101076+07
93	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	55	\N	2026-02-28 23:05:11.567447+07
94	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:05:15.106689+07
95	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:05:17.885506+07
96	POST	/api/v1/diagnosis	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	36	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:05:39.799969+07
97	GET	/api/v1/diagnosis/6728c394-b77e-4ba3-b2ad-5d732207bb52	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:05:59.36954+07
98	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:05:59.397637+07
99	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:06:24.692258+07
100	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:06:25.709948+07
101	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:06:25.7234+07
102	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:06:25.744027+07
103	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	12	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:06:25.758952+07
104	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:06:25.771946+07
105	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9afcca00-28fd-46e0-a282-5ec7a595de1c	2026-02-28 23:06:25.786327+07
106	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	64	\N	2026-02-28 23:06:46.58982+07
107	GET	/api/v1/diagnosis/history	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	9317fafa-3a25-423c-bd40-7d8a222fe629	2026-02-28 23:06:50.76287+07
108	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	9317fafa-3a25-423c-bd40-7d8a222fe629	2026-02-28 23:06:59.096064+07
109	GET	/api/v1/admin/patients	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:07:51.111415+07
110	GET	/api/v1/admin/patients/6ebe0ffd-05c1-49a9-9266-ccdf2c862843	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:07:57.502041+07
111	GET	/api/v1/admin/patients	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:11:32.160715+07
112	GET	/api/v1/admin/patients	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:12:12.161754+07
113	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:12:36.850476+07
114	POST	/api/v1/diagnosis	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:12:57.402509+07
115	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:01.521683+07
116	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:01.558761+07
117	GET	/api/v1/admin/diagnosis/all	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:01.571425+07
118	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:02.818599+07
119	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:02.836143+07
120	GET	/api/v1/admin/diagnosis/all	401	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:13:03.172111+07
121	GET	/api/v1/stats	200	::1	PostmanRuntime/7.51.1	7	\N	2026-02-28 23:16:07.676178+07
122	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	\N	2026-02-28 23:21:30.894001+07
123	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	\N	2026-02-28 23:28:42.249027+07
124	GET	/api/v1/stats	200	::1	PostmanRuntime/7.51.1	0	\N	2026-02-28 23:28:54.05305+07
125	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	9	\N	2026-02-28 23:30:16.263723+07
126	GET	/api/v1/stats	200	::1	PostmanRuntime/7.51.1	3	\N	2026-02-28 23:30:21.551833+07
127	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	71	\N	2026-02-28 23:30:46.941113+07
128	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:30:49.425848+07
129	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:30:49.441063+07
130	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	4	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:30:49.477986+07
131	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:30:49.491138+07
132	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:30:49.505851+07
133	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:30:49.519791+07
134	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:31:15.755543+07
135	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:31:15.789292+07
136	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:31:15.81086+07
137	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:31:15.827469+07
138	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:31:15.83743+07
139	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:31:15.852474+07
140	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:32:47.342357+07
141	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:32:47.351866+07
142	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:32:47.366465+07
143	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:32:47.385762+07
144	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:32:47.402182+07
145	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:32:47.416731+07
146	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	6	\N	2026-02-28 23:32:53.096049+07
147	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:01.06692+07
148	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	\N	2026-02-28 23:33:13.115347+07
149	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:30.468632+07
150	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	4	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:32.965081+07
151	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:33.002201+07
152	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:33.016372+07
153	GET	/api/v1/admin/patients/d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:33.041174+07
154	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:33:34.745895+07
155	GET	/api/v1/admin/dashboard	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:33:34.754466+07
156	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	3	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:34.784251+07
157	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:34.800127+07
158	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:34.814675+07
159	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:33:34.825577+07
160	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:39:36.897148+07
161	GET	/api/v1/admin/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	15	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:39:36.921231+07
162	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:39:36.93239+07
163	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:39:36.941456+07
164	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:39:36.952139+07
165	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:39:36.961016+07
166	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	\N	2026-02-28 23:43:31.625869+07
167	GET	/api/v1/admin/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	5	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:43:31.825066+07
168	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:43:31.849485+07
169	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:43:31.860551+07
170	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:43:31.870132+07
171	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-02-28 23:43:31.880891+07
172	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	16	\N	2026-03-01 20:54:13.113412+07
173	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	16	\N	2026-03-01 20:54:13.029625+07
176	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.126891+07
177	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	16	\N	2026-03-01 20:54:13.126351+07
174	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	16	\N	2026-03-01 20:54:13.027617+07
178	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.141709+07
175	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.112905+07
179	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.143732+07
180	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.179514+07
181	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.193641+07
182	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.213905+07
183	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.213905+07
184	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.23976+07
186	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.240835+07
185	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	16	\N	2026-03-01 20:54:13.237207+07
187	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.238153+07
188	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.247527+07
189	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.25752+07
190	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.278576+07
191	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.295474+07
192	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.295474+07
193	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.298915+07
194	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.30391+07
195	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.314705+07
196	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.330738+07
197	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.336208+07
198	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.336208+07
199	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.34247+07
200	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.353634+07
201	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.369331+07
202	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.377593+07
203	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	3	\N	2026-03-01 20:54:13.381669+07
204	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.381669+07
205	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.39214+07
206	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.410731+07
207	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.421319+07
208	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.426502+07
209	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.429442+07
210	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.431095+07
211	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.454871+07
212	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:54:13.459071+07
213	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.112017+07
214	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.112017+07
215	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.112971+07
216	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.12849+07
217	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.12849+07
218	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.14751+07
219	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.14751+07
220	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.154+07
221	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.162451+07
222	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.165231+07
223	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.180301+07
224	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.183078+07
225	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.187307+07
226	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.197433+07
227	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.213841+07
229	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.219551+07
235	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.263329+07
236	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.272177+07
237	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.288204+07
238	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.293038+07
239	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.306415+07
244	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.34017+07
246	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	1	\N	2026-03-01 20:56:49.343453+07
247	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.356865+07
248	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.361751+07
249	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.375595+07
228	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	1	\N	2026-03-01 20:56:49.219551+07
230	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.220271+07
231	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.232224+07
232	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.248787+07
233	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.254214+07
234	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	2	\N	2026-03-01 20:56:49.262021+07
240	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.308111+07
241	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.310146+07
242	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.323442+07
243	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.327255+07
245	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.34017+07
250	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.376102+07
251	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.378378+07
252	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.387346+07
253	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:56:49.391778+07
254	POST	/api/v1/auth/login-email	200	::1	PostmanRuntime/7.51.1	117	\N	2026-03-01 20:57:38.394907+07
256	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.010275+07
255	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.009738+07
257	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	3	\N	2026-03-01 20:58:13.012992+07
259	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	4	\N	2026-03-01 20:58:13.01352+07
258	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	1	\N	2026-03-01 20:58:13.012992+07
260	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.040958+07
261	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.047543+07
262	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.048707+07
263	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.049347+07
264	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	1	\N	2026-03-01 20:58:13.050471+07
265	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.075263+07
266	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.081712+07
267	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.083188+07
268	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.083747+07
269	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.095177+07
270	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.113084+07
271	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.114341+07
272	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.114849+07
273	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.12063+07
274	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.135792+07
275	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.149833+07
276	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.152366+07
277	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	1	\N	2026-03-01 20:58:13.156988+07
278	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.157521+07
279	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.172706+07
280	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.185621+07
281	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.188231+07
282	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.196294+07
283	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.196914+07
284	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.20109+07
285	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.220622+07
286	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.222372+07
287	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.225612+07
289	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.235124+07
288	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.235124+07
290	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.253695+07
291	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.255486+07
292	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.26319+07
293	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.26577+07
294	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.270576+07
295	POST	/api/v1/auth/login-email	400	::1	python-httpx/0.28.1	0	\N	2026-03-01 20:58:13.282889+07
298	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	100	\N	2026-03-01 21:00:25.744811+07
296	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	89	\N	2026-03-01 21:00:25.734785+07
297	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	93	\N	2026-03-01 21:00:25.739829+07
299	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	100	\N	2026-03-01 21:00:25.747062+07
300	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	105	\N	2026-03-01 21:00:25.750216+07
301	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	68	\N	2026-03-01 21:00:25.806916+07
302	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:00:25.80992+07
303	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	59	\N	2026-03-01 21:00:25.810923+07
304	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	61	\N	2026-03-01 21:00:25.815877+07
305	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:00:25.816875+07
306	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	63	\N	2026-03-01 21:00:25.874062+07
307	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	61	\N	2026-03-01 21:00:25.877378+07
308	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:00:25.878379+07
309	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	62	\N	2026-03-01 21:00:25.880896+07
310	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	60	\N	2026-03-01 21:00:25.882402+07
311	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	59	\N	2026-03-01 21:00:25.939813+07
312	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	59	\N	2026-03-01 21:00:25.942822+07
313	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:00:25.951852+07
314	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:00:25.953726+07
315	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	63	\N	2026-03-01 21:00:25.974885+07
316	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	67	\N	2026-03-01 21:00:26.011664+07
317	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	69	\N	2026-03-01 21:00:26.016183+07
318	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	74	\N	2026-03-01 21:00:26.030734+07
319	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	73	\N	2026-03-01 21:00:26.03462+07
320	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	68	\N	2026-03-01 21:00:26.050517+07
321	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	83	\N	2026-03-01 21:00:26.100022+07
322	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	80	\N	2026-03-01 21:00:26.101376+07
326	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	84	\N	2026-03-01 21:00:26.196212+07
327	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	91	\N	2026-03-01 21:00:26.20463+07
328	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	95	\N	2026-03-01 21:00:26.221071+07
329	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	77	\N	2026-03-01 21:00:26.239654+07
323	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	84	\N	2026-03-01 21:00:26.12117+07
324	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	81	\N	2026-03-01 21:00:26.149678+07
325	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	112	\N	2026-03-01 21:00:26.151688+07
330	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	82	\N	2026-03-01 21:00:26.240666+07
331	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	75	\N	2026-03-01 21:00:26.275796+07
332	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	69	\N	2026-03-01 21:00:26.279295+07
333	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	65	\N	2026-03-01 21:00:26.292863+07
334	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	63	\N	2026-03-01 21:00:26.309298+07
335	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:00:26.311305+07
336	POST	/api/v1/auth/login-email	200	::1	python-httpx/0.28.1	60	\N	2026-03-01 21:00:26.341236+07
341	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	69	\N	2026-03-01 21:04:32.755605+07
339	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.747544+07
338	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	61	\N	2026-03-01 21:04:32.744692+07
340	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.753604+07
337	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	61	\N	2026-03-01 21:04:32.746518+07
342	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	63	\N	2026-03-01 21:04:32.817296+07
343	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	65	\N	2026-03-01 21:04:32.818801+07
344	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.822842+07
345	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:32.828683+07
346	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	68	\N	2026-03-01 21:04:32.829689+07
347	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:32.887587+07
348	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.888238+07
349	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.890836+07
350	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	63	\N	2026-03-01 21:04:32.894685+07
351	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	62	\N	2026-03-01 21:04:32.895805+07
352	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:32.959759+07
353	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:32.962465+07
354	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	71	\N	2026-03-01 21:04:32.96448+07
355	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	71	\N	2026-03-01 21:04:32.97201+07
356	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	81	\N	2026-03-01 21:04:32.982083+07
357	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	83	\N	2026-03-01 21:04:33.047763+07
358	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	80	\N	2026-03-01 21:04:33.049773+07
359	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	71	\N	2026-03-01 21:04:33.049773+07
360	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	80	\N	2026-03-01 21:04:33.054799+07
361	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	76	\N	2026-03-01 21:04:33.082129+07
362	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	62	\N	2026-03-01 21:04:33.114164+07
363	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	62	\N	2026-03-01 21:04:33.12135+07
364	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:33.143234+07
365	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	68	\N	2026-03-01 21:04:33.145748+07
366	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	73	\N	2026-03-01 21:04:33.159097+07
367	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	70	\N	2026-03-01 21:04:33.200909+07
368	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	70	\N	2026-03-01 21:04:33.213054+07
369	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	79	\N	2026-03-01 21:04:33.235001+07
370	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	96	\N	2026-03-01 21:04:33.252544+07
371	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	88	\N	2026-03-01 21:04:33.253923+07
372	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:33.272712+07
373	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	66	\N	2026-03-01 21:04:33.290224+07
374	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:33.303275+07
375	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	61	\N	2026-03-01 21:04:33.317512+07
376	POST	/api/v1/auth/login-email	401	::1	python-httpx/0.28.1	64	\N	2026-03-01 21:04:33.32211+07
377	POST	/api/v1/auth/login-email	200	::1	python-httpx/0.28.1	60	\N	2026-03-01 21:04:33.33578+07
378	GET	/api/v1/stats	200	::1	PostmanRuntime/7.51.1	93	\N	2026-03-24 14:10:00.386511+07
379	POST	/api/v1/auth/register	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	291	\N	2026-04-01 00:44:12.530078+07
380	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	111	\N	2026-04-01 00:44:32.428237+07
381	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	20	\N	2026-04-01 00:44:35.347714+07
382	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	29	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 00:47:19.254754+07
383	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	76	\N	2026-04-01 00:47:33.61124+07
384	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	1	\N	2026-04-01 00:47:33.840492+07
385	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	4	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 00:48:04.185462+07
386	GET	/api/v1/stats	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	27	\N	2026-04-01 00:48:14.719985+07
387	POST	/api/v1/auth/login	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	376	\N	2026-04-01 00:48:27.381725+07
388	GET	/api/v1/stats	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	7	\N	2026-04-01 00:48:27.440697+07
389	GET	/api/v1/auth/profile	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	26	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 00:49:14.11027+07
390	GET	/api/v1/auth/profile	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	1	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 00:49:44.860417+07
391	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	143	\N	2026-04-01 01:03:31.749117+07
392	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	4	\N	2026-04-01 01:03:34.096595+07
393	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	10	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 01:03:35.638828+07
394	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	295	\N	2026-04-01 01:04:45.682629+07
395	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	5	\N	2026-04-01 01:04:45.992874+07
396	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 01:04:57.13223+07
397	GET	/api/v1/auth/profile	401	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	45	\N	2026-04-01 01:05:05.792605+07
398	GET	/api/v1/auth/profile	401	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	0	\N	2026-04-01 01:05:07.121245+07
399	POST	/api/v1/auth/login	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	105	\N	2026-04-01 01:05:25.093062+07
400	GET	/api/v1/stats	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	45	\N	2026-04-01 01:05:25.321432+07
401	GET	/api/v1/auth/profile	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	4	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 01:05:34.94417+07
402	GET	/api/v1/auth/profile	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	24	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-01 01:05:43.461834+07
403	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	80	\N	2026-04-01 01:55:47.831461+07
404	POST	/api/v1/auth/login	200	::1	PostmanRuntime/7.51.1	78	\N	2026-04-01 02:01:37.522421+07
405	POST	/api/v1/auth/login	200	::1	PostmanRuntime/7.51.1	87	\N	2026-04-01 02:02:11.416337+07
406	POST	/api/v1/auth/login	200	::1	PostmanRuntime/7.51.1	70	\N	2026-04-01 02:03:40.304849+07
407	POST	/api/v1/auth/login	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36	89	\N	2026-04-01 02:07:05.7552+07
408	POST	/api/v1/auth/login	200	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36	88	\N	2026-04-04 23:50:01.713708+07
409	POST	/api/v1/auth/login	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	81	\N	2026-04-04 23:51:29.343779+07
410	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	7	\N	2026-04-04 23:51:37.792757+07
411	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-04 23:51:40.548243+07
412	GET	/api/v1/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	6	\N	2026-04-04 23:51:48.833971+07
413	GET	/api/v1/auth/profile	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	1	5ea20f90-f37c-4d91-8236-75705d8dd207	2026-04-04 23:51:50.113606+07
414	GET	/api/v1/admin/stats	401	::1	PostmanRuntime/7.51.1	1	\N	2026-04-04 23:52:28.253996+07
415	POST	/api/v1/auth/login-email	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	63	\N	2026-04-04 23:52:50.460339+07
416	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	\N	2026-04-04 23:52:57.297308+07
417	GET	/api/v1/admin/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	6	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:52:57.314232+07
418	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	11	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:52:57.356371+07
419	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:52:57.368597+07
420	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:52:57.379423+07
421	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:52:57.389142+07
422	GET	/api/v1/admin/patients	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:53:04.359553+07
423	GET	/api/v1/admin/patients/5ea20f90-f37c-4d91-8236-75705d8dd207	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	1	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:53:31.689394+07
424	POST	/api/v1/diagnosis	201	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	46	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:27.602203+07
425	GET	/api/v1/diagnosis/ef287f44-d2e2-4d06-add4-5fdeaa02d88f	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:31.448485+07
426	GET	/api/v1/admin/patients/5ea20f90-f37c-4d91-8236-75705d8dd207	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:31.459796+07
427	GET	/api/v1/admin/profile	404	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	\N	2026-04-04 23:54:44.68445+07
428	GET	/api/v1/admin/stats	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	4	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:44.819845+07
429	GET	/api/v1/admin/diagnosis/all	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	2	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:44.867785+07
430	GET	/api/v1/admin/patients/5ea20f90-f37c-4d91-8236-75705d8dd207	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	8	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:45.052337+07
431	GET	/api/v1/admin/patients/9317fafa-3a25-423c-bd40-7d8a222fe629	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	3	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:45.085748+07
432	GET	/api/v1/admin/patients/f836f2d9-8a4a-4dee-8035-6751a4618aa4	200	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	0	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	2026-04-04 23:54:45.097125+07
\.


--
-- TOC entry 5096 (class 0 OID 25229)
-- Dependencies: 220
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migrations (version, dirty) FROM stdin;
4	f
\.


--
-- TOC entry 5101 (class 0 OID 25727)
-- Dependencies: 225
-- Data for Name: user_devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_devices (id, user_id, user_agent, ip_address, device_fingerprint, last_login, created_at, updated_at) FROM stdin;
be1cb284-0304-4468-9e20-f4cdf49178f2	2bfbc422-6369-4ae1-958b-26edb32f84d9	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	6a4e20c9e0797faac98681617023e2b1	2026-03-01 01:51:49.575087+07	2026-02-14 01:51:49.575087+07	2026-03-01 01:51:49.575087+07
3a0edf6d-4721-4c0a-aef5-19f4de30e71a	9317fafa-3a25-423c-bd40-7d8a222fe629	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	5e906e12eca41687c14892d2f4ff394b	2026-02-28 01:51:49.575087+07	2026-02-13 01:51:49.575087+07	2026-02-28 01:51:49.575087+07
c8910af6-aecf-4828-a23d-ac420eca2fa4	f836f2d9-8a4a-4dee-8035-6751a4618aa4	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	2833ae1eb49f391d7e20f6b56ffc9f8b	2026-02-27 01:51:49.575087+07	2026-02-12 01:51:49.575087+07	2026-02-27 01:51:49.575087+07
58e18ab1-92df-454d-8781-c1cbeaf37103	f571ef55-8b20-4a29-bd1d-1b053af9d1a6	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	d6675f1a19e96854f12cb7562756b9ac	2026-02-26 01:51:49.575087+07	2026-02-11 01:51:49.575087+07	2026-02-26 01:51:49.575087+07
fdfbaebf-e931-4908-b8d6-30e5ecbf016a	47e2ed11-ed15-4e87-9d52-173ca82ef1da	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	d141ddd0383dc44277b16f963f1cd093	2026-02-25 01:51:49.575087+07	2026-02-10 01:51:49.575087+07	2026-02-25 01:51:49.575087+07
b1b50bfe-8076-4611-9f35-92163dd9c8bd	6ebe0ffd-05c1-49a9-9266-ccdf2c862843	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	15b5d5b45461df937d0eae2c6ececc0f	2026-02-24 01:51:49.575087+07	2026-02-09 01:51:49.575087+07	2026-02-24 01:51:49.575087+07
585fb72d-3a5f-4c0a-917b-9331523b681e	d901fcc5-7d90-40c0-9025-40328d18af1e	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	7a46da6b9b2ffb70f9be17d4aa3ff5a2	2026-02-23 01:51:49.575087+07	2026-02-08 01:51:49.575087+07	2026-02-23 01:51:49.575087+07
82cd03fd-d36e-4be4-86ed-ec86bbd8ed6e	5ea20f90-f37c-4d91-8236-75705d8dd207	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	22bcb07320e4c49ade107a55d2b60fa8	2026-02-22 01:51:49.575087+07	2026-02-07 01:51:49.575087+07	2026-02-22 01:51:49.575087+07
9211a932-b770-42f2-b423-587955b0feb5	924e9091-9c56-4c8b-a75e-dd942c27850a	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	0ff594613378013ced4e3ab049b51ad1	2026-02-21 01:51:49.575087+07	2026-02-06 01:51:49.575087+07	2026-02-21 01:51:49.575087+07
eda65c5f-c6c5-498a-92e5-45509aac8151	a90df4fa-fc34-4f66-bfe3-7e64bb448308	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	3c3d76b73ccb68bf984b923c020efaea	2026-02-20 01:51:49.575087+07	2026-02-05 01:51:49.575087+07	2026-02-20 01:51:49.575087+07
c55fbdaa-cb73-489a-b228-668a3ae6dcd8	1b1b422d-8152-4790-b33f-999cc06fff5a	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	216f31fd1c7689dc76e4a9afb88b5728	2026-02-19 01:51:49.575087+07	2026-02-04 01:51:49.575087+07	2026-02-19 01:51:49.575087+07
ef460319-eab9-4fca-9de3-0cbef7d098b5	ccf799cf-8d3d-4b45-bc94-480b40713bf0	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	7f2d600886a01dd23e70e60b1864092b	2026-02-18 01:51:49.575087+07	2026-02-03 01:51:49.575087+07	2026-02-18 01:51:49.575087+07
5281e1ef-d9ef-47bd-8898-371c6c7c5a19	ecef99c6-867d-457c-a9eb-932b38dc85f3	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	f0f95e855bc4d5474152a1bdc15d1bc5	2026-02-17 01:51:49.575087+07	2026-02-02 01:51:49.575087+07	2026-02-17 01:51:49.575087+07
c501c88a-c2b4-40fc-a523-e48540706606	060a7a40-10cf-4514-81e2-fa7bee298ce3	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	c943b88dc80f291d2668fdd7cf8527b5	2026-02-16 01:51:49.575087+07	2026-02-01 01:51:49.575087+07	2026-02-16 01:51:49.575087+07
1aeeabb1-9ad6-49b2-aaa8-48d092e959ff	ae26304a-61cd-40a3-ae3a-b1b8520edb62	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	ba7322c83e013e5b1ac9468ae46b46eb	2026-02-15 01:51:49.575087+07	2026-01-31 01:51:49.575087+07	2026-02-15 01:51:49.575087+07
f7201f5d-7468-4768-9eb3-5ccbcecfb950	52285a87-2543-4b86-8d97-5a9925e6429a	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	720e36b5602402ac139afbc254d7f90d	2026-02-14 01:51:49.575087+07	2026-01-30 01:51:49.575087+07	2026-02-14 01:51:49.575087+07
3a493755-825e-4dec-910b-98ef19d65f66	542368ba-e48a-4cb8-a5d8-488273a97e9d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	1d82d47aa4de211c37d7947cee8294b1	2026-02-13 01:51:49.575087+07	2026-01-29 01:51:49.575087+07	2026-02-13 01:51:49.575087+07
d7911ae4-a8cc-4bf2-8194-b3c67935a9a7	18efde8d-0f3f-4aa0-ba93-53191fd03fc6	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	4ad5229c0127ccc9fff6071c01b29b0e	2026-02-12 01:51:49.575087+07	2026-01-28 01:51:49.575087+07	2026-02-12 01:51:49.575087+07
fd651224-fcbf-47cc-b055-6c9dcbb95e7f	bd3f6027-c5a0-4e6f-bd21-bfd434333e5c	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	b63d7184f6e4e4c4c3883e70c623e819	2026-02-11 01:51:49.575087+07	2026-01-27 01:51:49.575087+07	2026-02-11 01:51:49.575087+07
7d82747d-d259-41c8-bb19-22d236bb20b0	70c29234-09f0-4bc6-a576-8c030ddb2b5a	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	2c04dbe07ed143d46a43bb0df4b1fa5e	2026-02-10 01:51:49.575087+07	2026-01-26 01:51:49.575087+07	2026-02-10 01:51:49.575087+07
90eef492-d0ff-4c9a-a02c-5094c2025171	5e17aa3e-cbee-4049-adf7-6d72a276fef1	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	651acd814a4ec6444f1dd7e1e760e173	2026-02-09 01:51:49.575087+07	2026-01-25 01:51:49.575087+07	2026-02-09 01:51:49.575087+07
2b0f248e-30f3-4b76-a52e-c9132d67f1db	f8e01e17-ab27-44df-b824-2dd6f5b4adf1	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	ac6582047309b0771930f9d29da4c532	2026-02-08 01:51:49.575087+07	2026-01-24 01:51:49.575087+07	2026-02-08 01:51:49.575087+07
a7df4e7c-7fed-40bc-b899-03b9380efa8c	deace981-6c2c-4933-a89b-f0c43b5db317	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	34690fb5142aa378793ff7f74866d90c	2026-02-07 01:51:49.575087+07	2026-01-23 01:51:49.575087+07	2026-02-07 01:51:49.575087+07
ff131144-a456-43ab-9482-db8975c520a8	7e068810-70ff-49d4-a24a-f62daa1cf753	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	1f7c1a0d52cb0e277371ac2adf59c8bb	2026-02-06 01:51:49.575087+07	2026-01-22 01:51:49.575087+07	2026-02-06 01:51:49.575087+07
d50ec40f-0e35-4f69-bd3f-af2df663b86b	b06b8666-005b-40d4-b1d4-52de315ea62a	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	65d5bff07ea7b787d83b85be12849919	2026-02-05 01:51:49.575087+07	2026-01-21 01:51:49.575087+07	2026-02-05 01:51:49.575087+07
eb946ece-089f-4dbd-8b52-fe2d50c73919	fffb9aab-9b57-47a9-8259-c99f3b44ca2b	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	33362a2fcfab0d108cc417dafafed86c	2026-02-04 01:51:49.575087+07	2026-01-20 01:51:49.575087+07	2026-02-04 01:51:49.575087+07
6d10332d-b8ca-4da9-9a46-50aca15e4b42	6b3810e8-55e0-4201-acaa-dcfaf309f27a	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	064430fedc423a0898495e3cc6acd316	2026-02-03 01:51:49.575087+07	2026-01-19 01:51:49.575087+07	2026-02-03 01:51:49.575087+07
819e9943-67f5-4a84-ad9e-4ab23f50d01d	49b150da-2475-4b02-b9f5-98170b444a54	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	2fcd003a850c27220f2a89d784f9f976	2026-02-02 01:51:49.575087+07	2026-01-18 01:51:49.575087+07	2026-02-02 01:51:49.575087+07
7dcea1bd-31d4-4fb4-854c-aa25a9a235ab	3e9bbfdd-974d-4650-a4cd-0d92d3ab699a	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	075a32eb8af3a97ff051a8e36c9036fa	2026-02-01 01:51:49.575087+07	2026-01-17 01:51:49.575087+07	2026-02-01 01:51:49.575087+07
8708ce6e-4c0b-483a-9553-4afe7a10c764	830404fa-2fe8-423f-b291-06aa8454a450	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	5c38b002d0ed9f5012c00f6c3b27e85a	2026-03-02 01:51:49.575087+07	2026-01-16 01:51:49.575087+07	2026-03-02 01:51:49.575087+07
24f32f91-eed0-4a65-8678-64ddd2f1f252	ee74c781-53be-4af7-bfaf-d1f0c4a355a2	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	7b6c3c4085250dac40dc1acc0fb9c5c9	2026-03-01 01:51:49.575087+07	2026-01-15 01:51:49.575087+07	2026-03-01 01:51:49.575087+07
882dc7eb-6b4c-4ba3-9b5b-47b17359a371	956ab8f2-57a8-4c94-818a-6744b83d6d53	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	b0ad4070fab259598f5f82db6864f7dd	2026-02-28 01:51:49.575087+07	2026-01-14 01:51:49.575087+07	2026-02-28 01:51:49.575087+07
bb2d37de-31b8-4777-9327-9a609eb4679c	6148fca6-9ed0-4579-bc7c-41b6a06ca2a5	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	c475b0ad51307614aee5dd775eb3c30a	2026-02-27 01:51:49.575087+07	2026-01-13 01:51:49.575087+07	2026-02-27 01:51:49.575087+07
907b7ff4-2e0c-4530-b46d-fee552354823	f251f04f-a87e-48d4-a0a5-09bf28a38bec	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	adcfc95b3cd139d0c0beae2744e7909a	2026-02-26 01:51:49.575087+07	2026-01-12 01:51:49.575087+07	2026-02-26 01:51:49.575087+07
660eef3c-d3e3-4284-af3b-913f0cf16ef3	3f5b2acf-0721-4d47-8a7b-20abca8a4b27	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	1e9921bdda2f2647b00156e8ab6a000f	2026-02-25 01:51:49.575087+07	2026-01-11 01:51:49.575087+07	2026-02-25 01:51:49.575087+07
38b23367-1dad-4279-97ee-bbc8afcfb8e2	2f8c0219-fef7-4ee0-bc2e-d004d1b18e11	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	a29e6c5faede253167be6f4f2ace8043	2026-02-24 01:51:49.575087+07	2026-01-10 01:51:49.575087+07	2026-02-24 01:51:49.575087+07
30311163-5ec8-4bbd-b409-8fcd8091a089	fefd09f0-c320-47a5-82f8-d570c548f5af	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	00ba23e5e5949c61d7e3cdaba121682a	2026-02-23 01:51:49.575087+07	2026-01-09 01:51:49.575087+07	2026-02-23 01:51:49.575087+07
35ef735e-4a9b-4e0e-9e16-72ff526a0099	19a1b22c-0218-40f6-9349-9582b1521c3a	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	f2ced17e5947f94bf478553bd0d4b1b8	2026-02-22 01:51:49.575087+07	2026-01-08 01:51:49.575087+07	2026-02-22 01:51:49.575087+07
136e4198-f922-46c3-be07-b726c87b334f	8e0fb277-b00d-4565-863e-be8010b5e05a	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	227f71117b5fc050b4f901a3de76b0eb	2026-02-21 01:51:49.575087+07	2026-01-07 01:51:49.575087+07	2026-02-21 01:51:49.575087+07
7fd47d2f-3adb-4cd2-8537-034a1fd30904	423c898c-8728-4277-a85f-c8b4f4bbe6ed	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	60ed226bed2adc7590a4800fac830144	2026-02-20 01:51:49.575087+07	2026-01-06 01:51:49.575087+07	2026-02-20 01:51:49.575087+07
21b42721-6aa9-40c6-b0d3-7f45d9f8309f	e12f3a74-83e5-4275-852f-44e50c400f20	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	176831d2dc0c26d32b83eeb60c81ca46	2026-02-19 01:51:49.575087+07	2026-01-05 01:51:49.575087+07	2026-02-19 01:51:49.575087+07
b2a60af1-c35f-4d48-a533-aa40d996b422	5a5461fc-e2bc-4bff-ad86-a0c96a3bfe18	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	cccddd6ab8c460a56be16d076071e735	2026-02-18 01:51:49.575087+07	2026-01-04 01:51:49.575087+07	2026-02-18 01:51:49.575087+07
b8b6741a-45eb-441a-941b-1c05f12ff9cf	cfff1b03-5c21-4660-940c-0d67e3d9dcaa	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	f6dbc3e9d8a28e24942e220a75f3b57f	2026-02-17 01:51:49.575087+07	2026-01-03 01:51:49.575087+07	2026-02-17 01:51:49.575087+07
1e60283c-ad6a-4260-a264-2923c48b321c	b8790557-02ca-4417-857d-00ebdc9f275c	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	70ba7983a6cc875f045120b8e669d150	2026-02-16 01:51:49.575087+07	2026-01-02 01:51:49.575087+07	2026-02-16 01:51:49.575087+07
56522422-c357-460d-9182-b4e0e991e2ec	f3ebea2d-13bc-46ab-8de4-9ddf4d70f2c6	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	43f7e1e381127de765e2cb963d3671a7	2026-02-15 01:51:49.575087+07	2026-02-15 01:51:49.575087+07	2026-02-15 01:51:49.575087+07
d7450509-a129-4fe5-af93-22f3edd97225	12543c38-cfff-4c71-9ae6-9dd27a47a8d6	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	1e2b9caf103779d15d23cde55171bab8	2026-02-14 01:51:49.575087+07	2026-02-14 01:51:49.575087+07	2026-02-14 01:51:49.575087+07
4a68490a-fcf3-48c5-b860-2db27a2b9cc4	e34a494b-3d3e-4526-b96c-4d26eb04f625	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	bbb61a98125d9f95f37f1179b8d7ea71	2026-02-13 01:51:49.575087+07	2026-02-13 01:51:49.575087+07	2026-02-13 01:51:49.575087+07
f85ea40e-d2a2-40b5-a8b7-bded0074bad0	2f2dcaa3-d825-41c7-8315-10f2a9fb943e	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	7c823fb6b7dd3193901f8c458842e203	2026-02-12 01:51:49.575087+07	2026-02-12 01:51:49.575087+07	2026-02-12 01:51:49.575087+07
ed5cd5a2-9a8d-4f24-a85f-8a72f5111f9d	d06aadd9-985e-4292-b858-a7914a425495	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	ba25ad429c61be545253870067384f51	2026-02-11 01:51:49.575087+07	2026-02-11 01:51:49.575087+07	2026-02-11 01:51:49.575087+07
a8ebb926-32f7-4080-943f-891bc104da1b	2908b450-b9bf-4ad2-8bd6-1d9ff8875088	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	fac3678ba4b57d80f9528b04e0781709	2026-02-10 01:51:49.575087+07	2026-02-10 01:51:49.575087+07	2026-02-10 01:51:49.575087+07
32e9edac-5be6-4f0b-be04-41d7379f86bb	1c0c308b-ad34-486d-b305-aad98b684be7	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	2ad3ffd48dee92fb5dc572a9ccf2f620	2026-02-09 01:51:49.575087+07	2026-02-09 01:51:49.575087+07	2026-02-09 01:51:49.575087+07
b4402d8f-44ef-487d-9d8b-c1f978ed33ce	5d5ba6e8-1078-4142-bd95-96a810abae30	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	6ee279a789ad350a8e8ad162d0c24f65	2026-02-08 01:51:49.575087+07	2026-02-08 01:51:49.575087+07	2026-02-08 01:51:49.575087+07
f0d044a1-c750-4eea-b7a8-bd7a7edafb0e	4b53c37f-ed51-482e-bf81-d3a2e2aa0c89	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	708ba94ecd3191150f63698b50497b6f	2026-02-07 01:51:49.575087+07	2026-02-07 01:51:49.575087+07	2026-02-07 01:51:49.575087+07
edd0b879-96f7-43ce-826c-7f59fc1ea9c5	3ad3373a-47d3-4863-b8ad-38d41bdcb5df	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	32d61054aa09b20cef4736f272717494	2026-02-06 01:51:49.575087+07	2026-02-06 01:51:49.575087+07	2026-02-06 01:51:49.575087+07
a23b96c3-f67c-4e8f-84a4-25c9d5324dc5	d32af7bc-da09-4fa2-b1d8-27637c960260	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	ae72e2fb54d16c90167dc2044f3bf601	2026-02-05 01:51:49.575087+07	2026-02-05 01:51:49.575087+07	2026-02-05 01:51:49.575087+07
396e1f7b-9851-4965-bbf2-6f0ee8f29b6a	b91b071b-51e3-4037-ab9d-f32c97c1e04c	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	a56dae432cd34ba153a1cd7a4faa2c96	2026-02-04 01:51:49.575087+07	2026-02-04 01:51:49.575087+07	2026-02-04 01:51:49.575087+07
a7f04947-3c66-4890-9297-84cb5c389880	aa439156-14e8-4816-9835-943314dbe8cf	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	7cec32881dd33caeec223a41761002cd	2026-02-03 01:51:49.575087+07	2026-02-03 01:51:49.575087+07	2026-02-03 01:51:49.575087+07
321740f2-3db2-4c14-b676-936d3215ef5c	92362d55-4892-4a68-9923-05a1cd3d293b	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	962548e7edbb9e435bd0fcf4e0a054d7	2026-02-02 01:51:49.575087+07	2026-02-02 01:51:49.575087+07	2026-02-02 01:51:49.575087+07
e83a1579-66b6-4779-b6ab-4bb9b9f6b5b8	0a1e3532-ca89-4317-848b-07a7683a66cb	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	b6b24076aaeeeb02a3e72ff7a47fd960	2026-02-01 01:51:49.575087+07	2026-02-01 01:51:49.575087+07	2026-02-01 01:51:49.575087+07
3cbce51f-8881-4636-8e0a-62f1ff9c68ae	45d352ed-9b71-4dc7-9200-a8151fcb808d	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	cfc400fb21ffbe2433773fc1d59e5d6b	2026-03-02 01:51:49.575087+07	2026-01-31 01:51:49.575087+07	2026-03-02 01:51:49.575087+07
dfa1ace8-c828-4c30-a4eb-e264f77a6f2f	bc90a8fa-5d29-49b8-a631-d48fd3df8a13	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	11bacfd3c039ecbb0edc32d29f4538cc	2026-03-01 01:51:49.575087+07	2026-01-30 01:51:49.575087+07	2026-03-01 01:51:49.575087+07
e1e27ba9-4a78-439b-8dc9-9f4976a7d00a	5d0442a0-c4b1-458a-9684-93c511701854	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	2a4d645765921bdb6a862a137101ed5f	2026-02-28 01:51:49.575087+07	2026-01-29 01:51:49.575087+07	2026-02-28 01:51:49.575087+07
cec339e1-8175-448a-8a28-f94dd0edee0e	1d7811ce-659c-48fc-9757-5af3a68117f2	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	a1d262facb58597d491356045b05d60d	2026-02-27 01:51:49.575087+07	2026-01-28 01:51:49.575087+07	2026-02-27 01:51:49.575087+07
99fb8e25-58bd-4cf6-be7c-1c5a493d1e6b	4173fcd5-e619-4e4c-82e3-14861e892a4a	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	aac07d294f70ebafc79989d46b70c199	2026-02-26 01:51:49.575087+07	2026-01-27 01:51:49.575087+07	2026-02-26 01:51:49.575087+07
2205858a-6221-42e2-b306-98dc186cbf97	2b4ddced-3209-4f2d-ac40-96077fcbd6c8	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	d156f81473258ee459aba3dca5ad9082	2026-02-25 01:51:49.575087+07	2026-01-26 01:51:49.575087+07	2026-02-25 01:51:49.575087+07
32ff5d9d-8ab6-428e-b9f2-2d8ec3c2e99d	f58fa8d9-7362-4dd7-9aa9-e753ac414643	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	e31e94e269f9fffad1b2861b6f4d2bcf	2026-02-24 01:51:49.575087+07	2026-01-25 01:51:49.575087+07	2026-02-24 01:51:49.575087+07
d8db142a-1e60-4edd-b2ea-c844b0ec890a	1418e39e-d58b-4710-b705-7f72f47c9801	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	b4d0f544c76c7fe109fa72dd4edfb83b	2026-02-23 01:51:49.575087+07	2026-01-24 01:51:49.575087+07	2026-02-23 01:51:49.575087+07
5d433794-4e0d-4cda-9fb9-edd1c70e414e	b2a5edfa-c08b-4bc5-bd3e-4cbded2ecbd1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	4fda2cc206ad0821383c53a4700620ab	2026-02-22 01:51:49.575087+07	2026-01-23 01:51:49.575087+07	2026-02-22 01:51:49.575087+07
2a05855b-6a50-415e-83ad-91b906231d82	8ca75076-bad4-401a-822a-aab38f300929	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	d4a8b8b169f452ca21bf05fe4ec4c937	2026-02-21 01:51:49.575087+07	2026-01-22 01:51:49.575087+07	2026-02-21 01:51:49.575087+07
f6cca42c-7dd2-49e7-b99c-14fb93197cb2	15936dd3-ff6c-4614-a5e3-eb1e24dc5412	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	5840d8d7b37fa3bf2533ab2f54d604cb	2026-02-20 01:51:49.575087+07	2026-01-21 01:51:49.575087+07	2026-02-20 01:51:49.575087+07
df88bcb1-bb18-442c-a5f6-e075d9ee1865	8682f05b-9463-40fc-90aa-50e61b602114	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	c96b9e83835adcf0b5808b811afd1bbb	2026-02-19 01:51:49.575087+07	2026-01-20 01:51:49.575087+07	2026-02-19 01:51:49.575087+07
9dd0e9cf-33c7-45fd-ba4e-8a4b484cd43b	d34e5532-fdbd-4fb7-bcc3-07eaa699336b	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	b8a4a5cb90a619826bd57721005cbe1c	2026-02-18 01:51:49.575087+07	2026-01-19 01:51:49.575087+07	2026-02-18 01:51:49.575087+07
7b113d66-205f-4e6f-b104-ac7d09a9d182	c649fe5d-e1ac-4a5f-94e7-371817774630	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	0e67ea5599f61165eea7f795e68decc9	2026-02-17 01:51:49.575087+07	2026-01-18 01:51:49.575087+07	2026-02-17 01:51:49.575087+07
3605b7d4-639e-438f-8ef1-c9440116978a	98e0fcb2-96bd-4930-b975-b5aeab54388a	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	9c8f7f065fb620527ee355b9d5c10811	2026-02-16 01:51:49.575087+07	2026-01-17 01:51:49.575087+07	2026-02-16 01:51:49.575087+07
cd5df21e-5515-4af6-91dd-6772766cbcab	c527f80d-5ea1-47b0-bea9-23be14a39814	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	833dec930248d9b1bb3240e435b207d3	2026-02-15 01:51:49.575087+07	2026-01-16 01:51:49.575087+07	2026-02-15 01:51:49.575087+07
62a089eb-4aa8-47f3-b3f9-27f8de7c3888	ef431de8-e834-4f98-a124-26607b11539b	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	bdf0e7cb28fe5bb38d2560b101a0ca4b	2026-02-14 01:51:49.575087+07	2026-01-15 01:51:49.575087+07	2026-02-14 01:51:49.575087+07
8a80a513-174b-4f45-bcc9-5f46a63c6e6b	c126ce77-3e57-4b64-8d98-1d1182e383eb	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	1f4a0fa019a8a991865c0b81cd11e351	2026-02-13 01:51:49.575087+07	2026-01-14 01:51:49.575087+07	2026-02-13 01:51:49.575087+07
1b427bd1-7084-4028-9634-708990e48d6a	1c5ee5f1-2a95-4c33-b788-1823983523e8	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	4953b2a6df87a99359188d77a2ed0b22	2026-02-12 01:51:49.575087+07	2026-01-13 01:51:49.575087+07	2026-02-12 01:51:49.575087+07
7f28de2f-b899-4b05-b93e-0302a50bed80	4022a2d4-9520-4ac0-b524-4dd3955ffdd1	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	8ae24ea2abdb44bae35a9e63b6a8dacf	2026-02-11 01:51:49.575087+07	2026-01-12 01:51:49.575087+07	2026-02-11 01:51:49.575087+07
953e8a0d-76b4-4795-b22d-4576aef75847	b7836149-1e0a-41f6-a096-c2ffda351c1c	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	643c9f5f7cb7a01d05bdea56df32abd7	2026-02-10 01:51:49.575087+07	2026-01-11 01:51:49.575087+07	2026-02-10 01:51:49.575087+07
e6cd40be-cd83-4f29-b594-99a61304146d	151932fc-0cab-4f73-ac21-d15e3f09c754	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	7f399c06d047e0490cd05f26d03976db	2026-02-09 01:51:49.575087+07	2026-01-10 01:51:49.575087+07	2026-02-09 01:51:49.575087+07
0353a8b6-8cef-4d1f-b101-c4f3bfc24a54	c823eff5-72dc-4588-ac31-97d18f36c70b	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	775ec80136a8123c16b3f47d06e3ccd1	2026-02-08 01:51:49.575087+07	2026-01-09 01:51:49.575087+07	2026-02-08 01:51:49.575087+07
2f22467a-71c9-466d-8054-c303af3036f1	57eb6d9f-5807-4432-8334-34f777b65562	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	d6b118da65c8182d4862038805370c23	2026-02-07 01:51:49.575087+07	2026-01-08 01:51:49.575087+07	2026-02-07 01:51:49.575087+07
cdf7447f-274d-4503-a66b-ba8c6cd0e8a3	d98330d0-b5cf-429c-94dd-726995b2c3e9	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	2c6d1c4d7ea1be6e907b1dbbff1e7422	2026-02-06 01:51:49.575087+07	2026-01-07 01:51:49.575087+07	2026-02-06 01:51:49.575087+07
5536415b-b8f8-44a6-a4f3-99f3324646b2	c92dd74a-a53a-494b-94c2-5df17df75bc0	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	6d8a1b537b8021c98d39ebcc134c68ca	2026-02-05 01:51:49.575087+07	2026-01-06 01:51:49.575087+07	2026-02-05 01:51:49.575087+07
70f51e89-b767-4740-b53b-a354b8080a70	76ce21c0-e1ac-43ea-8271-2fe66405b023	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	de2360f11f7b28f7d7f2d82cfb91d1de	2026-02-04 01:51:49.575087+07	2026-01-05 01:51:49.575087+07	2026-02-04 01:51:49.575087+07
58a75a6c-de9e-45ae-9a06-35bbf52b53a1	f8e972c0-5474-43cc-ba6c-dac7e0493784	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	8e51ff21854eb693977bd37721a323a8	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
7116126e-0cce-4956-92db-d96baa221ab1	f8e972c0-5474-43cc-ba6c-dac7e0493784	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	6f9a7a5a0564bee73550c78253edc15b	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
ce6ca918-a54e-4674-95d5-3cb9d73a8858	4d049ed5-a58c-46c9-a3d1-bc33574d1cfb	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	18f27eaa3329ba326dc4cc195cc0b4ab	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
807062c4-10f3-4320-9210-7e2dc37473d3	4d049ed5-a58c-46c9-a3d1-bc33574d1cfb	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	b03c44e69e3e1ccca961687e34dc092f	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
5f20a2c1-2880-4752-999d-6716d657bae7	4d049ed5-a58c-46c9-a3d1-bc33574d1cfb	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	173c1cc3b4d688a11e48011a667aded0	2026-03-31 13:51:49.575087+07	2026-03-31 01:51:49.575087+07	2026-03-31 13:51:49.575087+07
67131cda-3e0f-4b16-a8af-d402d6703847	e13b1de3-4e97-4c6d-99b1-f94032392449	Mozilla/5.0 (Linux; Android 13; SM-A5350 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	203.0.113	38494bd8a91fed13f326939d5890d17a	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
29d7f126-a4b1-40a4-96fe-6c968d969542	e13b1de3-4e97-4c6d-99b1-f94032392449	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	7823c0b44e6bd8048ef7dace9ac3f1e3	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
d507234a-c051-436e-8116-7d98a7f1343b	bd49ab84-0153-494f-8ce6-c980db9edafb	Mozilla/5.0 (Linux; Android 12; Redmi Note 12 Build/S1P1R.220707.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	10.0.0	ee917fb2b9cd0e5982ecdb260c152784	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
22ee36ef-09b3-4a71-91cd-0d442d92f7c2	bd49ab84-0153-494f-8ce6-c980db9edafb	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	adf2fe29f7ad4e473cfca58395e59f89	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
31e497f6-b00a-48c2-846e-964d6582d1fe	bd49ab84-0153-494f-8ce6-c980db9edafb	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	c0efc86e6f7edec5b1a832d9d2ea6748	2026-03-31 13:51:49.575087+07	2026-03-31 01:51:49.575087+07	2026-03-31 13:51:49.575087+07
b5fa00fd-f7ab-436e-bc43-684ca1a9e69a	3677daea-cb32-469f-bb42-f729889772fa	Mozilla/5.0 (Linux; Android 12; CPH2347 Build/S.A.138) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	172.16.0	67bc59babbf1f4eb6445252b2c4a5518	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
ddf75abb-10fc-482e-aac1-c9d17907a89c	3677daea-cb32-469f-bb42-f729889772fa	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	0686ab70f0f5a01744c34fb75e7c5b61	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
83163157-dc07-461a-835f-ea6798eda77a	0bea5eb5-8841-4a37-bfc3-25d9cf15c937	Mozilla/5.0 (Linux; Android 12; V2142 Build/S.A.029) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.1	94a53ebe79dd512eb9fd635dc1948a20	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
4a1fac11-5f76-4973-98b6-1772b9e2fc7d	0bea5eb5-8841-4a37-bfc3-25d9cf15c937	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	e263b29511af627834db364029cc47b5	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
a30e8eec-b4f3-468f-8ee6-5b583cedf6c3	0bea5eb5-8841-4a37-bfc3-25d9cf15c937	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	36ddd762bc56d2ad024260bbd8cf539a	2026-03-31 13:51:49.575087+07	2026-03-31 01:51:49.575087+07	2026-03-31 13:51:49.575087+07
955a62f2-9d57-44ee-b80e-1d3c6a6285f6	c3eef0b4-6e64-4a1f-afcc-010c39debab2	Mozilla/5.0 (Linux; Android 12; SM-M335F Build/SP1A.220623.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36	192.168.0	538cdfbffc76dcc493a2c94a4024e034	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
408ea300-6886-45e5-a6a1-2082beb420b8	c3eef0b4-6e64-4a1f-afcc-010c39debab2	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	36bd1e7eb7c55aa866e3aebb5b6b98a4	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
a1f24644-085c-4260-92d8-e6bdb27846bd	53e33ab5-82d0-412d-93b7-97ba5c65e23f	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	203.0.113	f837e0aa5643a992a1da268a1d4baa65	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
29ffcd1f-e49b-46d6-b84d-9cc4afb12336	53e33ab5-82d0-412d-93b7-97ba5c65e23f	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	4c53644d3a43be106115c11a072b61ed	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
ae4cbd73-83c3-406d-a287-27e7a528e5af	53e33ab5-82d0-412d-93b7-97ba5c65e23f	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	912e8fe4aae214f33a65147d68f28db4	2026-03-31 13:51:49.575087+07	2026-03-31 01:51:49.575087+07	2026-03-31 13:51:49.575087+07
14d08c73-5189-435b-8031-d2f7cbb1811f	440f3f2d-d52d-4277-96fc-61942cfd1c3e	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.7 Mobile/15E148 Safari/604.1	10.0.0	c0d48235e8ee62db357437983d326edf	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
1224afa7-3b45-46cb-a1c7-98d170c0ae51	440f3f2d-d52d-4277-96fc-61942cfd1c3e	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	952f548c81cb10997b98da9221e4f00a	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
98f395d0-941c-4adc-a0fa-161f18b29a60	a6df18e3-3950-4374-a2e6-ae98487955ce	Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	172.16.0	8efbae6fd8089be2cced39bc2c027503	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07	2026-04-01 01:51:49.575087+07
62656dce-2ade-4f71-84f9-fb93ee2d251e	a6df18e3-3950-4374-a2e6-ae98487955ce	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	192.168.1	b85ec41331bfdca92db711690d32054c	2026-03-31 19:51:49.575087+07	2026-03-31 13:51:49.575087+07	2026-03-31 19:51:49.575087+07
334ef0ce-264f-4e57-bda9-5b4438eed43a	a6df18e3-3950-4374-a2e6-ae98487955ce	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0	192.168.0	4752fa41955ca85546ce3ddfa2197d1d	2026-03-31 13:51:49.575087+07	2026-03-31 01:51:49.575087+07	2026-03-31 13:51:49.575087+07
20b756d1-b108-4596-b13c-ddc708196a9c	5ea20f90-f37c-4d91-8236-75705d8dd207	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	125.209.11.232	9e3d21dde81402b964656cfe8ee0506ec4cce2810224053a672aa2ae608cc007	2026-04-01 01:55:47.816383+07	2026-04-01 01:55:47.810685+07	2026-04-01 01:55:47.810685+07
d490d68f-c7c8-4d7b-9cad-7214b0fb6649	5ea20f90-f37c-4d91-8236-75705d8dd207	PostmanRuntime/7.51.1	192.168.1	71461099fbf1a668fe2b17005f46a5ae1fdea4a8c6b753505aa3eef28c4b696b	2026-04-01 02:01:37.517626+07	2026-04-01 02:01:37.517384+07	2026-04-01 02:01:37.517384+07
e0a39371-47df-4ef2-a654-e0fbe10e7988	5ea20f90-f37c-4d91-8236-75705d8dd207	PostmanRuntime/7.51.1	125.209.11.232	352741d97dc4a8d0fa8493f0fbfc4f37d8c1d1d612edc5d71fd742486b6cb309	2026-04-01 02:02:11.413432+07	2026-04-01 02:02:11.413325+07	2026-04-01 02:02:11.413325+07
7c887d08-a4ed-4de2-9fd7-95de0d5b2fc4	5ea20f90-f37c-4d91-8236-75705d8dd207	PostmanRuntime/7.51.1	203.116.20.100	36f69903d9b1293a5e30090e241b556d7b163f18ffc461a74ff46c40ca719e67	2026-04-01 02:03:40.302431+07	2026-04-01 02:03:40.301849+07	2026-04-01 02:03:40.301849+07
8ed5c236-5d49-4204-af51-b40e7f0a15bd	5ea20f90-f37c-4d91-8236-75705d8dd207	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36	203.116.20.100	2ac6132ac9390042b51cf2c690ae3a5140803041e0cefe77148127adec94f97e	2026-04-04 23:50:01.704353+07	2026-04-01 02:07:05.752183+07	2026-04-04 23:50:01.704376+07
10f1e117-4c7e-4b68-87d6-1357044a1120	5ea20f90-f37c-4d91-8236-75705d8dd207	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	127.0.0.1	dbbbdc5e1637557045ea794986db81956efe2e897f46caf60d81381b5fe19413	2026-04-04 23:51:29.329065+07	2026-04-04 23:51:29.328655+07	2026-04-04 23:51:29.328655+07
f87b4bc9-a812-4d48-82d0-5e158e14d304	d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0	127.0.0.1	dbbbdc5e1637557045ea794986db81956efe2e897f46caf60d81381b5fe19413	2026-04-04 23:52:50.457397+07	2026-04-04 23:52:50.456827+07	2026-04-04 23:52:50.456827+07
\.


--
-- TOC entry 5097 (class 0 OID 25467)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, nik_encrypted, password, date_of_birth, role, created_at, updated_at) FROM stdin;
2bfbc422-6369-4ae1-958b-26edb32f84d9	Pak Negors	user@example.com	f2d5395c25aacd1ebc790ff55c7fe27e3e2b434444a624776d3e0ee3fe43d75936cbda40d93e85959739d840	$2a$10$R3S7ByOa3s/UhphjHTXSeuFxmjWW3qTddoTZQjlnkkwnzqyXP7/7e	2001-01-01	user	2026-02-20 19:04:32.374483+07	2026-02-20 19:11:40.742829+07
9317fafa-3a25-423c-bd40-7d8a222fe629	Jamaluddin	jamal@mail.com	e08f3b4df49a6ede5b820ca34375799e32398a0120a4ee979603057ac7bc2ec467cd49d0d988ddb474785ed1	$2a$10$PE0zUrjCfJDXgUytzYFqOeT82zBt57c3en24kQP30x/qkt4qbytgS	2001-06-12	user	2026-02-23 18:07:45.576198+07	2026-02-23 18:07:45.576198+07
d9e20bbe-3ef2-400c-afa6-0359f4df4d3f	Administrator	admin@jantungin.com	2fe27ace5b18e6673ba67e952db4c55fb1fae6ce8d67ecbef65394bbbc0d46b3	$2a$10$VpHqAF0xaQuP9EZp6.fqXOm9Ns1RKAqAXte1pQbBjHarV/ts03xJy	\N	admin	2026-02-23 18:49:20.346047+07	2026-02-23 18:49:20.346047+07
f836f2d9-8a4a-4dee-8035-6751a4618aa4	Harris Hersen	harish221@gmail.com	854ae0f40471e0c7c3a9fbcacc93f1d82a4af366cd5608a01ccbd885dd2f77f6c5d32bb57ae9bbab119f0ff7	$2a$10$oIs7suEsOa5oAOQbXq7OruSN10awRFNhBkzjyDO4CgF5rkHvTVhkm	1994-06-12	user	2026-02-27 13:33:54.09063+07	2026-02-27 13:33:54.09063+07
f571ef55-8b20-4a29-bd1d-1b053af9d1a6	Budi Santoso	budi11@gmail.com	253088d4c47784136398c64f2f08365d909665b599056c66f41643cd52fceb2a0aa2c62f9ad75391bb402b7e	$2a$10$.XEwzN//onnQcRvmDlsyxug9vDKsTE9bXeedCbmOttfkXR2lBtF8O	1990-05-12	user	2026-02-28 21:45:48.531044+07	2026-02-28 21:45:48.531044+07
47e2ed11-ed15-4e87-9d52-173ca82ef1da	Aditya Pratama	aditya.pratama@gmail.com	e1154e81d41e71ade3a15baaa29ab91cfa7238c66c24cb77008715aba546a081377744ef4f05e0c2179d821a	$2a$10$VTVVxdAtxtZENkgVDJsCCO3fF.paAyIj9LyW/7c2LsYvci.B/6Qre	1992-08-12	user	2026-02-28 21:48:34.262852+07	2026-02-28 21:48:34.262852+07
6ebe0ffd-05c1-49a9-9266-ccdf2c862843	Putri Rahayu	putri.rahayu99@pribadi.id	b89a4f2bb3b5e2fda1cd9f82f90df2c127528f10fe2039908bc016054d67ecf0135d9cb3a00e8ec53f371103	$2a$10$GcFrSCewFFis1.zyr5oksuThekyicaKvs..Ouh.TFcC6xvCDPT5vS	2001-01-04	user	2026-02-28 21:49:47.311822+07	2026-02-28 21:49:47.311822+07
d901fcc5-7d90-40c0-9025-40328d18af1e	Siti Aminah	siti.aminah88@yahoo.com	1c19ed5a1f7dcc14e404959edd4e550d9c94433f3f6b800fd67b829e340fd17abb330ffa2b8b6f46a6045bd5	$2a$10$TZ4ifoULllRfrGVRBws3V.aXsaWeQcxcoL5ly1TA85K0I8hze5AjW	1995-01-25	user	2026-02-28 21:50:49.870679+07	2026-02-28 21:50:49.870679+07
6ad7e49d-a6dc-4502-b096-b5793496b592	dr. Ahmad Fauzi Pratama	dr.ahmadfauzipratama@jantungin.com	7e7f005a7756e3d0ace31062efbf7c4cd98eb16c3294b92b08a222243b289209394541ffb1a8cea3a2f23971	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1965-01-01	dokter	2026-02-28 22:03:51.435395+07	2026-02-28 22:03:51.435395+07
e3252de3-c3ad-407c-a4df-902eee4953e6	dr. Budi Santoso Wibowo	dr.budisantosowibowo@jantungin.com	5424eeaf24c60210a3bd962b61372512c3ab99ac0236c3690a078d167cf8b006c4bfae24408cac6cec9beed0	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1966-04-08	dokter	2026-02-28 22:03:51.438444+07	2026-02-28 22:03:51.438444+07
068e0bff-7047-46e4-9ffd-b4244f5acfe5	dr. Citra Dewi Anggraeni	dr.citradewi.anggraeni@jantungin.com	acd47f9afc585c996191e4210994c90480f88fafd8ed768ed1bc63df1af80b9d3f19ac32f6ccbdbff32fc9df	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1967-07-15	dokter	2026-02-28 22:03:51.438444+07	2026-02-28 22:03:51.438444+07
20a8e48b-4bae-4ed1-b42c-e3eda1a974b1	dr. Dian Purnama Sari	dr.dianpurnamasari@jantungin.com	188a0e5379eedb5468e199c66e713ca243510ad81da39009d36d3ebc6c525e0dc68791c3db53597a21a1c996	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1968-10-22	dokter	2026-02-28 22:03:51.438444+07	2026-02-28 22:03:51.438444+07
810c8c14-ecfe-401d-8402-16e69fa7b68f	dr. Eko Prasetyo Nugroho	dr.ekoprasetyo.nugroho@jantungin.com	6df00469e1c8fd44eae1f32666071355263be40308c4f0d3ae419f5c882fb72292aa1269c18c27985a773e4e	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1969-01-01	dokter	2026-02-28 22:03:51.438444+07	2026-02-28 22:03:51.438444+07
ac1791c7-c4c4-49de-807c-ae010eb28c05	dr. Fajar Nugroho Santoso	dr.fajarnugrohosantoso@jantungin.com	4afeacb92e4e25491598ea296e2e628d40273f4a222e775312ab6b0a4c579a7880d875c3f8404f2807368e43	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1970-04-08	dokter	2026-02-28 22:03:51.444019+07	2026-02-28 22:03:51.444019+07
f33248da-f2f2-4092-8408-9f5c38b501c7	dr. Hendra Wijaya Kusuma	dr.hendrawijayakusuma@jantungin.com	5ee1090a5639da89bcc8ab1166175b698363b4043d17c51d3b180def0ba0bfba8974567ff40e827a92746e39	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1971-07-15	dokter	2026-02-28 22:03:51.44603+07	2026-02-28 22:03:51.44603+07
7a74619c-29bb-41ea-a99d-2fa133030796	dr. Indah Lestari Putri	dr.indahlestariputri@jantungin.com	e234a7e67e46ba788107e3a45938b3b84e25d126354296cbdb9e304f9a010c4c558ff30ba640bb69cd2a1cdd	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1972-10-22	dokter	2026-02-28 22:03:51.44603+07	2026-02-28 22:03:51.44603+07
76ce5469-1b8d-4023-8037-f3af693b94b3	dr. Kartini Sari Dewi	dr.kartinisaridewi@jantungin.com	0ca9498f16bdda284300d62e2bc83c4e956bdaec47d4cf21e56bbad8e0b8d3f89d746782fb0582890aed27b8	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1973-01-01	dokter	2026-02-28 22:03:51.448707+07	2026-02-28 22:03:51.448707+07
fa053c7d-6daf-4a78-b5ca-69f57b5cf2cb	dr. Lukman Hakim Siregar	dr.lukmanhakimsiregar@jantungin.com	d502c0aa50550e7b6659c1c6fe745c5d0459a79a08f7cc3e64871ca9709b4f946b48219ed428880d13b4f562	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1974-04-08	dokter	2026-02-28 22:03:51.450025+07	2026-02-28 22:03:51.450025+07
ff44381b-248b-41bd-92dd-71d38f034caa	dr. Maya Anggraeni Putri	dr.mayaanggraeniputri@jantungin.com	7cbb67f4afebfc4713c0d8c191164f2e1e7849800ad989dbd2e1c65bdd00ded639a943ec39912d4dee49516e	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1975-07-15	dokter	2026-02-28 22:03:51.451107+07	2026-02-28 22:03:51.451107+07
302392b3-eec1-4e23-9978-d64714e5a1d3	dr. Nanda Pratama Putra	dr.nandapratamamputra@jantungin.com	a56c0c3ccd027e5b4140d0dbeef7a3ed7d055ae6cf2391e38a779dc165dc98cabffd82a7348fe5120b899eec	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1976-10-22	dokter	2026-02-28 22:03:51.452171+07	2026-02-28 22:03:51.452171+07
061c8b8c-fa4a-46a8-9e04-956d597f5cc3	dr. Rizky Maulana Akbar	dr.rizkymaulanaakbar@jantungin.com	5b6cfd4dec1af766f61d112c626388fac7cfd41cadfbf19090c90093125249a7dc053c52b02ae7600bec809b	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1977-01-01	dokter	2026-02-28 22:03:51.453327+07	2026-02-28 22:03:51.453327+07
6e306ebd-284d-4e81-89d8-2bbb7156ef3a	dr. Sari Wulandari Ningrum	dr.sariwulandari.ningrum@jantungin.com	3ffafbd1a02478392e80125f4b692c8f335105fb96d63c9f067713a8974bf8c035b9512e7bcadd3b06f11ca6	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1978-04-08	dokter	2026-02-28 22:03:51.454403+07	2026-02-28 22:03:51.454403+07
32c6901f-65cc-41cd-9163-72ec2f83b480	dr. Teguh Santoso Prabowo	dr.teguhsantosoprabowo@jantungin.com	c70fa867eeb09a43234a17a2a51bf9521c102512f0c8e8ff4b41b56cd1da4d30f18e419ed90bdf82547d2d84	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1979-07-15	dokter	2026-02-28 22:03:51.455477+07	2026-02-28 22:03:51.455477+07
c50e1c28-96fc-47d6-a627-66e7cb54b95a	dr. Wahyu Hidayat Saputra	dr.wahyuhidayatsaputra@jantungin.com	55d2814af255b872bdb1ca50e35964e327956f891af3fd86c8e93660832944a14da217b6104573abb78e3274	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1980-10-22	dokter	2026-02-28 22:03:51.456534+07	2026-02-28 22:03:51.456534+07
a2917160-cbf9-4eb8-84a0-e4e190e8123d	dr. Zahra Amalia Fitri	dr.zahraamaliafitri@jantungin.com	a070f670690fd5c22cd82866fc01dd7ab3405734242973a34a58448b356198ab5140cb69b07c562d5eae9497	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1981-01-01	dokter	2026-02-28 22:03:51.45881+07	2026-02-28 22:03:51.45881+07
5e0802f5-387f-4f41-94ab-344b3e24924c	dr. Agus Kurniawan Setiawan	dr.aguskurniawansetiawan@jantungin.com	5bd24088fd2539f6bfc2607e90faedaed34e45975673b9bbe8547bc6cd15227cb7a77e60cc4861d13da6af5f	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1982-04-08	dokter	2026-02-28 22:03:51.461622+07	2026-02-28 22:03:51.461622+07
b5c6764d-57c2-47f6-afae-289133ac96c2	dr. Bayu Prabowo Santoso	dr.bayuprabowosantoso@jantungin.com	9bcb39cd53f83fc767fb1a90025c6eaae0d1d345539476f3066bf260dc7ea145392011c38c590ab2c966aa83	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1983-07-15	dokter	2026-02-28 22:03:51.462791+07	2026-02-28 22:03:51.462791+07
0dfcafe1-471a-4769-b0e9-ba4ae9adfdfa	dr. Gilang Ramadhan Putra	dr.gilangrmadhanputra@jantungin.com	fa2d6f3ed9750b572a2334961249a38ec3a147cb58da4ea602b6b6f27ebd09f15af9d8f045195bbdc64e0b20	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1984-10-22	dokter	2026-02-28 22:03:51.463968+07	2026-02-28 22:03:51.463968+07
9afcca00-28fd-46e0-a282-5ec7a595de1c	dr. Gita Rahayu	dr.gitarahayu@jantungin.com	87246917ca50315ffd855a12ba8231d960ad51e30c359b2d14ec5da757c845eb1252b486771205b6af563624	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1985-01-01	dokter	2026-02-28 22:03:51.46506+07	2026-02-28 22:03:51.46506+07
bb59e6e2-4668-4632-b101-81dc72da4dc5	dr. Joko Susilo	dr.jokosusilo@jantungin.com	d27ca813f5d2dcad6b574697084b55cbb510b04566146c08cb1ec3ac44a29900900d225c2cea1e92507073a8	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1986-04-08	dokter	2026-02-28 22:03:51.467648+07	2026-02-28 22:03:51.467648+07
840597ac-0b84-4a35-8454-3c99ffb12ecf	dr. Oka Setiawan	dr.okasetiawan@jantungin.com	6f9d5627cdcb68f1722874c79a9fb1de2938641cbbf3e42d83a23dea8c11525c06d59a41778106d7c54e7d78	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1987-07-15	dokter	2026-02-28 22:03:51.468735+07	2026-02-28 22:03:51.468735+07
a2f032b3-652d-4cdd-b216-813237a94eb3	dr. Putri Handayani	dr.putrihandayani@jantungin.com	d76f659f8f893d15f89808509e6a7443120e96fa0c4981f4719290727ddc5c43e76d89a9af1332e28842de8b	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1988-10-22	dokter	2026-02-28 22:03:51.469785+07	2026-02-28 22:03:51.469785+07
98d75ac0-a78b-498c-84b8-a9f7d1012239	dr. Qori Firdaus	dr.qorifirdaus@jantungin.com	941db6c797a368644f840f0d887608b8fd869911a383e8a494809ed3954ab0561ba7c8569be598cbb6eafd41	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1989-01-01	dokter	2026-02-28 22:03:51.470884+07	2026-02-28 22:03:51.470884+07
cec94bfd-daf1-499a-a925-2ebe00af964c	dr. Umi Kalsum	dr.umikalsum@jantungin.com	5f3161d8bf9bad8f1e42e368ee7f55cbf3faa07973842fa2d9e8d5986751dbe5394e0ae765c26a1faeca3ed3	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1965-04-08	dokter	2026-02-28 22:03:51.472464+07	2026-02-28 22:03:51.472464+07
411aebd6-06e7-48da-93b0-03f0da375c14	dr. Vina Agustina	dr.vinaagustina@jantungin.com	35f737fcca36755541e6fdda671e5095f1783ca77e47bc557b91fed41767e59714526b9e71631800cdddc125	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1966-07-15	dokter	2026-02-28 22:03:51.473732+07	2026-02-28 22:03:51.473732+07
611b449b-6877-49a5-9647-d9b016df3f10	dr. Xenia Priyatno	dr.xeniapriyatno@jantungin.com	3abcc5b7d9e4b1bc8c9bccaf65babf3cb0b52c2fdb3e5af8488c0e96a4505c02d54c6305a476726ca4077665	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1967-10-22	dokter	2026-02-28 22:03:51.474985+07	2026-02-28 22:03:51.474985+07
036fa411-f3e3-41e8-a802-1f5383eb2e6a	dr. Yudi Hermawan	dr.yudihermawan@jantungin.com	5fa8af56bd68aa8ab2eb2b5b9eb2661db250ec65ef0086a6c05151a5ed3c317b73c63e0284eda8526291ab8c	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1968-01-01	dokter	2026-02-28 22:03:51.477134+07	2026-02-28 22:03:51.477134+07
0f4ba7fa-1cc1-4e1a-b07d-eb98a30cbecc	dr. Candra Kusuma	dr.candrakusuma@jantungin.com	5af24a6ed356d3f91e647968c489155c254e76d84c6160abfe7be83f6281f3790e72893b3208481e1a0669b6	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1969-04-08	dokter	2026-02-28 22:03:51.479001+07	2026-02-28 22:03:51.479001+07
3c91c8f5-d4ff-4928-93bf-8459bb70e921	dr. Dewi Safitri	dr.dewisafitri@jantungin.com	e5b8b4d96584d7401eac9cf417acf8a5fc665ec8ef750c4f7d4652fe5978a2f1dbc4b6f518fed93fa322400f	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1970-07-15	dokter	2026-02-28 22:03:51.480748+07	2026-02-28 22:03:51.480748+07
bca90991-74a4-41c7-91d8-5aef53720372	dr. Endang Suryani	dr.endangsuryani@jantungin.com	d0574e3907596adc2b0aa1210ecb58608c7140a56bb1cb020f2421bb73a022aa7ce4e12089c9b66d28d6048e	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1971-10-22	dokter	2026-02-28 22:03:51.48241+07	2026-02-28 22:03:51.48241+07
341a2f28-0de9-4cd0-8836-090d3755c025	dr. Firman Alamsyah	dr.firmanalamsyah@jantungin.com	54be67a2ac23da780a4ae5dd6b0b3bc26645cd972ec66678dd2bfb4e031495eb9911e219bbb935ab66459a3d	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1972-01-01	dokter	2026-02-28 22:03:51.483453+07	2026-02-28 22:03:51.483453+07
46512c42-53c8-4646-9358-208b3693bceb	dr. Hesti Pertiwi	dr.hestipertiwi@jantungin.com	3a8009fd5c60dec82cb64891e7ea4a5586ee08fe5d5cce582450ec5aa7b791a12ca1012d35f46978cd0f7c56	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1973-04-08	dokter	2026-02-28 22:03:51.484605+07	2026-02-28 22:03:51.484605+07
e335b354-6237-4b6f-bde1-2bb8212a3d13	dr. Ivan Kristanto	dr.ivankristanto@jantungin.com	8229e6a48458a9c1effcf3bef08d4ac44e6108620a5a56424198ad348ea1ff2e5797e5092f06eda2d07210f6	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1974-07-15	dokter	2026-02-28 22:03:51.486137+07	2026-02-28 22:03:51.486137+07
a9734f4d-d2b0-4774-ba58-f16a84863537	dr. Krisna Adiputra	dr.krisnadiputra@jantungin.com	b3c4997490a5645eed7227e63ab8ce554e1d216c6e1136efdf6c9396bbda742c12015738844f17c83da05d26	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1975-10-22	dokter	2026-02-28 22:03:51.487708+07	2026-02-28 22:03:51.487708+07
bcc038c0-888a-447a-86d7-9b30a2190389	dr. Laras Setiabudi	dr.larassetiabudi@jantungin.com	1078d4bc013f292497b02f5a8399bcb9e92ffcde2fc428e6565cc20516ed2b7a709eec3cd17ebf198607664d	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1976-01-01	dokter	2026-02-28 22:03:51.488836+07	2026-02-28 22:03:51.488836+07
f2c7ee81-7892-4fc7-9eee-1ac28c528ddc	dr. Niken Ayu	dr.nikenayu@jantungin.com	1222d72341e4728dd12f6189b40975299e028d45e8107beddeef878043f9482be673b8660f2825b1296fc40c	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1977-04-08	dokter	2026-02-28 22:03:51.48999+07	2026-02-28 22:03:51.48999+07
b60f4cb2-1cf0-40b5-9cc4-5b2f4b56cf1f	dr. Oscar Dermawan	dr.oscardermawan@jantungin.com	c1214e96d6321017be51acc840fb33e04619dd09b513186fee0416c8769ab0232758b56528d7b735aef27438	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1978-07-15	dokter	2026-02-28 22:03:51.491144+07	2026-02-28 22:03:51.491144+07
954e0008-0108-4997-bade-1f93dd81d677	dr. Prita Kusumawati	dr.pritakusumawati@jantungin.com	5a54bc2e8d1c50259f668da492d26afbfbbee77f3cde32d82c68c7d9894ef3317b45b4b642a8aabf2f0a83e9	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1979-10-22	dokter	2026-02-28 22:03:51.493289+07	2026-02-28 22:03:51.493289+07
39ecb20e-9a3b-4e63-90e3-4c96bd9d4629	dr. Silvana Maharani	dr.silvanamaharani@jantungin.com	210e06803a32040b917c8cf80b89c0323801f02e62c30dfaf1751a3c1828b1315004a5cf1d41045348094278	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1980-01-01	dokter	2026-02-28 22:03:51.494879+07	2026-02-28 22:03:51.494879+07
aebae8a6-d6c6-4433-a0c9-99df0c73cf5c	dr. Tri Hartono	dr.trihartono@jantungin.com	70161974e772eb0a0824694b54b2b1aa0ef95fa944711657932d5a6cf1806d3f4088e5ac37a0f47a7f46c22e	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1981-04-08	dokter	2026-02-28 22:03:51.496628+07	2026-02-28 22:03:51.496628+07
27ffba0f-6045-4fd8-b55c-40605910c489	dr. Vicky Ardiansyah	dr.vickyardiansyah@jantungin.com	45ba46c97a7f614dc71f9316450a902f64ee95d14d5aaf0b9a60a53b3eea9b7a8ff164c370a02e660abf5d47	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1982-07-15	dokter	2026-02-28 22:03:51.497708+07	2026-02-28 22:03:51.497708+07
f108cd71-b93a-4e34-8332-1284f92f90fa	dr. Yoga Prayitno	dr.yogaprayitno@jantungin.com	eb4b7b250764d67d93af1617b98bf95aa95a783a5965cd797838f96f59677634d4dc69aa225ad5bff4cbbaad	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1983-10-22	dokter	2026-02-28 22:03:51.498819+07	2026-02-28 22:03:51.498819+07
5beaa850-e6c3-4281-b44e-0ef779757f0b	dr. Zulfan Arifin	dr.zulfanarifin@jantungin.com	1a3655e3feda5ac5bac83ad82a1ab3ba9c2452aed4fbacbfed1bd3b725e3d6459fedd4ae029abb61cfe98e50	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1984-01-01	dokter	2026-02-28 22:03:51.499989+07	2026-02-28 22:03:51.499989+07
46d88ab2-2040-4d55-8d6e-03233af4ba61	dr. Sukarno	dr.sukarno@jantungin.com	736625a80c50037a10bee6e677a2f175d9d17399ce977a3629d181df7822ff014567a7b6fc30a777a51a5226	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1985-04-08	dokter	2026-02-28 22:03:51.501133+07	2026-02-28 22:03:51.501133+07
93551e90-4631-449c-b392-3edfb141cbaa	dr. Suharto	dr.suharto@jantungin.com	2747b7e64a61a40e962466f356c13bb87895a3ccbc3655280375df1e0f54882790cad74c988419369704c892	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1986-07-15	dokter	2026-02-28 22:03:51.502345+07	2026-02-28 22:03:51.502345+07
440226a1-99ee-41cc-87fd-5def8ea0ce4e	dr. Habibie	dr.habibie@jantungin.com	0ce09e875be7e11de97ee0e4924108844228f06e36870da72d6a31363cac94c99934ae07754eb2643de37c2a	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1987-10-22	dokter	2026-02-28 22:03:51.503382+07	2026-02-28 22:03:51.503382+07
14ddf0a5-f591-4381-9160-e7ff1d3866fc	dr. Megawati	dr.megawati@jantungin.com	04dfff44f7454c166d464a499d428e9913f38eecc685674aec122625a8220c7917ddfb6e360bfe400793ff07	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1988-01-01	dokter	2026-02-28 22:03:51.503906+07	2026-02-28 22:03:51.503906+07
bc14f158-c51b-4823-acb3-5a0b48c2ba3f	dr. Wiranto	dr.wiranto@jantungin.com	012b1ca943489e9e407beb4596dfb7e1150e5e86712cb784b5f9037b9e8ecbabcb178c244181dcf4a6375c91	$2a$10$M73MO/MrNpJn00A4OtVT9uLIlIyoE9c7IhAXO2Q5njzlGVoRdcpFe	1989-04-08	dokter	2026-02-28 22:03:51.505075+07	2026-02-28 22:03:51.505075+07
5ea20f90-f37c-4d91-8236-75705d8dd207	budi_santoso	budi.santoso@email.com	38418767a0d5849ef84725b796618d1e586cbd9db8d7e25c5c7527a50f2d446539e30f2f744c34f0261696b2	$2a$10$oxD20p9Pszd5DKMwDo7xBuZ75bPLmDnsRKhwAJcpUzG7hgDOLrBTm	1990-06-15	user	2026-04-01 00:44:12.470402+07	2026-04-01 00:44:12.470402+07
924e9091-9c56-4c8b-a75e-dd942c27850a	Ahmad Saputra	\N	06319a64014f7c249e8d2c498b3bf1fafb5675ae46ec3e77562c8ca4280c482c74d005d8a363e33b4159	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.488938+07	2026-04-01 01:21:58.488938+07
a90df4fa-fc34-4f66-bfe3-7e64bb448308	Budi Wijaya	\N	2a9d4424cb764364fcb565e4caf83ad5957dac33d85be44ae84bb09d654d83f105e805bd33b8ddd8f7d8	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.501169+07	2026-04-01 01:21:58.501169+07
1b1b422d-8152-4790-b33f-999cc06fff5a	Citra Hermawan	\N	afbacac06d0ba09cc19395e99edccd93c1a0b2bc2e99c3716e355b942f3ae1d2c7cd97f025b05df9156a	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.503181+07	2026-04-01 01:21:58.503181+07
ccf799cf-8d3d-4b45-bc94-480b40713bf0	Dian Kusuma	\N	1e735dcd40507fa9fe3b1659ded711049d1affb8081db1dc338d5707948a63ae31ef17adcdf30c5f6134	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.507498+07	2026-04-01 01:21:58.507498+07
ecef99c6-867d-457c-a9eb-932b38dc85f3	Eka Rahman	\N	4dc03e03c5c34e15d1d6b058fd80e27d36d2a9b1aba968afc5c0d6d0638d3ea96e81edd148e3208b8ccf	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.509006+07	2026-04-01 01:21:58.509006+07
060a7a40-10cf-4514-81e2-fa7bee298ce3	Fajar Handoko	\N	9b8ef0507e6a2b46d221a20129776c6660b09711986d611ba5c6f5d21914513ec9099810b96a53930579	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.510865+07	2026-04-01 01:21:58.510865+07
ae26304a-61cd-40a3-ae3a-b1b8520edb62	Gilang Santoso	\N	c2be3aa1ece24ee118cd32fef24c524ba2a6bffb12afd04b227f6ea8f55ad841477f3986292cb7649437	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.512726+07	2026-04-01 01:21:58.512726+07
52285a87-2543-4b86-8d97-5a9925e6429a	Indah Nugroho	\N	8d2582e30263b41cc82840eeaa92287fb3988cf36a62e3e754b60e63be3e8aa1ffa8548e0d153efa2be1	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1987-04-01	user	2026-04-01 01:21:58.514458+07	2026-04-01 01:21:58.514458+07
542368ba-e48a-4cb8-a5d8-488273a97e9d	Joko Prabowo	\N	5725267dad61f1f00d63332f7927529885e71da02e94efc27d2995b2fa2148f87bfe68c03bf3e5bec58f	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1986-04-01	user	2026-04-01 01:21:58.515963+07	2026-04-01 01:21:58.515963+07
18efde8d-0f3f-4aa0-ba93-53191fd03fc6	Kartini Setiawan	\N	6b4549cd0f8e7f2247398d11044de1e14df55713e7c550fd2b8a9ec12125a3a1c81f7d54d4e5b7eb9e8b	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.517401+07	2026-04-01 01:21:58.517401+07
bd3f6027-c5a0-4e6f-bd21-bfd434333e5c	Lukman Hartono	\N	b70ff2336e946672490682f5e20a66f9440e0b9b5bb62436ae9a84b0141e4a7a1d418f2ee2e6d8821f41	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.518653+07	2026-04-01 01:21:58.518653+07
70c29234-09f0-4bc6-a576-8c030ddb2b5a	Maya Gunawan	\N	b8ba124d1fd204c29da3475bfc3613497c5b859ebd00eb32c50eadf03d4942007fb3367d499edcebcffb	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.520335+07	2026-04-01 01:21:58.520335+07
5e17aa3e-cbee-4049-adf7-6d72a276fef1	Nanda Sutrisno	\N	f14c131f4bec345743e15812029d23ba6e19a68cfbc8a1f937dfa3867aee34f03a54eed946dd1f82fffe	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.522889+07	2026-04-01 01:21:58.522889+07
f8e01e17-ab27-44df-b824-2dd6f5b4adf1	Okta Mulyadi	\N	f7e6bc310bc49a1fc72209a6137d98091b37a0fa0bb2672b3eab8eb1c139458be79a783f0be806e8d0f5	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.526205+07	2026-04-01 01:21:58.526205+07
deace981-6c2c-4933-a89b-f0c43b5db317	Putri Wibowo	\N	5c012c3563929cc012199cd23795abe968bdb08403c825f3cb68e5549cad0814f389af8d6c6495183246	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.527837+07	2026-04-01 01:21:58.527837+07
7e068810-70ff-49d4-a24a-f62daa1cf753	Qori Suryadi	\N	03cf67cdbfbde5ae75640cdc4f610f1e9be586fceb5c39a2cec99bd4094675a689745645c6def8e13e61	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.529736+07	2026-04-01 01:21:58.529736+07
b06b8666-005b-40d4-b1d4-52de315ea62a	Rini Maulana	\N	c22a02d5eec6a0fa076586568452c44f90d729cb7bb4fb26f4d711ba38a5fc9d4882a566bee692f2f2af	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2004-04-01	user	2026-04-01 01:21:58.531476+07	2026-04-01 01:21:58.531476+07
fffb9aab-9b57-47a9-8259-c99f3b44ca2b	Siti Purwanto	\N	9aac8325700bb59966e2196e97e305364f998a75f54e29871edd5be1817a8fa8eac39d0321268affb184	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1977-04-01	user	2026-04-01 01:21:58.533455+07	2026-04-01 01:21:58.533455+07
6b3810e8-55e0-4201-acaa-dcfaf309f27a	Teguh Kartini	\N	6b06ae7a09d0efe255422dc1a323e88dde0d45fbe8cb68aa7d75e595c21d93b518cfd75449b3819a9256	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1976-04-01	user	2026-04-01 01:21:58.536314+07	2026-04-01 01:21:58.536314+07
49b150da-2475-4b02-b9f5-98170b444a54	Umi Rahayu	\N	c35c37d6038673151919dc0a1ecc52650faadec0f14c14bb53a882e9f3b4869e0176d1a17bd166a05a9c	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.5418+07	2026-04-01 01:21:58.5418+07
3e9bbfdd-974d-4650-a4cd-0d92d3ab699a	Vina Safitri	\N	ab3d87010bbba673e88318092fad53c76207d0e93aa2368cf4cca18efb0df27baa4cb369e353a1fbdd30	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.543941+07	2026-04-01 01:21:58.543941+07
830404fa-2fe8-423f-b291-06aa8454a450	Wahyu Susandi	\N	83ea6ceac4bcf895759e9c2dae4cb36519335566d321b7117e6bff8cdbd5e73a5263b23d98ed5f9099dc	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.547091+07	2026-04-01 01:21:58.547091+07
ee74c781-53be-4af7-bfaf-d1f0c4a355a2	Xenia Wahyuni	\N	e53ed52a869a4c5e9af74472c476b3c0caeb99ed4aa338bc697b40e71ccb178193a0e220e5021e9fbaaa	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.548673+07	2026-04-01 01:21:58.548673+07
956ab8f2-57a8-4c94-818a-6744b83d6d53	Yani Suryani	\N	3818472bfe945ecda719062beacdb9896ad9018b75f095a461551e3c478ab6af4feea356520a548e19e7	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.550592+07	2026-04-01 01:21:58.550592+07
6148fca6-9ed0-4579-bc7c-41b6a06ca2a5	Zahra Pratiwi	\N	0d731df9dc4e3d83eb55a3137a95d4b46b11ea6c8320dca6f769e71405d8472ce990d6ae83782874daf4	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.552569+07	2026-04-01 01:21:58.552569+07
f251f04f-a87e-48d4-a0a5-09bf28a38bec	Agus Samsinar	\N	1ece147bac3da7a0050f90f80b2d6e8d0cb8d58bdf06fd47bdd46b790ec3f16428438d81b8a8d3753f8d	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.557338+07	2026-04-01 01:21:58.557338+07
3f5b2acf-0721-4d47-8a7b-20abca8a4b27	Cahyo Siswanto	\N	b125622d91af3886a42f859da2fe0bade132e0ef41748f21e3dbab1dfd4ea6c66df5d19fdefd8e1c7e06	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1992-04-01	user	2026-04-01 01:21:58.560715+07	2026-04-01 01:21:58.560715+07
2f8c0219-fef7-4ee0-bc2e-d004d1b18e11	Dewi Ermawan	\N	c1497bc71c21970aac444a5bce74666de315f800e155c6189bb36a9af2ad1c9fffe1d19761a0e4bb6db2	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1991-04-01	user	2026-04-01 01:21:58.562305+07	2026-04-01 01:21:58.562305+07
fefd09f0-c320-47a5-82f8-d570c548f5af	Endang Suryana	\N	770e16f2d4d9b0cb8b6bdd417fe4d59ef72efca8d0f8c05792bbb6901f84a6958d6aaad758fe0859d085	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.565038+07	2026-04-01 01:21:58.565038+07
19a1b22c-0218-40f6-9349-9582b1521c3a	Firman Sugito	\N	165f91b8f13e28842dc4da26625a4f76c952f36637583b35f373dc3f2e5a4b8345ce537d3af76e7a67c2	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.567076+07	2026-04-01 01:21:58.567076+07
8e0fb277-b00d-4565-863e-be8010b5e05a	Gita Putro	\N	5eead96e00684667e20866093609831ddcf743b94374d42b352fbc000b50e59a788785b3bcc3446c9680	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.569183+07	2026-04-01 01:21:58.569183+07
423c898c-8728-4277-a85f-c8b4f4bbe6ed	Hesti Harsono	\N	5d0f7c3717835de63a762f3965fe9f9e42b84554baf705f0381cd29a662c33264f75108cbff9db2ec885	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.570858+07	2026-04-01 01:21:58.570858+07
e12f3a74-83e5-4275-852f-44e50c400f20	Ivan Agustian	\N	0bbae6117dc0e930409608fb14f1e7611b37db7034c55afec2cdb6d60b4f57f80d1e48c4cd9393ae3734	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.572898+07	2026-04-01 01:21:58.572898+07
5a5461fc-e2bc-4bff-ad86-a0c96a3bfe18	Krisna Prayitno	\N	a6c3a866ed85f0bc16b852f1a56e0ffc1b354be158cff612cf127ec7414ff8d7d43b73f82146b09a9472	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.577995+07	2026-04-01 01:21:58.577995+07
cfff1b03-5c21-4660-940c-0d67e3d9dcaa	Mirah Budiman	\N	e298ecf18973b11f84f8d2621f955622a9d4f7721e953dbffcedacdb9becf6d21ab46401f1e9113dfb84	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2004-04-01	user	2026-04-01 01:21:58.580255+07	2026-04-01 01:21:58.580255+07
b8790557-02ca-4417-857d-00ebdc9f275c	Niken Darman	\N	1bcb61e6a1c03c37cb7750497370f65f77838184a237ab62a5d66c9ee8a08a88e9eeef10f47f4e672a2c	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1982-04-01	user	2026-04-01 01:21:58.582147+07	2026-04-01 01:21:58.582147+07
f3ebea2d-13bc-46ab-8de4-9ddf4d70f2c6	Oscar Gunarto	\N	dd85e9358337b7bb87b8f9711db7c15deaf3da576f5fd31162b38418f4860bf7cd9ac5bd91907fb85898	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1981-04-01	user	2026-04-01 01:21:58.583317+07	2026-04-01 01:21:58.583317+07
12543c38-cfff-4c71-9ae6-9dd27a47a8d6	Prita Haryanto	\N	a32a6863276af833708f71496131830ed90925f0f334fe46703bfba8f3a3e3a559df0ed786b7959c5ebf	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.585032+07	2026-04-01 01:21:58.585032+07
e34a494b-3d3e-4526-b96c-4d26eb04f625	Reza Ibrahim	\N	ee40519e77f5b5908fb5247b481039c9ef1182c8c316cdda5ec2fe5dfa9fe4bd21ad91bdf2f7e5959c47	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.587899+07	2026-04-01 01:21:58.587899+07
2f2dcaa3-d825-41c7-8315-10f2a9fb943e	Sari Jumadi	\N	3f7aae95bdd7112a97a3e72d411f3de9897e02702ef0216ac3a1ce68bc853285f4ae30a8eb7d768e63c9	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.591997+07	2026-04-01 01:21:58.591997+07
d06aadd9-985e-4292-b858-a7914a425495	Tri Kustarto	\N	2bed8566975219bd83cb83457d10db3bdea9e630a7d89d950fe18c003c460e956a12185d423d55c3523b	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.593612+07	2026-04-01 01:21:58.593612+07
2908b450-b9bf-4ad2-8bd6-1d9ff8875088	Udin Lismanto	\N	5f9a90a781b5b325967099a71eb3eb931fbd59630d2b971b5461bf23fb753312ff2403e67715a28e761a	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.597104+07	2026-04-01 01:21:58.597104+07
1c0c308b-ad34-486d-b305-aad98b684be7	Vicky Mukhlas	\N	c30806534c658d4acb061b228527f76ecdc119711ad78cfdfdcaaab02604c5eeacb9a0cc1c6a79897dfc	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.598689+07	2026-04-01 01:21:58.598689+07
5d5ba6e8-1078-4142-bd95-96a810abae30	Wardi Narwanto	\N	a2cff3377c5c908d503f16f9a3e8d59c7af769efe7889254920e7f27b8ed5730dacad30b55189c894350	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.601239+07	2026-04-01 01:21:58.601239+07
4b53c37f-ed51-482e-bf81-d3a2e2aa0c89	Zulfan Prasetya	\N	05c4ea16745ff3a863a1aede13e545375384673374ed02a35fada809942d06ae5af88e7b0e9a505812eb	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1972-04-01	user	2026-04-01 01:21:58.603543+07	2026-04-01 01:21:58.603543+07
3ad3373a-47d3-4863-b8ad-38d41bdcb5df	Adinda Rachmat	\N	00f38f8a341ad09ba55e6130f14d64ea6e0ff5df3537d1430ba11d3a23811be698870667de8368965be8	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1971-04-01	user	2026-04-01 01:21:58.608709+07	2026-04-01 01:21:58.608709+07
d32af7bc-da09-4fa2-b1d8-27637c960260	Ahmad Saputra	\N	ead14492cfc4bca71be4d56366a869f9b56d1fa69a772fc603b49a20b8a9f2afeeb64805e5043e30f3c7	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.612332+07	2026-04-01 01:21:58.612332+07
b91b071b-51e3-4037-ab9d-f32c97c1e04c	Budi Wijaya	\N	b6804572f6d53eb9e9e9e03bc00e1d40b66243dd22688fd232b13ad0fa7ac2b11e5a1f50b1b4733c526c	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.613453+07	2026-04-01 01:21:58.613453+07
aa439156-14e8-4816-9835-943314dbe8cf	Citra Hermawan	\N	f125f74d575dfd6e6b503b5e473b2a7e979c144870bb22a79807331e2ce247088d0a8331e04106a4e011	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.616141+07	2026-04-01 01:21:58.616141+07
92362d55-4892-4a68-9923-05a1cd3d293b	Dian Kusuma	\N	902c52498ef71f937937d1efde9f0d7d1855c4f9e47d31664bb63dfc5b97bdeda87e2d82002b5653c296	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.617218+07	2026-04-01 01:21:58.617218+07
0a1e3532-ca89-4317-848b-07a7683a66cb	Eka Rahman	\N	e64c0712f40dc6647bdde6aeb04b92de9b4173ec362c4371ebb2f13c3648c36dfc2591a7d0ec6565cc35	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.618852+07	2026-04-01 01:21:58.618852+07
45d352ed-9b71-4dc7-9200-a8151fcb808d	Fajar Handoko	\N	6a806e0d317e41fcb2b66f4b3a40b761930d11fb5dc23a3a88a31f1605ff1dd8d52772ef2c05ab58acad	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.621142+07	2026-04-01 01:21:58.621142+07
bc90a8fa-5d29-49b8-a631-d48fd3df8a13	Hendra Pranoto	\N	60f813db141b10577d193d7f8dd782381664068ca1cc2fcd463fc849f0a6aa934f6dc72fcfaf341ecbd9	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2004-04-01	user	2026-04-01 01:21:58.623472+07	2026-04-01 01:21:58.623472+07
5d0442a0-c4b1-458a-9684-93c511701854	Indah Nugroho	\N	6654e1387d10664d82e72153d4a45ac1e11ab43ebf023c7761f66ac5c85d59724911bdaa2694f05b502e	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1987-04-01	user	2026-04-01 01:21:58.627204+07	2026-04-01 01:21:58.627204+07
1d7811ce-659c-48fc-9757-5af3a68117f2	Joko Prabowo	\N	28fd5cf54cb34918390e086200a9c85fc46b85c0b40fd8f13c079d44c4363b2b84260f2d7266bc22fad9	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1986-04-01	user	2026-04-01 01:21:58.628864+07	2026-04-01 01:21:58.628864+07
4173fcd5-e619-4e4c-82e3-14861e892a4a	Kartini Setiawan	\N	7a39b857af2f911ebf30aef64c0e1656266a5f177d535d113f5438917be55c7a8dcc1b22a9103552e2a7	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.630695+07	2026-04-01 01:21:58.630695+07
2b4ddced-3209-4f2d-ac40-96077fcbd6c8	Lukman Hartono	\N	5d2cf8555337c4c356cbc3b3c04effe814d88d040a71990d7ae87175ab24df7b2fd0f8ea12b8490f30c9	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.632463+07	2026-04-01 01:21:58.632463+07
f58fa8d9-7362-4dd7-9aa9-e753ac414643	Nanda Sutrisno	\N	6d6b7bbf794400faf5dd779ba8f87f706ea08f96588e5ee61aeb41c8ef4643cbea495fee4981bd609c92	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.636992+07	2026-04-01 01:21:58.636992+07
1418e39e-d58b-4710-b705-7f72f47c9801	Okta Mulyadi	\N	f611bb5de902d61c186596bfa7d4266ecbd01516cce7382bd09437ee1a5cfdc1669c2e8afef4d7d55506	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.639438+07	2026-04-01 01:21:58.639438+07
b2a5edfa-c08b-4bc5-bd3e-4cbded2ecbd1	Putri Wibowo	\N	91ff31fa3aedc1e31c7ce04725522e1ba27d01a65d25691403e578bd202ff8e513c045e0ae95e8834e98	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.643211+07	2026-04-01 01:21:58.643211+07
8ca75076-bad4-401a-822a-aab38f300929	Qori Suryadi	\N	cec8ce1db97659eb6e1de6c138f5e1362e7760ee859fea2ccf5377339de337d1290bfb06231c3b9d47f2	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.645862+07	2026-04-01 01:21:58.645862+07
15936dd3-ff6c-4614-a5e3-eb1e24dc5412	Siti Purwanto	\N	7b77c0b5234f73db8145b4fb7c94d260c609e0e1e2b67f2c051af79e001d8f10d78ed0db1459d52b6eb5	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1977-04-01	user	2026-04-01 01:21:58.657202+07	2026-04-01 01:21:58.657202+07
8682f05b-9463-40fc-90aa-50e61b602114	Teguh Kartini	\N	608248a1e180637198148e753115cdccac655a8f9882a927fbd3abac5247f8581726aebe88d8db76db23	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1976-04-01	user	2026-04-01 01:21:58.663049+07	2026-04-01 01:21:58.663049+07
d34e5532-fdbd-4fb7-bcc3-07eaa699336b	Umi Rahayu	\N	7596c91bab2017d2cc9d05ad1b11d05e2447caf5a2ab316de4bdc2542153ff5b724c033191036d983de8	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.667157+07	2026-04-01 01:21:58.667157+07
c649fe5d-e1ac-4a5f-94e7-371817774630	Vina Safitri	\N	6ac867fc2b77006449bb3c01556b5754221ef7c167bf3541e32b6cfeeb4b506bd3f305c653f8e4794964	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.668823+07	2026-04-01 01:21:58.668823+07
98e0fcb2-96bd-4930-b975-b5aeab54388a	Wahyu Susandi	\N	d5ab26684977ef7e9919ee03fc13d3ddd149775b6a3ef8b3731ffd161c156e628429bf51c6591bdcd31c	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.671397+07	2026-04-01 01:21:58.671397+07
c527f80d-5ea1-47b0-bea9-23be14a39814	Xenia Wahyuni	\N	12555029b0e2f259625a939c58b3d978143acc1693bc793a3a0b347b75ec7a6183df23f2a3290306fa6a	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.680927+07	2026-04-01 01:21:58.680927+07
ef431de8-e834-4f98-a124-26607b11539b	Yani Suryani	\N	f177946d9e78f3753c74732afe956d37b86cc016019fcca546c4390a36ee863176ae7f370d51a8ef1928	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.691555+07	2026-04-01 01:21:58.691555+07
c126ce77-3e57-4b64-8d98-1d1182e383eb	Zahra Pratiwi	\N	30ded562851c0b3a862303940dd6cdd318ba2fdea070a99be0fc2e9c02e62df127d87129c39dd572c6ac	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.696627+07	2026-04-01 01:21:58.696627+07
1c5ee5f1-2a95-4c33-b788-1823983523e8	Bayu Hadiwijaya	\N	fc9cbbf3a23aaa9443ffa341c32476ac25390d86b6f8939addeff40cfd11e8bdb10ea890bb48c212cf35	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2004-04-01	user	2026-04-01 01:21:58.699349+07	2026-04-01 01:21:58.699349+07
4022a2d4-9520-4ac0-b524-4dd3955ffdd1	Cahyo Siswanto	\N	9703e2b241537fead17d1b853bfc37c1fdf645ed64cebe32365da4db1ab7d40173e3b05f05ac4e3ad012	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1992-04-01	user	2026-04-01 01:21:58.703531+07	2026-04-01 01:21:58.703531+07
b7836149-1e0a-41f6-a096-c2ffda351c1c	Dewi Ermawan	\N	18727d748d8428b241d0598b5d0729d0cd78fb636ffd4c6219548d690bd0cb766c812022a2a675f3136c	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1991-04-01	user	2026-04-01 01:21:58.7214+07	2026-04-01 01:21:58.7214+07
151932fc-0cab-4f73-ac21-d15e3f09c754	Endang Suryana	\N	6fbfb4f93f124ffe125cb60b02e134d3d248ff40851a10a8ca96127cf03f20789cedc13d290c7b6415bc	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.72717+07	2026-04-01 01:21:58.72717+07
c823eff5-72dc-4588-ac31-97d18f36c70b	Firman Sugito	\N	a98ad316040937c5445a62bafae22bfb38c1ec53fb7336daa621e7941255da9c58e190b5495652f3875a	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.731231+07	2026-04-01 01:21:58.731231+07
57eb6d9f-5807-4432-8334-34f777b65562	Hesti Harsono	\N	0842d700c6c51825cccdad2da4cb32cb3ca20e18aad472e4eafd4a54a838a19c3b0f534b1505ec6556d9	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.735552+07	2026-04-01 01:21:58.735552+07
d98330d0-b5cf-429c-94dd-726995b2c3e9	Ivan Agustian	\N	520fe10024ab71c1957ccb144aa4f120b76fecfdee2b6cf55e475d210a3371428b620acc4f746d5948dd	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.740025+07	2026-04-01 01:21:58.740025+07
c92dd74a-a53a-494b-94c2-5df17df75bc0	Krisna Prayitno	\N	a45ddc698c812583afb63d5d6ef428e726f9dc78b5ee8cd9742944d0890c1c3026ad2ae84965a97a4f38	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.743392+07	2026-04-01 01:21:58.743392+07
76ce21c0-e1ac-43ea-8271-2fe66405b023	Laras Subarno	\N	c56ba448cbe0fc23a3061dfe187e6c358defcbcbc250dc5fc52b3d19e5d3ca73e5c12bac6f4cbb3c2858	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2005-04-01	user	2026-04-01 01:21:58.746066+07	2026-04-01 01:21:58.746066+07
f8e972c0-5474-43cc-ba6c-dac7e0493784	Niken Darman	\N	afaceefc4efbacb2345d122f3665947bbf22c80b2a6c5ffc5aab5650cf8a41a953fa6ddf60014346aa28	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1982-04-01	user	2026-04-01 01:21:58.750125+07	2026-04-01 01:21:58.750125+07
4d049ed5-a58c-46c9-a3d1-bc33574d1cfb	Prita Haryanto	\N	8e30a969dc51f1df1f50678a298314e251855f4092911f9aba4b5361280951920e57906a1efa058ed488	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2001-04-01	user	2026-04-01 01:21:58.752838+07	2026-04-01 01:21:58.752838+07
e13b1de3-4e97-4c6d-99b1-f94032392449	Reza Ibrahim	\N	b38ecdbe8b661f1eb80a56688a1d313f2cd1bdf9d1ac14864eb218d0b5b4ee9b7115a08a908d0acd617f	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2000-04-01	user	2026-04-01 01:21:58.754478+07	2026-04-01 01:21:58.754478+07
bd49ab84-0153-494f-8ce6-c980db9edafb	Sari Jumadi	\N	0a2e3830ca64b06d2b217b65afc69643a182a7ea9abcded0791a250f19199a07c21665d9be13efc74244	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1999-04-01	user	2026-04-01 01:21:58.757934+07	2026-04-01 01:21:58.757934+07
3677daea-cb32-469f-bb42-f729889772fa	Tri Kustarto	\N	d3850cb583e66992a2c0cc27d072128b8a4f22f3c7b2855a844684f02b5d887343bc8ce353ea97ca7f0f	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1998-04-01	user	2026-04-01 01:21:58.760072+07	2026-04-01 01:21:58.760072+07
0bea5eb5-8841-4a37-bfc3-25d9cf15c937	Udin Lismanto	\N	d047ba9d642fb2599b8f3d4845efdcefd592e1d46c929cbb9cb82a666844caa7901ca842f07aa2870409	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1997-04-01	user	2026-04-01 01:21:58.762203+07	2026-04-01 01:21:58.762203+07
c3eef0b4-6e64-4a1f-afcc-010c39debab2	Vicky Mukhlas	\N	69749e5b1747abd41dd5acbda5eb6c61060c28eb9be02589898fcc34f7420cab4d14588f92ba722ad549	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1996-04-01	user	2026-04-01 01:21:58.763889+07	2026-04-01 01:21:58.763889+07
53e33ab5-82d0-412d-93b7-97ba5c65e23f	Yoga Oerip	\N	d729981d9641dd83609c8c3b138fa714776bbdd4e85bae777aa6d5ae04c0ab45ee79018528c39278f7a7	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	2004-04-01	user	2026-04-01 01:21:58.766539+07	2026-04-01 01:21:58.766539+07
440f3f2d-d52d-4277-96fc-61942cfd1c3e	Zulfan Prasetya	\N	46adf4fb660cb39b1b4ede0ba045ba5fcfc4dd8294e7f6299480f13c20e440022ee2537107cb249dabcd	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1972-04-01	user	2026-04-01 01:21:58.767626+07	2026-04-01 01:21:58.767626+07
a6df18e3-3950-4374-a2e6-ae98487955ce	Adinda Rachmat	\N	6ae94c4ffa98685a9a3282eb761b7d1b306d5456fea1e44f3e0b4444edba46e12c6907900524c4860909	$2a$10$I73aReMxNEfRRe7AkV/Sbe9DZtyRtB/N9s4Z1fnj2YrM9WjMvglRe	1971-04-01	user	2026-04-01 01:21:58.769317+07	2026-04-01 01:21:58.769317+07
\.


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 223
-- Name: request_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_logs_id_seq', 432, true);


--
-- TOC entry 4930 (class 2606 OID 25514)
-- Name: diagnoses diagnoses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 25587)
-- Name: request_logs request_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_logs
    ADD CONSTRAINT request_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4922 (class 2606 OID 25235)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4939 (class 2606 OID 25744)
-- Name: user_devices unique_user_device; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT unique_user_device UNIQUE (user_id, device_fingerprint);


--
-- TOC entry 4941 (class 2606 OID 25742)
-- Name: user_devices user_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT user_devices_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 25601)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4926 (class 2606 OID 25485)
-- Name: users users_nik_encrypted_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nik_encrypted_key UNIQUE (nik_encrypted);


--
-- TOC entry 4928 (class 2606 OID 25481)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 1259 OID 25593)
-- Name: idx_request_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_request_logs_created_at ON public.request_logs USING btree (created_at);


--
-- TOC entry 4932 (class 1259 OID 25594)
-- Name: idx_request_logs_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_request_logs_path ON public.request_logs USING btree (path);


--
-- TOC entry 4933 (class 1259 OID 25595)
-- Name: idx_request_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_request_logs_user_id ON public.request_logs USING btree (user_id);


--
-- TOC entry 4936 (class 1259 OID 25751)
-- Name: idx_user_devices_user_fingerprint; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_devices_user_fingerprint ON public.user_devices USING btree (user_id, device_fingerprint);


--
-- TOC entry 4937 (class 1259 OID 25750)
-- Name: idx_user_devices_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_devices_user_id ON public.user_devices USING btree (user_id);


--
-- TOC entry 4942 (class 2606 OID 25520)
-- Name: diagnoses diagnoses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4943 (class 2606 OID 25515)
-- Name: diagnoses diagnoses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 25673)
-- Name: diagnoses fk_users_created_diagnoses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT fk_users_created_diagnoses FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4945 (class 2606 OID 25668)
-- Name: diagnoses fk_users_patient_diagnoses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT fk_users_patient_diagnoses FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4947 (class 2606 OID 25754)
-- Name: user_devices fk_users_user_devices; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT fk_users_user_devices FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4946 (class 2606 OID 25588)
-- Name: request_logs request_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_logs
    ADD CONSTRAINT request_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4948 (class 2606 OID 25745)
-- Name: user_devices user_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT user_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-04-05 00:33:21

--
-- PostgreSQL database dump complete
--

\unrestrict nwjWqmylglnDOA8DjdfUstTF9fyJyOlT3545RT7ivbfgzwoebM19dFN0qprJ4PC

