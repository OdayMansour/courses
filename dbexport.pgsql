--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.7
-- Dumped by pg_dump version 9.5.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE categories (
    id integer NOT NULL,
    name character varying(120)
);


ALTER TABLE categories OWNER TO courses;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE category_id_seq OWNER TO courses;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE category_id_seq OWNED BY categories.id;


--
-- Name: households; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE households (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);


ALTER TABLE households OWNER TO courses;

--
-- Name: household_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE household_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE household_id_seq OWNER TO courses;

--
-- Name: household_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE household_id_seq OWNED BY households.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE items (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    categoryid integer DEFAULT 0
);


ALTER TABLE items OWNER TO courses;

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE item_id_seq OWNER TO courses;

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE item_id_seq OWNED BY items.id;


--
-- Name: lists; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE lists (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    templateid integer DEFAULT 0,
    userid integer NOT NULL,
    shared boolean DEFAULT false
);


ALTER TABLE lists OWNER TO courses;

--
-- Name: list_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE list_id_seq OWNER TO courses;

--
-- Name: list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE list_id_seq OWNED BY lists.id;


--
-- Name: list_item; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE list_item (
    listid integer NOT NULL,
    itemid integer NOT NULL
);


ALTER TABLE list_item OWNER TO courses;

--
-- Name: list_share; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE list_share (
    listid integer NOT NULL,
    userid integer,
    householdid integer,
    startdate date NOT NULL,
    enddate date
);


ALTER TABLE list_share OWNER TO courses;

--
-- Name: templates; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE templates (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    listid integer NOT NULL
);


ALTER TABLE templates OWNER TO courses;

--
-- Name: template_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE template_id_seq OWNER TO courses;

--
-- Name: template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE template_id_seq OWNED BY templates.id;


--
-- Name: user_household; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE user_household (
    userid integer NOT NULL,
    householdid integer NOT NULL
);


ALTER TABLE user_household OWNER TO courses;

--
-- Name: users; Type: TABLE; Schema: public; Owner: courses
--

CREATE TABLE users (
    id integer NOT NULL,
    username character varying(40) NOT NULL,
    firstname character varying(128) NOT NULL,
    lastname character varying(128) NOT NULL,
    email character varying(256) NOT NULL,
    country character(2) NOT NULL,
    password character(32) NOT NULL,
    salt character(32) NOT NULL
);


ALTER TABLE users OWNER TO courses;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: courses
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO courses;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: courses
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('category_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY households ALTER COLUMN id SET DEFAULT nextval('household_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY items ALTER COLUMN id SET DEFAULT nextval('item_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY lists ALTER COLUMN id SET DEFAULT nextval('list_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY templates ALTER COLUMN id SET DEFAULT nextval('template_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: courses
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY categories (id, name) FROM stdin;
\.


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('category_id_seq', 1, false);


--
-- Name: household_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('household_id_seq', 1, true);


--
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY households (id, name) FROM stdin;
1	Vincennes
\.


--
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('item_id_seq', 14, true);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY items (id, name, categoryid) FROM stdin;
1	Farine	0
2	Savon	0
3	Levure Chimique	0
4	Plante	0
5	Cadre	0
6	Miroir	0
7	Tableau	0
8	Sopalin	0
9	Serviettes	0
11	Loofah	0
12	Bureau	0
\.


--
-- Name: list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('list_id_seq', 3, true);


--
-- Data for Name: list_item; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY list_item (listid, itemid) FROM stdin;
1	1
1	2
1	3
2	4
2	5
2	6
2	7
3	8
3	9
3	11
2	12
\.


--
-- Data for Name: list_share; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY list_share (listid, userid, householdid, startdate, enddate) FROM stdin;
\.


--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY lists (id, name, templateid, userid, shared) FROM stdin;
1	Cuisine	0	3	f
2	Salon	0	3	f
3	Salle de bain	0	3	f
\.


--
-- Name: template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('template_id_seq', 1, false);


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY templates (id, name, listid) FROM stdin;
\.


--
-- Data for Name: user_household; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY user_household (userid, householdid) FROM stdin;
2	1
3	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: courses
--

COPY users (id, username, firstname, lastname, email, country, password, salt) FROM stdin;
2	melody	Melody	Allouche	melody.allouche@gmail.com	FR	00000000000000000000000000000000	00000000000000000000000000000000
3	oday	Oday	Mansour	odaym@nsour.net	FR	00000000000000000000000000000000	00000000000000000000000000000000
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: courses
--

SELECT pg_catalog.setval('users_id_seq', 3, true);


--
-- Name: category_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: household_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY households
    ADD CONSTRAINT household_pkey PRIMARY KEY (id);


--
-- Name: item_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY items
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: list_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY lists
    ADD CONSTRAINT list_pkey PRIMARY KEY (id);


--
-- Name: template_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY templates
    ADD CONSTRAINT template_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: courses
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

